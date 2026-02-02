import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const feedback = await prisma.visitorFeedback.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(feedback);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    // Feedback submission might be public, but let's rate limit or check session if needed.
    // For now, allowing public submission but we should validate inputs.

    try {
        const body = await req.json();
        const { name, email, message, rating } = body;

        const feedback = await prisma.visitorFeedback.create({
            data: {
                name,
                email,
                message,
                rating: rating || 0,
            },
        });

        return NextResponse.json(feedback);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
