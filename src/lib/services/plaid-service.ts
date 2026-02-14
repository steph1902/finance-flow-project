import {
  Products,
  CountryCode,
  LinkTokenCreateResponse,
  ItemPublicTokenExchangeResponse,
  TransactionsGetResponse,
  InstitutionsGetByIdResponse,
  ItemGetResponse,
} from "plaid";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import { getPlaidClient } from "@/lib/plaid";

/**
 * Encrypt access token for secure storage
 */
function encryptToken(token: string): string {
  const algorithm = "aes-256-gcm";
  const key = crypto.scryptSync(
    process.env.NEXTAUTH_SECRET || "default-key",
    "salt",
    32,
  );
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt access token
 */
function decryptToken(encryptedToken: string): string {
  const algorithm = "aes-256-gcm";
  const key = crypto.scryptSync(
    process.env.NEXTAUTH_SECRET || "default-key",
    "salt",
    32,
  );

  const parts = encryptedToken.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format");
  }

  const [ivHex, authTagHex, encrypted] = parts as [string, string, string];
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted =
    decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

  return decrypted;
}

/**
 * Create a Link token for Plaid Link initialization
 */
export async function createLinkToken(userId: string): Promise<string> {
  try {
    const client = getPlaidClient();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const response = await client.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: "FinanceFlow",
      products: ["transactions" as Products],
      country_codes: ["us" as CountryCode],
      language: "en",
    });

    const data: LinkTokenCreateResponse = response.data;
    logger.info("Link token created", { userId });
    return data.link_token;
  } catch (error: unknown) {
    logger.error("Failed to create link token", error);
    throw new Error("Failed to initialize bank connection");
  }
}

/**
 * Exchange public token for access token and store
 */
export async function exchangePublicToken(
  userId: string,
  publicToken: string,
): Promise<{ itemId: string; institutionName: string }> {
  try {
    const client = getPlaidClient();

    // Exchange public token
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const tokenData: ItemPublicTokenExchangeResponse = tokenResponse.data;
    const accessToken = tokenData.access_token;
    const itemId = tokenData.item_id;

    // Get institution info
    const itemResponse = await client.itemGet({
      access_token: accessToken,
    });

    const itemData: ItemGetResponse = itemResponse.data;
    const institutionId = itemData.item.institution_id;
    if (!institutionId) {
      throw new Error("Institution ID not found in Plaid item");
    }

    const institutionResponse = await client.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["us" as CountryCode],
    });

    const institutionData: InstitutionsGetByIdResponse =
      institutionResponse.data;
    const institutionName = institutionData.institution.name;

    // Encrypt and store
    const encryptedToken = encryptToken(accessToken);

    await prisma.plaidItem.create({
      data: {
        userId,
        itemId,
        accessToken: encryptedToken,
        institutionId,
        institutionName,
        isActive: true,
      },
    });

    logger.info("Plaid item connected", { userId, institutionName });

    return { itemId, institutionName };
  } catch (error: unknown) {
    logger.error("Failed to exchange public token", error);
    throw new Error("Failed to connect bank account");
  }
}

/**
 * Sync transactions from Plaid for a user
 */
export async function syncTransactions(userId: string): Promise<number> {
  try {
    const client = getPlaidClient();

    // Get all active Plaid items for user
    const plaidItems = await prisma.plaidItem.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    if (plaidItems.length === 0) {
      return 0;
    }

    let totalSynced = 0;

    for (const item of plaidItems) {
      try {
        const accessToken = decryptToken(item.accessToken);

        // Get transactions from last sync or last 30 days
        const startDate = item.lastSync
          ? new Date(item.lastSync)
          : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const endDate = new Date();

        const startDateStr = startDate.toISOString().split("T")[0]!;
        const endDateStr = endDate.toISOString().split("T")[0]!;

        const response = await client.transactionsGet({
          access_token: accessToken,
          start_date: startDateStr,
          end_date: endDateStr,
        });

        const data: TransactionsGetResponse = response.data;
        const transactions = data.transactions;

        // Import transactions
        for (const txn of transactions) {
          // Check if already exists
          const existing = await prisma.transaction.findFirst({
            where: {
              userId,
              description: txn.name,
              amount: Math.abs(txn.amount),
              date: new Date(txn.date),
            },
          });

          if (!existing) {
            await prisma.transaction.create({
              data: {
                userId,
                description: txn.name,
                amount: Math.abs(txn.amount),
                type: txn.amount < 0 ? "EXPENSE" : "INCOME",
                category: mapPlaidCategory(txn.category?.[0] || "Other"),
                date: new Date(txn.date),
                notes: `Imported from ${item.institutionName}`,
              },
            });
            totalSynced++;
          }
        }

        // Update last sync time
        await prisma.plaidItem.update({
          where: { id: item.id },
          data: { lastSync: new Date() },
        });

        logger.info("Transactions synced", {
          userId,
          itemId: item.id,
          count: transactions.length,
        });
      } catch (error: unknown) {
        logger.error("Failed to sync transactions for item", {
          itemId: item.id,
          error,
        });
        // Continue with other items
      }
    }

    return totalSynced;
  } catch (error: unknown) {
    logger.error("Failed to sync transactions", error);
    throw new Error("Failed to sync bank transactions");
  }
}

/**
 * Map Plaid category to app category
 */
function mapPlaidCategory(plaidCategory: string): string {
  const categoryMap: Record<string, string> = {
    FOOD_AND_DRINK: "Food & Dining",
    GENERAL_MERCHANDISE: "Shopping",
    SHOPS: "Shopping",
    TRANSPORTATION: "Transportation",
    TRAVEL: "Travel",
    HEALTHCARE: "Healthcare",
    ENTERTAINMENT: "Entertainment",
    TRANSFER: "Transfer",
    PAYMENT: "Bills & Utilities",
    INCOME: "Salary",
  };

  const mapped = Object.keys(categoryMap).find((key) =>
    plaidCategory.toUpperCase().includes(key),
  );

  return (mapped && categoryMap[mapped]) ?? "Other";
}

/**
 * Remove a Plaid item
 */
export async function removePlaidItem(
  userId: string,
  itemId: string,
): Promise<void> {
  try {
    const client = getPlaidClient();

    const item = await prisma.plaidItem.findFirst({
      where: {
        userId,
        itemId,
      },
    });

    if (!item) {
      throw new Error("Item not found");
    }

    const accessToken = decryptToken(item.accessToken);

    // Remove from Plaid
    await client.itemRemove({
      access_token: accessToken,
    });

    // Remove from database
    await prisma.plaidItem.delete({
      where: { id: item.id },
    });

    logger.info("Plaid item removed", { userId, itemId });
  } catch (error: unknown) {
    logger.error("Failed to remove Plaid item", error);
    throw new Error("Failed to disconnect bank account");
  }
}

/**
 * Get all connected banks for a user
 */
export async function getConnectedBanks(userId: string) {
  return prisma.plaidItem.findMany({
    where: { userId },
    select: {
      id: true,
      itemId: true,
      institutionName: true,
      isActive: true,
      lastSync: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Check if Plaid is configured
 */
export function isPlaidConfigured(): boolean {
  return !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);
}
