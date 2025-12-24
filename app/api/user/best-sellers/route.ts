import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const res = await fetch(`${process.env.BASE_URL}/user/best-sellers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        const data = await res.json();

        if (res.ok) {
            return NextResponse.json({
                success: true,
                data: data.data || data,
            });
        } else {
            return NextResponse.json(data, { status: res.status });
        }
    } catch (error) {
        console.error("Best sellers fetch error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
