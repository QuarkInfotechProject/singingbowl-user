import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        const res = await fetch(`${process.env.BASE_URL}/user/general-support/create`, {
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
                message: data.message || "Message sent successfully",
                data: data.data,
            });
        } else {
            return NextResponse.json(data, { status: res.status });
        }
    } catch (error) {
        console.error("General support form error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
