import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    const baseURL = process.env.BASE_URL;

    if (!baseURL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Make API call
    const response = await fetch(
      `${baseURL}/blog/detail/${encodeURIComponent(slug)}`,
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
