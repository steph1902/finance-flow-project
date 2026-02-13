import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUserCurrency, SUPPORTED_CURRENCIES, Currency } from "@/lib/services/currency-service";
import { createErrorResponse } from "@/lib/api-error";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { currency } = body;

        // Validate currency
        if (!currency || !SUPPORTED_CURRENCIES.includes(currency as Currency)) {
            return NextResponse.json(
                { error: "Invalid currency. Must be one of: " + SUPPORTED_CURRENCIES.join(", ") },
                { status: 400 }
            );
        }

        await updateUserCurrency(session.user.id, currency as Currency);

        return NextResponse.json({ success: true, currency });
    } catch (error) {
        return createErrorResponse(error);
    }
}
