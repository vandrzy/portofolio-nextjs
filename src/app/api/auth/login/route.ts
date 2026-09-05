import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getGoogleSheetsDoc } from '@/lib/google-sheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'username atau password salah' },
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

    const doc = await getGoogleSheetsDoc();
    await doc.loadInfo();

    const akunSheet = doc.sheetsByTitle['Akun'];
    if (!akunSheet) {
      return NextResponse.json(
        { message: 'username atau password salah' },
        { status: 401 }
      );
    }

    const rows = await akunSheet.getRows();
    const userRow = rows.find((row) => row.get('username') === username);

    if (!userRow) {
      return NextResponse.json(
        { message: 'username atau password salah' },
        { status: 401 }
      );
    }

    const hashedPassword = userRow.get('password');
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'username atau password salah' },
        { status: 401 }
      );
    }

    // Buat JWT token dengan durasi expired 1 jam ('1h')
    const token = jwt.sign(
      { username: userRow.get('username') },
      jwtSecret,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json(
      {
        message: 'Login berhasil',
        username: userRow.get('username'),
        token: token,
      },
      { status: 200 }
    );

    // Set cookie HTTP-only untuk proteksi middleware & keamanan tambahan
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 jam dalam detik
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server', error: errorMessage },
      { status: 500 }
    );
  }
}
