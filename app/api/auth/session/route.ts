import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ENV } from "@/lib/env";

const SECRET = new TextEncoder().encode(ENV.NEXTAUTH_SECRET);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const { payload } = await jwtVerify(token, SECRET);

    return NextResponse.json({
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
