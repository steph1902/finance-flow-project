import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/utils/error';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        return NextResponse.json({
            status: 'ok',
            hasSession: !!session,
            user: session?.user,
            headers: {
                cookie: req.headers.get('cookie') ? 'present' : 'missing',
                authorization: req.headers.get('authorization')
            },
            env: {
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                HAS_SECRET: !!process.env.NEXTAUTH_SECRET
            }
        });
    } catch (error: unknown) {
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
    }
}
