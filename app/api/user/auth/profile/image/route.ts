import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const payload = await request.formData();

    const { data } = await axios.post(`${process.env.BASE_URL}/profile/change-profile-picture`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);
    const axiosError: AxiosError = error;
    return NextResponse.json(axiosError.response?.data, { status: error?.response?.status });
  }
}
