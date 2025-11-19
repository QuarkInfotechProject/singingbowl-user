import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("isLoggedIn");
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    throw new Error("Server error");
  }
}
