import { NextResponse } from "next/server";

export interface ApiResponseMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: ApiResponseMeta;
}

export function ok<T>(data: T, meta?: ApiResponseMeta, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, ...(meta ? { meta } : {}) },
    { status }
  );
}

export function fail(error: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error },
    { status }
  );
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
