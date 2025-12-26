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
    const prodOrigin = process.env.SITE_ORIGIN;

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
        const getPayToken = request.nextUrl.searchParams.get("token");

        console.log("=== Payment Success Callback ===");
        console.log("Full URL:", request.nextUrl.toString());
        console.log("Payment Method:", paymentMethod);
        console.log("Order ID:", orderId);
        console.log("GetPay Token present:", !!getPayToken);
        console.log("Raw params:", paramsArray);

        // Decode the GetPay token to extract transaction info
        // The token is base64 encoded JSON: {"id": "transactionId", "oprSecret": "..."}
        let transactionId: string | null = null;
        if (getPayToken) {
            try {
                const decoded = Buffer.from(getPayToken, 'base64').toString('utf-8');
                const decodedData = JSON.parse(decoded);
                transactionId = decodedData.id || null;
                console.log("Decoded GetPay token:", decodedData);
                console.log("Transaction ID extracted:", transactionId);
            } catch (e) {
                console.log("Token decode error (may not be base64):", e);
                // If not base64, the token itself might be the transaction ID
                transactionId = getPayToken;
            }
        }

        // Get auth token from cookies
        const cookieStore = await cookies();
        const authToken = cookieStore.get("token")?.value;

        // Log cookies for debugging
        const allCookies = cookieStore.getAll();
        console.log("All cookies names:", allCookies.map(c => c.name));
        console.log("Auth token found:", !!authToken);
        if (authToken) {
            console.log("Auth token (first 50 chars):", authToken.substring(0, 50) + "...");
        }

        const headers: Record<string, string> = {};
        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
            console.log("Authorization header set");
        } else {
            console.error("WARNING: No auth token found in cookies!");
        }

        // Backend expects path parameters: /user/orders/success/{paymentMethod}/{orderId}
        // And the RAW GetPay token (base64 string) in the request body
        // The backend will decode and verify this token itself
        const requestBody = {
            token: getPayToken, // Send the RAW token as received from GetPay
        };

        // Build the correct backend URL with path parameters
        const backendUrl = `/user/orders/success/${paymentMethod}/${orderId}`;
        console.log("Sending POST to backend:", backendUrl);
        console.log("Token being sent (first 50 chars):", getPayToken?.substring(0, 50) + "...");

        const response = await apiClient.post(backendUrl, requestBody, { headers });
        console.log("Backend response:", response.data);

        // Return HTML that redirects the TOP window (breaks out of iframe)
        const successUrl = `${prodOrigin}/profile?tab=orders&payment=success`;
        const successHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Successful</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    }
                    .container {
                        text-align: center;
                        padding: 40px;
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    .success-icon { font-size: 64px; margin-bottom: 16px; }
                    h1 { color: #10b981; margin-bottom: 8px; }
                    p { color: #6b7280; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon">✅</div>
                    <h1>Payment Successful!</h1>
                    <p>Redirecting to your orders...</p>
                </div>
                <script>
                    // Redirect the top/parent window to break out of iframe
                    if (window.top !== window.self) {
                        window.top.location.href = "${successUrl}";
                    } else {
                        window.location.href = "${successUrl}";
                    }
                </script>
            </body>
            </html>
        `;

        return new NextResponse(successHtml, {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
    } catch (error: any) {
        console.error("=== Payment Success Callback ERROR ===");
        console.error("Error message:", error.message);

        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", JSON.stringify(error.response.data));
        }
        if (error.config) {
            console.error("Request URL:", error.config.baseURL + error.config.url);
            console.error("Request method:", error.config.method);
            console.error("Request body:", JSON.stringify(error.config.data));
        }

        // Return HTML that redirects the TOP window with error (breaks out of iframe)
        const errorUrl = `${prodOrigin}/checkout?error=payment_verification_failed`;
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Error</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    }
                    .container {
                        text-align: center;
                        padding: 40px;
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    .error-icon { font-size: 64px; margin-bottom: 16px; }
                    h1 { color: #ef4444; margin-bottom: 8px; }
                    p { color: #6b7280; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="error-icon">⚠️</div>
                    <h1>Payment Verification Failed</h1>
                    <p>Redirecting back to checkout...</p>
                </div>
                <script>
                    // Redirect the top/parent window to break out of iframe
                    if (window.top !== window.self) {
                        window.top.location.href = "${errorUrl}";
                    } else {
                        window.location.href = "${errorUrl}";
                    }
                </script>
            </body>
            </html>
        `;

        return new NextResponse(errorHtml, {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
    }
}
