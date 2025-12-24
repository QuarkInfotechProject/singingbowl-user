import server from "@/lib/server";
import { addDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

interface State {
  returnUrl: string;
  nonce: string;
  timestamp: number;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const error = request.nextUrl.searchParams.get("error");

    const siteOrigin = process.env.SITE_ORIGIN;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!siteOrigin) {
      console.error("SITE_ORIGIN is not set");
      return NextResponse.redirect(new URL("/login?error=config_error", siteOrigin || "/"));
    }

    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(new URL(`/login?error=${error}`, siteOrigin));
    }

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(new URL("/login?error=no_code", siteOrigin));
    }

    if (!clientId || !clientSecret) {
      console.error("Google OAuth credentials not configured");
      return NextResponse.redirect(new URL("/login?error=config_error", siteOrigin));
    }

    const siteURL = new URL(siteOrigin);
    const redirectUri = `${siteOrigin}/api/user/auth/google/callback`;

    // Exchange authorization code for tokens
    console.log("Exchanging code for tokens...");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange failed:", errorData);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", siteOrigin));
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();
    console.log("Token exchange successful");

    // Get user info from Google
    console.log("Fetching user info from Google...");
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error("Failed to get user info");
      return NextResponse.redirect(new URL("/login?error=user_info_failed", siteOrigin));
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();
    console.log("Got Google user info:", { email: userInfo.email, name: userInfo.name });

    // Send user info to backend for authentication/registration
    console.log("Authenticating with backend...");
    const { data } = await server.post("/user/auth/google/login", {
      email: userInfo.email,
      name: userInfo.name,
      google_id: userInfo.id,
      avatar: userInfo.picture,
      id_token: tokens.id_token,
      access_token: tokens.access_token,
    });

    console.log("Backend authentication response:", data);

    // Parse state to get return URL
    const parsedState: State | null = state ? JSON.parse(Buffer.from(state, 'base64').toString('utf-8')) : null;
    const returnUrl = parsedState?.returnUrl?.startsWith(siteURL.origin)
      ? parsedState.returnUrl
      : siteURL.origin;

    const expiresAt = addDays(new Date(), 30);
    const response = NextResponse.redirect(returnUrl);

    // Set authentication cookies
    response.cookies.set({
      name: "token",
      value: data.data.token,
      httpOnly: true,
      sameSite: "lax",
      secure: siteOrigin.startsWith("https"),
      path: "/",
      expires: expiresAt,
    });
    response.cookies.set({
      name: "isLoggedIn",
      value: "true",
      httpOnly: false,
      path: "/",
      expires: expiresAt,
    });

    console.log("Authentication successful, redirecting to:", returnUrl);
    return response;
  } catch (error: any) {
    console.error("Google callback error:", error?.response?.data || error);
    const siteOrigin = process.env.SITE_ORIGIN || "/";
    return NextResponse.redirect(new URL("/login?error=auth_failed", siteOrigin));
  }
}
