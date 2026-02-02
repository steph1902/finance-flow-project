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
        const versions = await prisma.projectVersion.findMany({
            orderBy: { deployedAt: "desc" },
        });

        return NextResponse.json(versions);
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
        const { version, changelog, deployer, environment } = body;

        // If this is the new current version, unset others
        await prisma.projectVersion.updateMany({
            where: { isCurrent: true },
            data: { isCurrent: false },
        });

        const newVersion = await prisma.projectVersion.create({
            data: {
                version,
                changelog,
                deployer,
                environment,
                isCurrent: true,
            },
        });

        return NextResponse.json(newVersion);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
