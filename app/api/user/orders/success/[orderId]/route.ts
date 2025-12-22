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
    context: { params: Promise<{ orderId: string }> }
) {
    try {
        const params = await context.params;
        const orderId = params.orderId;

        // Get token from query params (added by GetPay)
        const token = request.nextUrl.searchParams.get("token");

        console.log("=== Payment Success Callback ===");
        console.log("Order ID:", orderId);
        console.log("Token present:", !!token);

        // Forward to backend with the correct format
        const cookieStore = await cookies();
        const authToken = cookieStore.get("token")?.value;

        const headers: Record<string, string> = {};
        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }

        // Call backend success endpoint with query params format
        const backendUrl = `/user/orders/success?paymentMethod=getPay&orderId=${orderId}${token ? `&token=${token}` : ""}`;
        console.log("Backend URL:", backendUrl);

        const response = await apiClient.get(backendUrl, { headers });
        console.log("Backend response:", response.data);

        // Redirect to profile orders page on success
        const prodOrigin = "https://www.singingbowlvillagenepal.com";
        return NextResponse.redirect(
            new URL("/profile?tab=orders&payment=success", prodOrigin)
        );
    } catch (error: any) {
        console.error("Payment success callback error:", error.response?.data || error.message);

        // Redirect to checkout with error
        const prodOrigin = "https://www.singingbowlvillagenepal.com";
        return NextResponse.redirect(
            new URL("/checkout?error=payment_verification_failed", prodOrigin)
        );
    }
}
