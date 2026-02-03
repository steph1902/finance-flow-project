import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        // Mock test functionality
        // In production, you would actually test the API key connection
        const testResults: Record<string, boolean> = {
            "gemini-ai": Boolean(process.env.GEMINI_API_KEY),
            "resend": Boolean(process.env.RESEND_API_KEY),
            "database": Boolean(process.env.DATABASE_URL),
        };

        const success = testResults[id || ""] || false;

        return NextResponse.json({ success });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
