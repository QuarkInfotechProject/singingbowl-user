import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Call backend logout if token exists
    if (token) {
      try {
        await axios.post(`${process.env.BASE_URL}/user/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error("Backend logout failed:", error);
        // Continue to clear cookies anyway
      }
    }

    cookieStore.delete("token");
    cookieStore.delete("isLoggedIn");
    cookieStore.delete("rtoken"); // Clear refresh token as requested

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
