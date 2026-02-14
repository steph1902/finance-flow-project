import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiAuth } from "@/lib/auth-helpers";
import { ENV } from "@/lib/env";

export const POST = withApiAuth(async (request, userId) => {
  try {
    const { id, value } = await request.json();

    // 1. Fetch current user keys
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { apiKeys: true },
    });

    const currentKeys = (user?.apiKeys as Record<string, string>) || {};

    // 2. Update with new key
    const updatedKeys = {
      ...currentKeys,
      [id]: value,
    };

    // 3. Save to database
    await prisma.user.update({
      where: { id: userId },
      data: { apiKeys: updatedKeys },
    });

    return NextResponse.json({
      success: true,
      message: "API key updated successfully",
    });
  } catch (error) {
    console.error("Failed to update API key:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 },
    );
  }
});

export const GET = withApiAuth(async (request, userId) => {
  try {
    // 1. Fetch user keys from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { apiKeys: true },
    });

    const userKeys = (user?.apiKeys as Record<string, string>) || {};

    // 2. Prepare merged keys (DB takes precedence, fall back to Env)
    // We mask the keys for security
    const maskKey = (key: string | undefined) => {
      if (!key) return undefined;
      if (key.length <= 4) return "****";
      return `****${key.slice(-4)}`;
    };

    // Helper to check if key exists in DB or Env
    const getKeyStatus = (
      dbKey: string | undefined,
      envKey: string | undefined,
    ) => {
      return dbKey || envKey || undefined;
    };

    const keys = {
      "gemini-ai": getKeyStatus(
        userKeys["gemini-ai"],
        process.env.GEMINI_API_KEY,
      ),
      resend: getKeyStatus(userKeys["resend"], process.env.RESEND_API_KEY),
      database: getKeyStatus(userKeys["database"], process.env.DATABASE_URL),
      "google-oauth": getKeyStatus(
        userKeys["google-oauth"],
        process.env.GOOGLE_CLIENT_ID,
      ),
      nextauth: getKeyStatus(userKeys["nextauth"], process.env.NEXTAUTH_SECRET),
    };

    // If returned to UI, we might want to return masked versions or just boolean "isConfigured"
    // The current UI seems to expect the value to populate the field?
    // Actually, for security, usually we don't return the full key.
    // But the UI might expect it to show "Configured".
    // Let's return the masked values so the UI knows it exists.

    const maskedKeys = {
      "gemini-ai": maskKey(keys["gemini-ai"]),
      resend: maskKey(keys["resend"]),
      database: maskKey(keys["database"]), // Database URL is long, masking last 4 is fine
      "google-oauth": maskKey(keys["google-oauth"]),
      nextauth: maskKey(keys["nextauth"]),
    };

    // Wait, the UI uses `value` to show in the input?
    // If we return masked, the input will show allowed chars.
    // Let's check the UI component.
    // If the user saves, they overwrite with new value.
    // If they don't touch it, we don't want to save the "masked" value back.
    // Typically, we return empty string if configured, or undefined if not.
    // The UI `ApiKeyCard` likely handles this.

    // Re-reading page.tsx:
    // const configuredCount = apiKeys.filter(k => k.value).length;
    // It counts based on value presence.

    return NextResponse.json({ keys: maskedKeys });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 },
    );
  }
});
