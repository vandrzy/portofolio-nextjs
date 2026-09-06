import { NextResponse } from 'next/server';

export interface ApiResponseOptions {
  message?: string;
  status?: number;
  [key: string]: unknown;
}

/**
 * Helper terpusat untuk menghasilkan NextResponse sukses secara konsisten
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status = 200,
  extraMeta?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      ...(message ? { message } : {}),
      ...(extraMeta || {}),
      data,
    },
    { status }
  );
}

/**
 * Helper terpusat untuk menghasilkan NextResponse error secara konsisten
 */
export function errorResponse(
  message: string,
  status = 400,
  errorDetails?: unknown
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errorDetails !== undefined ? { error: errorDetails } : {}),
    },
    { status }
  );
}
