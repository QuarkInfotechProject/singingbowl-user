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

    const response = await apiClient.get(endpoint);

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
