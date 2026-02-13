import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

// Environment mapping
const plaidEnvMap: Record<string, string> = {
    sandbox: PlaidEnvironments.sandbox as string,
    development: PlaidEnvironments.development as string,
    production: PlaidEnvironments.production as string,
};

let plaidClient: PlaidApi | null = null;

/**
 * Initialize Plaid client
 */
export function getPlaidClient(): PlaidApi {
    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
        throw new Error('Plaid credentials not configured. Set PLAID_CLIENT_ID and PLAID_SECRET in environment variables.');
    }

    if (!plaidClient) {
        const configuration = new Configuration({
            basePath: plaidEnvMap[PLAID_ENV],
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
                    'PLAID-SECRET': PLAID_SECRET,
                },
            },
        });

        plaidClient = new PlaidApi(configuration);
    }

    return plaidClient;
}
