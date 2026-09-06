import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { errorResponse } from './api-response';

export interface JwtPayload {
  username: string;
}

export interface AuthVerificationResult {
  valid: boolean;
  user?: JwtPayload;
  errorResponse?: NextResponse;
}

/**
 * Helper terpusat untuk verifikasi token JWT dari Header Authorization atau Cookie
 */
export async function verifyJwtToken(request: Request): Promise<AuthVerificationResult> {
  let token: string | null = null;
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get('admin_token')?.value || null;
  }

  if (!token) {
    return {
      valid: false,
      errorResponse: errorResponse(
        'Unauthorized. Token JWT tidak ditemukan, silakan login terlebih dahulu.',
        401
      ),
    };
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return {
      valid: false,
      errorResponse: errorResponse(
        'JWT_SECRET belum dikonfigurasi pada environment variable.',
        500
      ),
    };
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return { valid: true, user: decoded };
  } catch {
    return {
      valid: false,
      errorResponse: errorResponse(
        'Token tidak valid atau telah kadaluarsa. Silakan login kembali.',
        401
      ),
    };
  }
}
