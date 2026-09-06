import { NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getTeknologiSheet } from '@/lib/google-sheets';
import { generateShortCode } from '@/lib/hash';

interface JwtPayload {
  username: string;
}

/**
 * Helper untuk verifikasi token JWT dari Header Authorization atau Cookie
 */
async function verifyJwtToken(request: Request): Promise<{ valid: boolean; errorResponse?: NextResponse }> {
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
      errorResponse: NextResponse.json(
        { message: 'Unauthorized. Token JWT tidak ditemukan, silakan login terlebih dahulu.' },
        { status: 401 }
      ),
    };
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return {
      valid: false,
      errorResponse: NextResponse.json(
        { message: 'JWT_SECRET belum dikonfigurasi pada environment variable.' },
        { status: 500 }
      ),
    };
  }

  try {
    jwt.verify(token, jwtSecret) as JwtPayload;
    return { valid: true };
  } catch {
    return {
      valid: false,
      errorResponse: NextResponse.json(
        { message: 'Token tidak valid atau telah kadaluarsa. Silakan login kembali.' },
        { status: 401 }
      ),
    };
  }
}

/**
 * GET /api/teknologi
 * Public endpoint. Memungkinkan pencarian berdasarkan `nama`, filter `shortcode`, dan paginasi.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const namaQuery = searchParams.get('nama')?.trim() || '';
    const shortCodeQuery = searchParams.get('shortcode') || searchParams.get('shortCode') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = searchParams.get('limit');
    
    const sheet = await getTeknologiSheet();
    const rows = await sheet.getRows();

    let data = rows.map((row) => ({
      id: row.get('id') || '',
      shortCode: row.get('shortCode') || '',
      nama: row.get('nama') || '',
      tanggalUpdate: row.get('tanggal update') || '',
    }));

    // Filter berdasarkan shortcode jika ada
    if (shortCodeQuery) {
      data = data.filter((item) => item.shortCode === shortCodeQuery || item.id === shortCodeQuery);
    }

    // Filter berdasarkan nama jika ada
    if (namaQuery) {
      data = data.filter((item) =>
        item.nama.toLowerCase().includes(namaQuery.toLowerCase())
      );
    }

    const total = data.length;

    // Jika limit ditentukan dan > 0, terapkan paginasi
    if (limitParam && parseInt(limitParam, 10) > 0) {
      const limit = parseInt(limitParam, 10);
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = data.slice(startIndex, startIndex + limit);

      return NextResponse.json({
        success: true,
        data: paginatedData,
        total,
        page,
        totalPages,
        limit,
      });
    }

    return NextResponse.json({
      success: true,
      data,
      total,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Gagal mengambil data teknologi', error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/teknologi
 * Private endpoint (memerlukan JWT).
 * Body: { nama: string (max 20 chars) }
 */
export async function POST(request: Request) {
  const auth = await verifyJwtToken(request);
  if (!auth.valid) return auth.errorResponse!;

  try {
    const body = await request.json();
    const nama = body.nama?.trim();

    if (!nama) {
      return NextResponse.json(
        { message: 'Nama teknologi wajib diisi' },
        { status: 400 }
      );
    }

    if (nama.length > 20) {
      return NextResponse.json(
        { message: 'Nama teknologi maksimal 20 karakter' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const shortCode = generateShortCode(id);
    const tanggalUpdate = new Date().toISOString();

    const sheet = await getTeknologiSheet();
    await sheet.addRow({
      id,
      shortCode,
      nama,
      'tanggal update': tanggalUpdate,
    });

    return NextResponse.json(
      {
        message: 'Teknologi berhasil ditambahkan',
        data: {
          id,
          shortCode,
          nama,
          tanggalUpdate,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Gagal menambah data teknologi', error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PUT / PATCH /api/teknologi
 * Private endpoint (memerlukan JWT).
 * Query/Body: shortCode atau id
 * Body: { nama: string (max 20 chars) }
 */
async function handleUpdate(request: Request) {
  const auth = await verifyJwtToken(request);
  if (!auth.valid) return auth.errorResponse!;

  try {
    const { searchParams } = new URL(request.url);
    const queryShortCode = searchParams.get('shortcode') || searchParams.get('shortCode') || searchParams.get('id');

    const body = await request.json();
    const nama = body.nama?.trim();
    const shortCodeTarget = body.shortCode || body.shortcode || body.id || queryShortCode;

    if (!shortCodeTarget) {
      return NextResponse.json(
        { message: 'Identifier (shortCode / id) teknologi wajib disertakan' },
        { status: 400 }
      );
    }

    if (!nama) {
      return NextResponse.json(
        { message: 'Nama teknologi wajib diisi' },
        { status: 400 }
      );
    }

    if (nama.length > 20) {
      return NextResponse.json(
        { message: 'Nama teknologi maksimal 20 karakter' },
        { status: 400 }
      );
    }

    const sheet = await getTeknologiSheet();
    const rows = await sheet.getRows();
    const targetRow = rows.find(
      (row) => row.get('shortCode') === shortCodeTarget || row.get('id') === shortCodeTarget
    );

    if (!targetRow) {
      return NextResponse.json(
        { message: 'Data teknologi tidak ditemukan' },
        { status: 404 }
      );
    }

    const tanggalUpdate = new Date().toISOString();
    targetRow.set('nama', nama);
    targetRow.set('tanggal update', tanggalUpdate);
    await targetRow.save();

    return NextResponse.json({
      message: 'Teknologi berhasil diperbarui',
      data: {
        id: targetRow.get('id'),
        shortCode: targetRow.get('shortCode'),
        nama,
        tanggalUpdate,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Gagal memperbarui data teknologi', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return handleUpdate(request);
}

export async function PATCH(request: Request) {
  return handleUpdate(request);
}

/**
 * DELETE /api/teknologi
 * Private endpoint (memerlukan JWT).
 * Query parameter: shortcode / shortCode
 */
export async function DELETE(request: Request) {
  const auth = await verifyJwtToken(request);
  if (!auth.valid) return auth.errorResponse!;

  try {
    const { searchParams } = new URL(request.url);
    const shortCodeTarget = searchParams.get('shortcode') || searchParams.get('shortCode') || searchParams.get('id');

    if (!shortCodeTarget) {
      return NextResponse.json(
        { message: 'Query parameter shortcode wajib disertakan' },
        { status: 400 }
      );
    }

    const sheet = await getTeknologiSheet();
    const rows = await sheet.getRows();
    const targetRow = rows.find(
      (row) => row.get('shortCode') === shortCodeTarget || row.get('id') === shortCodeTarget
    );

    if (!targetRow) {
      return NextResponse.json(
        { message: 'Data teknologi tidak ditemukan' },
        { status: 404 }
      );
    }

    await targetRow.delete();

    return NextResponse.json({
      message: 'Teknologi berhasil dihapus',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Gagal menghapus data teknologi', error: errorMessage },
      { status: 500 }
    );
  }
}
