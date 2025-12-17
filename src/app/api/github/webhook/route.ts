import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * GitHub Webhook handler for automatic versioning
 * Creates a new version entry whenever code is pushed to the repository
 * 
 * Setup instructions:
 * 1. Go to GitHub repo → Settings → Webhooks → Add webhook
 * 2. Payload URL: https://your-domain.com/api/github/webhook
 * 3. Content type: application/json
 * 4. Secret: Set GITHUB_WEBHOOK_SECRET in your .env
 * 5. Events: Just the push event
 */

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
    if (!signature) return false;

    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
    try {
        const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('GITHUB_WEBHOOK_SECRET not configured');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }

        // Verify webhook signature
        const signature = req.headers.get('x-hub-signature-256');
        const payload = await req.text();

        if (!verifySignature(payload, signature, webhookSecret)) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(payload);

        // Only process push events
        if (!event.ref || !event.commits || event.commits.length === 0) {
            return NextResponse.json({ message: 'No commits to process' }, { status: 200 });
        }

        // Get the latest commit
        const latestCommit = event.commits[event.commits.length - 1];
        const branch = event.ref.replace('refs/heads/', '');

        // Only create versions for main/master/dev branches
        if (!['main', 'master', 'dev'].includes(branch)) {
            return NextResponse.json({ message: `Ignoring branch: ${branch}` }, { status: 200 });
        }

        // Extract version number from commit message (if present)
        // Format: "v1.2.3: message" or "1.2.3 - message"
        let version = `auto-${Date.now()}`;
        const versionMatch = latestCommit.message.match(/v?(\d+\.\d+\.\d+)/);
        if (versionMatch) {
            version = versionMatch[1];
        }

        // Create version entry
        const versionEntry = await prisma.projectVersion.create({
            data: {
                version: version,
                changelog: latestCommit.message,
                deployer: latestCommit.author.name,
                environment: branch === 'main' ? 'production' : 'development',
                isCurrent: branch === 'main', // Only main branch is current
            },
        });

        console.log(`✅ Created version: ${version} from commit ${latestCommit.id.substring(0, 7)}`);

        return NextResponse.json({
            success: true,
            version: versionEntry,
            message: `Version ${version} created successfully`,
        });

    } catch (error) {
        console.error('GitHub webhook error:', error);
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
}

// Handle GET requests (for webhook testing)
export async function GET() {
    return NextResponse.json({
        message: 'GitHub webhook endpoint is active',
        instructions: 'Send POST requests from GitHub webhooks',
    });
}
