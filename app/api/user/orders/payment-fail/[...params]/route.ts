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

        // Return HTML that redirects the TOP window (breaks out of iframe)
        const prodOrigin = process.env.SITE_ORIGIN;
        const errorUrl = `${prodOrigin}/checkout?error=payment_failed&orderId=${orderId}`;
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Failed</title>
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
                    <div class="error-icon">❌</div>
                    <h1>Payment Failed</h1>
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
    } catch (error: any) {
        console.error("Payment fail callback error:", error.message);

        // Return HTML that redirects the TOP window (breaks out of iframe)
        const prodOrigin = process.env.SITE_ORIGIN;
        const errorUrl = `${prodOrigin}/checkout?error=payment_failed`;
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
                    <h1>Payment Error</h1>
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
