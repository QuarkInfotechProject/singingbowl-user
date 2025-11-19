import { addDays } from "date-fns";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const res = await fetch(`${process.env.BASE_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (res.ok) {
      const tokenValue = data.data.token;
      const expiresAt = addDays(new Date(), 30);
      const cookieStore = await cookies();

      cookieStore.set({
        name: "token",
        value: tokenValue,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: expiresAt,
      });
      cookieStore.set({
        name: "isLoggedIn",
        value: "true",
        httpOnly: false,
        path: "/",
        expires: expiresAt,
      });
      return NextResponse.json({
        success: true,
      });
    } else {
      return NextResponse.json(data, { status: res.status });
    }
  } catch (error) {
    throw new Error("Server error");
  }
}
