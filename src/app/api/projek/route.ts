import { NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getProjekSheet } from '@/lib/google-sheets';
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
 * Helper untuk mem-parsing data tags dari Google Sheet (format JSON string atau array)
 */
function parseTags(rawTags: string | undefined | null): string[] {
  if (!rawTags) return [];
  try {
    const parsed = JSON.parse(rawTags);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Fallback jika berupa koma-separated string
    return rawTags.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

/**
 * GET /api/projek
 * Endpoint Publik. Mendukung pencarian `judul`, filter `shortcode`, dan paginasi.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const judulQuery = searchParams.get('judul')?.trim() || '';
    const shortCodeQuery = searchParams.get('shortcode') || searchParams.get('shortCode') || searchParams.get('id') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = searchParams.get('limit');

    const sheet = await getProjekSheet();
    const rows = await sheet.getRows();

    let data = rows.map((row) => ({
      id: row.get('id') || '',
      shortCode: row.get('shortCode') || '',
      judul: row.get('judul') || '',
      deskripsi: row.get('deskripsi') || '',
      link: row.get('link') || '',
      tags: parseTags(row.get('tags')),
      tanggalUpdate: row.get('tanggal update') || '',
    }));

    // Filter berdasarkan shortcode jika ada
    if (shortCodeQuery) {
      data = data.filter((item) => item.shortCode === shortCodeQuery || item.id === shortCodeQuery);
    }

    // Filter berdasarkan judul jika ada
    if (judulQuery) {
      data = data.filter((item) =>
        item.judul.toLowerCase().includes(judulQuery.toLowerCase())
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
      { message: 'Gagal mengambil data projek', error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projek
 * Endpoint Private (memerlukan JWT).
 * Body: { judul: string (max 35), deskripsi: string (max 130), link: string, tags: string[] (max 5) }
 */
export async function POST(request: Request) {
  const auth = await verifyJwtToken(request);
  if (!auth.valid) return auth.errorResponse!;

  try {
    const body = await request.json();
    const judul = body.judul?.trim();
    const deskripsi = body.deskripsi?.trim();
    const link = body.link?.trim() || '';
    const tags = Array.isArray(body.tags) ? body.tags : [];

    if (!judul) {
      return NextResponse.json(
        { message: 'Judul projek wajib diisi' },
        { status: 400 }
      );
    }

    if (judul.length > 35) {
      return NextResponse.json(
        { message: 'Judul projek maksimal 35 karakter' },
        { status: 400 }
      );
    }

    if (!deskripsi) {
      return NextResponse.json(
        { message: 'Deskripsi projek wajib diisi' },
        { status: 400 }
      );
    }

    if (deskripsi.length > 130) {
      return NextResponse.json(
        { message: 'Deskripsi projek maksimal 130 karakter' },
        { status: 400 }
      );
    }

    if (tags.length > 5) {
      return NextResponse.json(
        { message: 'Tags projek maksimal 5 tag' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const shortCode = generateShortCode(id);
    const tanggalUpdate = new Date().toISOString();

    const sheet = await getProjekSheet();
    await sheet.addRow({
      id,
      shortCode,
      judul,
      deskripsi,
      link,
      tags: JSON.stringify(tags),
      'tanggal update': tanggalUpdate,
    });

    return NextResponse.json(
      {
        message: 'Projek berhasil ditambahkan',
        data: {
          id,
          shortCode,
          judul,
          deskripsi,
          link,
          tags,
          tanggalUpdate,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Gagal menambah data projek', error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PUT / PATCH /api/projek
 * Endpoint Private (memerlukan JWT).
 * Query/Body: shortcode / shortCode / id
 * Body: { judul, deskripsi, link, tags }
 */
async function handleUpdate(request: Request) {
  const auth = await verifyJwtToken(request);
  if (!auth.valid) return auth.errorResponse!;

  try {
    const { searchParams } = new URL(request.url);
    const queryShortCode = searchParams.get('shortcode') || searchParams.get('shortCode') || searchParams.get('id');

    const body = await request.json();
    const judul = body.judul?.trim();
    const deskripsi = body.deskripsi?.trim();
    const link = body.link?.trim() || '';
    const tags = Array.isArray(body.tags) ? body.tags : [];

    const shortCodeTarget = body.shortCode || body.shortcode || body.id || queryShortCode;

    if (!shortCodeTarget) {
      return NextResponse.json(
        { message: 'Identifier (shortCode / id) projek wajib disertakan' },
        { status: 400 }
      );
    }

    if (!judul) {
      return NextResponse.json(
        { message: 'Judul projek wajib diisi' },
        { status: 400 }
      );
    }

    if (judul.length > 35) {
      return NextResponse.json(
        { message: 'Judul projek maksimal 35 karakter' },
        { status: 400 }
      );
    }

    if (!deskripsi) {
      return NextResponse.json(
        { message: 'Deskripsi projek wajib diisi' },
        { status: 400 }
      );
    }

    if (deskripsi.length > 130) {
      return NextResponse.json(
        { message: 'Deskripsi projek maksimal 130 karakter' },
        { status: 400 }
      );
    }

    if (tags.length > 5) {
      return NextResponse.json(
        { message: 'Tags projek maksimal 5 tag' },
        { status: 400 }
      );
    }

    const sheet = await getProjekSheet();
    const rows = await sheet.getRows();
    const targetRow = rows.find(
      (row) => row.get('shortCode') === shortCodeTarget || row.get('id') === shortCodeTarget
    );

    if (!targetRow) {
      return NextResponse.json(
        { message: 'Data projek tidak ditemukan' },
        { status: 404 }
      );
    }

    const tanggalUpdate = new Date().toISOString();
    targetRow.set('judul', judul);
    targetRow.set('deskripsi', deskripsi);
    targetRow.set('link', link);
    targetRow.set('tags', JSON.stringify(tags));
    targetRow.set('tanggal update', tanggalUpdate);
    await targetRow.save();

    return NextResponse.json({
      message: 'Projek berhasil diperbarui',
      data: {
        id: targetRow.get('id'),
        shortCode: targetRow.get('shortCode'),
        judul,
        deskripsi,
        link,
        tags,
        tanggalUpdate,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Gagal memperbarui data projek', error: errorMessage },
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
 * DELETE /api/projek
 * Endpoint Private (memerlukan JWT).
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

    const sheet = await getProjekSheet();
    const rows = await sheet.getRows();
    const targetRow = rows.find(
      (row) => row.get('shortCode') === shortCodeTarget || row.get('id') === shortCodeTarget
    );

    if (!targetRow) {
      return NextResponse.json(
        { message: 'Data projek tidak ditemukan' },
        { status: 404 }
      );
    }

    await targetRow.delete();

    return NextResponse.json({
      message: 'Projek berhasil dihapus',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: 'Gagal menghapus data projek', error: errorMessage },
      { status: 500 }
    );
  }
}
