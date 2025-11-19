import server from "@/lib/server";
import { addDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

interface State {
  returnUrl: string;
  nonce: string;
  timestamp: number;
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    if (!code) {
      return NextResponse.json({ error: "No code found" }, { status: 400 });
    }
    const siteURL = new URL(process.env.SITE_ORIGIN!);
    const { data } = await server.get("/auth/google/callback", {
      params: {
        code,
      },
    });

    const expiresAt = addDays(new Date(), 30);
    const parsedState: State | null = state ? JSON.parse(atob(state)) : null;
    const returnUrl = parsedState?.returnUrl.startsWith(siteURL.origin) ? parsedState.returnUrl : siteURL.origin;
    const response = NextResponse.redirect(returnUrl);

    response.cookies.set({
      name: "token",
      value: data.data.token,
      httpOnly: true,
      sameSite: false,
      secure: false,
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

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}
