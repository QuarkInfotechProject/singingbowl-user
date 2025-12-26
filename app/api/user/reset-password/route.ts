import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        const res = await fetch(`${process.env.BASE_URL}/user/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();

        if (res.ok) {
            return NextResponse.json({
                success: true,
                message: data.message || "Password reset successfully",
            });
        } else {
            return NextResponse.json(data, { status: res.status });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
