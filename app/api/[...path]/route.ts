import axios, { AxiosResponse, AxiosError } from "axios";
import { NextRequest } from "next/server";

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

    console.log("=== API PROXY DEBUG ===");
    console.log("BASE_URL from env:", process.env.BASE_URL);
    console.log("Endpoint path:", endpoint);
    console.log("Query params:", searchParams);
    console.log("Full URL:", `${process.env.BASE_URL}${fullEndpoint}`);
    console.log("========================");

    const response = await apiClient.get(fullEndpoint);

    console.log("Upstream API Response Status:", response.status);
    return Response.json(response.data);
  } catch (error: any) {
    const axiosError = error as AxiosError;

    console.error("API Proxy Error:", {
      message: axiosError.message,
      url: axiosError.config?.url,
      baseURL: axiosError.config?.baseURL,
      status: axiosError.response?.status,
      responseData: axiosError.response?.data,
    });

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

    const response = await apiClient.post(endpoint, body);

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
