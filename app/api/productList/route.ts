import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiPayload = {
      filters: {
        type: body.type,
        page: body.page || 1,
        per_page: body.per_page || 15,
      },
    };

    const response = await axios.post(
      `${API_BASE_URL}/product/list`,
      apiPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: error.response?.status || 500 }
    );
  }
}
