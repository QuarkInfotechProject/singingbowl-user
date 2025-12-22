import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const apiClient = axios.create({
    baseURL: process.env.BASE_URL || "https://api.singingbowlvillagenepal.com/api",
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ params: string[] }> }
) {
    const prodOrigin = "https://www.singingbowlvillagenepal.com";

    try {
        const routeParams = await context.params;
        // URL format: /api/user/orders/success/getPay/{orderId}
        // params will be ['getPay', '85'] or just ['85']
        const paramsArray = routeParams.params;

        // Extract orderId - it could be the last element or the only element
        let paymentMethod = "getPay";
        let orderId: string;

        if (paramsArray.length >= 2) {
            // Format: /success/getPay/85
            paymentMethod = paramsArray[0];
            orderId = paramsArray[1];
        } else {
            // Format: /success/85
            orderId = paramsArray[0];
        }

        // Get token from query params (added by GetPay after 3DS/payment)
        const token = request.nextUrl.searchParams.get("token");

        console.log("=== Payment Success Callback ===");
        console.log("Full URL:", request.nextUrl.toString());
        console.log("Payment Method:", paymentMethod);
        console.log("Order ID:", orderId);
        console.log("Token present:", !!token);
        console.log("Raw params:", paramsArray);

        // Decode the token if present to extract transaction info
        let decodedToken: { id?: string; oprSecret?: string } | null = null;
        if (token) {
            try {
                const decoded = Buffer.from(token, 'base64').toString('utf-8');
                decodedToken = JSON.parse(decoded);
                console.log("Decoded token:", decodedToken);
            } catch (e) {
                console.log("Token decode error:", e);
            }
        }

        // Forward to backend with the correct query params format
        const cookieStore = await cookies();
        const authToken = cookieStore.get("token")?.value;

        const headers: Record<string, string> = {};
        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }

        // Build backend URL with all necessary parameters
        // Backend expects: paymentMethod, orderId, and token for verification
        const backendParams = new URLSearchParams({
            paymentMethod,
            orderId,
        });

        // Add token if present
        if (token) {
            backendParams.append("token", token);
        }

        // Add transaction ID if decoded from token
        if (decodedToken?.id) {
            backendParams.append("transactionId", decodedToken.id);
        }

        // Add oprSecret if decoded from token
        if (decodedToken?.oprSecret) {
            backendParams.append("oprSecret", decodedToken.oprSecret);
        }

        const backendUrl = `/user/orders/success?${backendParams.toString()}`;
        console.log("Backend URL:", backendUrl);
        console.log("Auth token present:", !!authToken);

        const response = await apiClient.get(backendUrl, { headers });
        console.log("Backend response:", response.data);

        // Redirect to profile orders page on success
        return NextResponse.redirect(
            new URL("/profile?tab=orders&payment=success", prodOrigin)
        );
    } catch (error: any) {
        console.error("Payment success callback error:", error.response?.data || error.message);

        // Log more details for debugging
        if (error.response) {
            console.error("Error response status:", error.response.status);
            console.error("Error response data:", JSON.stringify(error.response.data));
        }

        // Redirect to checkout with error
        return NextResponse.redirect(
            new URL("/checkout?error=payment_verification_failed", prodOrigin)
        );
    }
}
