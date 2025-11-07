import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id ?? null;
}

export function withApiAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req, userId);
  };
}

