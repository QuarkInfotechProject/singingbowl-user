import axios, { AxiosResponse, AxiosError } from "axios";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const apiClient = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use((response: AxiosResponse) => {
  return response;
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params;
    const endpoint = `/${params.path.join("/")}`;

    // Get query parameters from the original request
    const searchParams = request.nextUrl.searchParams.toString();
    const fullEndpoint = searchParams ? `${endpoint}?${searchParams}` : endpoint;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await apiClient.get(fullEndpoint, { headers });

    return Response.json(response.data);
  } catch (error: any) {
    const axiosError = error as AxiosError;

    return Response.json(
      {
        error:
          (axiosError.response?.data as any)?.message ||
          axiosError.message ||
          "Something went wrong",
        success: false,
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params;
    const endpoint = `/${params.path.join("/")}`;
    const body = await request.json();

    console.log("=== API POST Request ===");
    console.log("Endpoint:", endpoint);
    console.log("Request Body:", JSON.stringify(body, null, 2));

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await apiClient.post(endpoint, body, { headers });

    return Response.json(response.data);
  } catch (error: any) {
    const axiosError = error as AxiosError;

    console.log("=== API POST Error ===");
    console.log("Status:", axiosError.response?.status);
    console.log("Error Response Data:", JSON.stringify(axiosError.response?.data, null, 2));
    console.log("Error Message:", axiosError.message);

    return Response.json(
      {
        error:
          (axiosError.response?.data as any)?.message ||
          axiosError.message ||
          "Something went wrong",
        success: false,
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}
