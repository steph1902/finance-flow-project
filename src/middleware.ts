import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

const middleware = createMiddleware({
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale,

    // Always show locale in URL for clarity
    localePrefix: 'always',

    // Detect locale from various sources
    localeDetection: true
});

export default function middlewareWrapper(request: any) {
    try {
        return middleware(request);
    } catch (error) {
        console.error('[middleware] Error in next-intl middleware:', error);
        // Return request as-is if middleware fails
        return new Response(null, {
            status: 307,
            headers: {
                Location: `/${defaultLocale}${request.nextUrl.pathname}`
            }
        });
    }
}

export const config = {
    // Match all pathnames except for:
    // - API routes (/api/*)
    // - Next.js internals (/_next/*)
    // - Static files (has file extension)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
