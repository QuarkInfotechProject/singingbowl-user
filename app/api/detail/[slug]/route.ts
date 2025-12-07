import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug
    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    // Get API base URL
    const baseURL = process.env.BASE_URL;

    if (!baseURL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Make API call
    const fullUrl = `${baseURL}/products/show/${encodeURIComponent(slug)}`;
    console.log("=== PRODUCT API DEBUG ===");
    console.log("Fetching product from:", fullUrl);
    console.log("=========================");

    const response = await fetch(
      fullUrl,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle non-OK responses
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
