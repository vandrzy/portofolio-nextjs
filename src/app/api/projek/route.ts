import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getProjekSheet } from '@/lib/google-sheets';
import { generateShortCode } from '@/lib/hash';
import { verifyJwtToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { parseTags } from '@/lib/utils';
import { projekSchema } from '@/lib/validations';

/**
 * GET /api/projek
 * Endpoint Publik. Mendukung pencarian `judul`, filter `shortcode`, dan paginasi.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const judulQuery = searchParams.get('judul')?.trim() || '';
    const shortCodeQuery =
      searchParams.get('shortcode') ||
      searchParams.get('shortCode') ||
      searchParams.get('id') ||
      '';
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
      data = data.filter(
        (item) => item.shortCode === shortCodeQuery || item.id === shortCodeQuery
      );
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

      return successResponse(paginatedData, undefined, 200, {
        total,
        page,
        totalPages,
        limit,
      });
    }

    return successResponse(data, undefined, 200, { total });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse('Gagal mengambil data projek', 500, errorMessage);
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
    const validation = projekSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Data input tidak valid';
      return errorResponse(firstError, 400, validation.error.format());
    }

    const { judul, deskripsi, link, tags } = validation.data;
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

    return successResponse(
      {
        id,
        shortCode,
        judul,
        deskripsi,
        link,
        tags,
        tanggalUpdate,
      },
      'Projek berhasil ditambahkan',
      201
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse('Gagal menambah data projek', 500, errorMessage);
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
    const queryShortCode =
      searchParams.get('shortcode') ||
      searchParams.get('shortCode') ||
      searchParams.get('id');

    const body = await request.json();
    const shortCodeTarget =
      body.shortCode || body.shortcode || body.id || queryShortCode;

    if (!shortCodeTarget) {
      return errorResponse(
        'Identifier (shortCode / id) projek wajib disertakan',
        400
      );
    }

    const validation = projekSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Data input tidak valid';
      return errorResponse(firstError, 400, validation.error.format());
    }

    const { judul, deskripsi, link, tags } = validation.data;

    const sheet = await getProjekSheet();
    const rows = await sheet.getRows();
    const targetRow = rows.find(
      (row) =>
        row.get('shortCode') === shortCodeTarget || row.get('id') === shortCodeTarget
    );

    if (!targetRow) {
      return errorResponse('Data projek tidak ditemukan', 404);
    }

    const tanggalUpdate = new Date().toISOString();
    targetRow.set('judul', judul);
    targetRow.set('deskripsi', deskripsi);
    targetRow.set('link', link);
    targetRow.set('tags', JSON.stringify(tags));
    targetRow.set('tanggal update', tanggalUpdate);
    await targetRow.save();

    return successResponse(
      {
        id: targetRow.get('id'),
        shortCode: targetRow.get('shortCode'),
        judul,
        deskripsi,
        link,
        tags,
        tanggalUpdate,
      },
      'Projek berhasil diperbarui'
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse('Gagal memperbarui data projek', 500, errorMessage);
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
    const shortCodeTarget =
      searchParams.get('shortcode') ||
      searchParams.get('shortCode') ||
      searchParams.get('id');

    if (!shortCodeTarget) {
      return errorResponse(
        'Query parameter shortcode wajib disertakan',
        400
      );
    }

    const sheet = await getProjekSheet();
    const rows = await sheet.getRows();
    const targetRow = rows.find(
      (row) =>
        row.get('shortCode') === shortCodeTarget || row.get('id') === shortCodeTarget
    );

    if (!targetRow) {
      return errorResponse('Data projek tidak ditemukan', 404);
    }

    await targetRow.delete();

    return NextResponse.json({
      success: true,
      message: 'Projek berhasil dihapus',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse('Gagal menghapus data projek', 500, errorMessage);
  }
}
