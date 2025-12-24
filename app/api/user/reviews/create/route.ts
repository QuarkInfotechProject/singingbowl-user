import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized", success: false },
                { status: 401 }
            );
        }

        // Get formdata from request
        const formData = await request.formData();

        // Validate required fields
        const productId = formData.get("productId");
        const rating = formData.get("rating");
        const orderItemId = formData.get("orderItemId");

        if (!productId || !rating || !orderItemId) {
            return NextResponse.json(
                { error: "productId, rating, and orderItemId are required", success: false },
                { status: 400 }
            );
        }

        // Validate image sizes (max 2MB each)
        const images = formData.getAll("images[]") as File[];
        for (const image of images) {
            if (image.size > 2 * 1024 * 1024) {
                return NextResponse.json(
                    { error: "Each image must be less than 2MB", success: false },
                    { status: 400 }
                );
            }
        }

        // Forward the formdata to the backend
        const response = await axios.post(
            `${process.env.BASE_URL}/user/reviews/create`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                timeout: 60000,
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Review create error:", error?.response?.data || error);
        return NextResponse.json(
            {
                error: error?.response?.data?.message || error.message || "Failed to create review",
                success: false,
            },
            { status: error?.response?.status ||    500 }
        );
    }
}
