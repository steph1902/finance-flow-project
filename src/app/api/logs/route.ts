import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const level = searchParams.get("level");
    const category = searchParams.get("category");

    const where: any = {};
    if (level) where.level = level;
    if (category) where.category = category;

    try {
        const [logs, total] = await Promise.all([
            prisma.systemLog.findMany({
                where,
                orderBy: { timestamp: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.systemLog.count({ where }),
        ]);

        return NextResponse.json({
            logs,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { level, category, message, metadata } = body;

        const log = await prisma.systemLog.create({
            data: {
                level,
                category,
                message,
                metadata: metadata || {},
            },
        });

        return NextResponse.json(log);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
