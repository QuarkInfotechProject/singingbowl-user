import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    cookies().delete("token");
    cookies().delete("isLoggedIn");
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    throw new Error("Server error");
  }
}
