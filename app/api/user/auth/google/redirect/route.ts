import server from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const returnUrl =
            request.nextUrl.searchParams.get("returnUrl") ||
            process.env.SITE_ORIGIN ||
            "/";

        // Generate a state parameter to pass the return URL and prevent CSRF
        const state = {
            returnUrl,
            nonce: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        const encodedState = btoa(JSON.stringify(state));

        // Call the backend to get the Google OAuth redirect URL
        const { data } = await server.get("/user/auth/google/redirect", {
            params: {
                state: encodedState,
            },
        });

        console.log("Google redirect response:", JSON.stringify(data, null, 2));

        let redirectUrl: string | null = null;

        // The backend returns the redirect URL directly in data.data
        if (typeof data?.data === "string" && data.data.startsWith("http")) {
            redirectUrl = data.data;
        } else if (data?.data?.redirectUrl) {
            redirectUrl = data.data.redirectUrl;
        } else if (data?.data?.url) {
            redirectUrl = data.data.url;
        } else if (typeof data === "string" && data.startsWith("http")) {
            redirectUrl = data;
        }

        if (redirectUrl) {
            // Return the redirect URL as JSON for the client to navigate to
            return NextResponse.json({ redirectUrl });
        }

        console.error("Unexpected redirect response format:", data);
        return NextResponse.json(
            { error: "Could not get Google OAuth URL", data },
            { status: 500 }
        );
    } catch (error: any) {
        console.error("Google redirect error:", error?.response?.data || error);
        return NextResponse.json(
            { error: "Failed to initiate Google sign in" },
            { status: 500 }
        );
    }
}
