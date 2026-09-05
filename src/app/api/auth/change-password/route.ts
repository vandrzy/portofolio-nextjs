import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getGoogleSheetsDoc } from '@/lib/google-sheets';

interface JwtPayload {
  username: string;
}

export async function POST(request: Request) {
  try {
    // 1. Verifikasi Token dari Header Authorization atau Cookie
    let token: string | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get('admin_token')?.value || null;
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { message: 'JWT_SECRET belum dikonfigurasi pada environment variable' },
        { status: 500 }
      );
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch {
      return NextResponse.json(
        { message: 'Token tidak valid atau telah kadaluarsa. Silakan login kembali.' },
        { status: 401 }
      );
    }

    // 2. Baca Body Request
    const body = await request.json();
    const { password, confirm_password } = body;

    if (!password || !confirm_password) {
      return NextResponse.json(
        { message: 'Password dan confirm_password wajib diisi' },
        { status: 400 }
      );
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        { message: 'Password dan konfirmasi password tidak cocok' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // 3. Update Password di Google Sheets Akun
    const doc = await getGoogleSheetsDoc();
    await doc.loadInfo();

    const akunSheet = doc.sheetsByTitle['Akun'];
    if (!akunSheet) {
      return NextResponse.json(
        { message: 'Sheet Akun tidak ditemukan' },
        { status: 404 }
      );
    }

    const rows = await akunSheet.getRows();
    const userRow = rows.find((row) => row.get('username') === decoded.username);

    if (!userRow) {
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);
    userRow.set('password', hashedPassword);
    await userRow.save();

    return NextResponse.json(
      { message: 'Password berhasil diperbarui' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server', error: errorMessage },
      { status: 500 }
    );
  }
}
