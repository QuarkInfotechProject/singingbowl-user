import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const apiClient = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ params: string[] }> }
) {
    try {
        const routeParams = await context.params;
        // params will be [orderId, amount, uuid]
        const [orderId, amount, uuid] = routeParams.params;

        // Get token from query params (added by GetPay)
        const token = request.nextUrl.searchParams.get("token");

        console.log("=== Payment Fail Callback ===");
        console.log("Order ID:", orderId);
        console.log("Amount:", amount);
        console.log("UUID:", uuid);
        console.log("Token present:", !!token);

        // Forward to backend with the correct format
        const cookieStore = await cookies();
        const authToken = cookieStore.get("token")?.value;

        const headers: Record<string, string> = {};
        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }

        // Call backend fail endpoint
        const backendUrl = `/user/orders/payment-fail?orderId=${orderId}&amount=${amount}&uuid=${uuid}${token ? `&token=${token}` : ""}`;
        console.log("Backend URL:", backendUrl);

        try {
            await apiClient.get(backendUrl, { headers });
        } catch (e) {
            // Backend might not have a fail endpoint, that's ok
            console.log("Backend fail endpoint error (may be ok):", e);
        }

        // Redirect to checkout with error
        const prodOrigin = "https://www.singingbowlvillagenepal.com";
        return NextResponse.redirect(
            new URL(`/checkout?error=payment_failed&orderId=${orderId}`, prodOrigin)
        );
    } catch (error: any) {
        console.error("Payment fail callback error:", error.message);

        // Redirect to checkout with generic error
        const prodOrigin = "https://www.singingbowlvillagenepal.com";
        return NextResponse.redirect(
            new URL("/checkout?error=payment_failed", prodOrigin)
        );
    }
}
