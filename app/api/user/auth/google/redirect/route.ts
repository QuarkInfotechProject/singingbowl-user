import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const returnUrl =
            request.nextUrl.searchParams.get("returnUrl") ||
            process.env.SITE_ORIGIN ||
            "/";

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const siteOrigin = process.env.SITE_ORIGIN;

        if (!clientId) {
            console.error("GOOGLE_CLIENT_ID is not set in environment variables");
            return NextResponse.json(
                { error: "Google OAuth is not configured" },
                { status: 500 }
            );
        }

        if (!siteOrigin) {
            console.error("SITE_ORIGIN is not set in environment variables");
            return NextResponse.json(
                { error: "Site origin is not configured" },
                { status: 500 }
            );
        }

        // Generate a state parameter to pass the return URL and prevent CSRF
        const state = {
            returnUrl,
            nonce: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        const encodedState = Buffer.from(JSON.stringify(state)).toString('base64');

        // Build the redirect URI - this MUST match what's in Google Cloud Console
        const redirectUri = `${siteOrigin}/api/user/auth/google/callback`;

        // Build Google OAuth URL directly
        const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        googleAuthUrl.searchParams.set("client_id", clientId);
        googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
        googleAuthUrl.searchParams.set("response_type", "code");
        googleAuthUrl.searchParams.set("scope", "openid email profile");
        googleAuthUrl.searchParams.set("state", encodedState);
        googleAuthUrl.searchParams.set("access_type", "offline");
        googleAuthUrl.searchParams.set("prompt", "consent");

        return NextResponse.json({ redirectUrl: googleAuthUrl.toString() });
    } catch (error: any) {
        console.error("Google redirect error:", error);
        return NextResponse.json(
            { error: "Failed to initiate Google sign in" },
            { status: 500 }
        );
    }
}
