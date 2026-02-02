import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const start = Date.now();
    let dbStatus = "healthy";
    let apiLatency = 0;

    try {
        await prisma.$queryRaw`SELECT 1`;
        apiLatency = Date.now() - start;
    } catch (e) {
        dbStatus = "error";
    }

    const healthData = {
        apiLatency,
        dbStatus,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        uptime: process.uptime(),
        vercelFunctionsHealth: "healthy", // Mocked for now
        services: [
            { name: "Database", status: dbStatus },
            { name: "Authentication", status: "healthy" },
            { name: "Storage", status: "healthy" },
        ],
        timestamp: new Date().toISOString(),
    };

    return NextResponse.json(healthData);
}
