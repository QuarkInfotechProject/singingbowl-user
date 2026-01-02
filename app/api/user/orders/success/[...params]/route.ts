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


        // Decode the GetPay token to extract transaction info
        // The token is base64 encoded JSON: {"id": "transactionId", "oprSecret": "..."}
        let transactionId: string | null = null;
        if (getPayToken) {
            try {
                const decoded = Buffer.from(getPayToken, 'base64').toString('utf-8');
                const decodedData = JSON.parse(decoded);
                transactionId = decodedData.id || null;
            } catch {
                // If not base64, the token itself might be the transaction ID
                transactionId = getPayToken;
            }
        }

        // Get auth token from cookies
        const cookieStore = await cookies();
        const authToken = cookieStore.get("token")?.value;

        const allCookies = cookieStore.getAll();

        const headers: Record<string, string> = {};
        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }
        else {
            console.error("WARNING: No auth token found in cookies!");
        }

        // Backend expects path parameters: /user/orders/success/{paymentMethod}/{orderId}
        // And the RAW GetPay token (base64 string) in the request body
        // The backend will decode and verify this token itself
        console.log("=== Payment Success Callback Debug ===");
        console.log("Params:", JSON.stringify(paramsArray));
        console.log("Extracted orderId:", orderId, "PaymentMethod:", paymentMethod);
        console.log("Raw Token from SearchParams:", getPayToken);
        console.log("Decoded TransactionId:", transactionId);
        console.log("Cookies present:", allCookies.map(c => c.name).join(', '));
        console.log("Auth Token Found:", !!authToken);

        const requestBody = {
            orderId: orderId,
            paymentMethod: paymentMethod,
            token: getPayToken,
        };

        // Backend expects path parameters: /user/orders/success/{paymentMethod}/{orderId}
        const backendUrl = `/user/orders/success/${paymentMethod}/${orderId}`;
        console.log("Constructed Backend URL:", backendUrl);

        try {
            // Attempt 1: Standard URL
            await apiClient.post(backendUrl, requestBody, { headers });
        } catch (apiError1: any) {
            // ... keep retry logic or simplfy ...
            // Since we know the route structure now, retry is less critical but good for trailing slash safety
            console.warn("Attempt 1 failed. Retrying with trailing slash...");

            try {
                // Attempt 2: Trailing slash
                await apiClient.post(`${backendUrl}/`, requestBody, { headers });
            } catch (apiError2: any) {
                console.error("!!! Backend API Failed (Both Attempts) !!!");

                const finalError = apiError1;

                let debugInfo = `Environment BASE_URL: ${process.env.BASE_URL}\n`;
                debugInfo += `Error: ${finalError.message}\n`;

                if (finalError.response) {
                    console.error("Backend Status:", finalError.response.status);
                    debugInfo += `Status: ${finalError.response.status}\n`;
                    debugInfo += `Data: ${JSON.stringify(finalError.response.data, null, 2)}\n`;
                }

                if (finalError.config) {
                    const fullUrl = (finalError.config.baseURL || '') + (finalError.config.url || '');
                    debugInfo += `Attempted URL: ${fullUrl}\n`;
                    debugInfo += `Method: ${finalError.config.method?.toUpperCase()}\n`;
                    debugInfo += `Request Data: ${JSON.stringify(finalError.config.data)}\n`;
                }

                finalError.customDebugInfo = debugInfo;
                throw finalError;
            }
        }

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

        let debugInfo = "";

        if (error.customDebugInfo) {
            // Use the enhanced debug info from the inner try/catch
            debugInfo = error.customDebugInfo;
        } else {
            // Fallback for unexpected errors
            debugInfo = `Error: ${error.message}\n`;
            if (error.response) {
                console.error("Response status:", error.response.status);
                debugInfo += `Status: ${error.response.status}\n`;
                debugInfo += `Data: ${JSON.stringify(error.response.data, null, 2)}\n`;
            }
            if (error.config) {
                const fullUrl = (error.config.baseURL || '') + (error.config.url || '');
                debugInfo += `URL: ${fullUrl}\n`;
            }
        }

        // Return HTML that redirects the TOP window with error (breaks out of iframe)
        const errorUrl = `${prodOrigin}/checkout?error=payment_verification_failed`;
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Error</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: #fff1f2;
                        padding: 20px;
                    }
                    .container {
                        text-align: center;
                        padding: 30px;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        max-width: 600px;
                        width: 100%;
                    }
                    .error-icon { font-size: 48px; margin-bottom: 16px; }
                    h1 { color: #ef4444; margin: 0 0 8px 0; font-size: 24px; }
                    p { color: #374151; margin-bottom: 20px; }
                    .debug-box {
                        background: #1f2937;
                        color: #10b981;
                        padding: 15px;
                        border-radius: 8px;
                        text-align: left;
                        font-family: monospace;
                        font-size: 12px;
                        overflow-x: auto;
                        margin-bottom: 20px;
                        white-space: pre-wrap;
                        border: 1px solid #374151;
                    }
                    .btn {
                        background-color: #ef4444;
                        color: white;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        font-weight: 500;
                        display: inline-block;
                        transition: background-color 0.2s;
                    }
                    .btn:hover { background-color: #dc2626; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="error-icon">⚠️</div>
                    <h1>Payment Verification Failed</h1>
                    <p>The system could not verify your valid payment. Please save the details below and contact support.</p>
                    
                    <div class="debug-box"><strong>TECHNICAL DETAILS:</strong><br/>${debugInfo}</div>

                    <a href="${errorUrl}" class="btn" id="continueBtn">Return to Checkout</a>
                </div>
                <script>
                    // Manual redirect only to allow reading errors
                    // if (window.top !== window.self) {
                    //     window.top.location.href = "${errorUrl}";
                    // } else {
                    //     window.location.href = "${errorUrl}";
                    // }
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
