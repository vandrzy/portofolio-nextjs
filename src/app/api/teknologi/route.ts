import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getTeknologiSheet } from '@/lib/google-sheets';
import { generateShortCode } from '@/lib/hash';
import { verifyJwtToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { teknologiSchema } from '@/lib/validations';

/**
 * GET /api/teknologi
 * Public endpoint. Memungkinkan pencarian berdasarkan `nama`, filter `shortcode`, dan paginasi.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const namaQuery = searchParams.get('nama')?.trim() || '';
    const shortCodeQuery =
      searchParams.get('shortcode') || searchParams.get('shortCode') || '';
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
      data = data.filter(
        (item) => item.shortCode === shortCodeQuery || item.id === shortCodeQuery
      );
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
    return errorResponse('Gagal mengambil data teknologi', 500, errorMessage);
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
    const validation = teknologiSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Data input tidak valid';
      return errorResponse(firstError, 400, validation.error.format());
    }

    const { nama } = validation.data;
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

    return successResponse(
      {
        id,
        shortCode,
        nama,
        tanggalUpdate,
      },
      'Teknologi berhasil ditambahkan',
      201
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse('Gagal menambah data teknologi', 500, errorMessage);
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
    const queryShortCode =
      searchParams.get('shortcode') ||
      searchParams.get('shortCode') ||
      searchParams.get('id');

    const body = await request.json();
    const shortCodeTarget =
      body.shortCode || body.shortcode || body.id || queryShortCode;

    if (!shortCodeTarget) {
      return errorResponse(
        'Identifier (shortCode / id) teknologi wajib disertakan',
        400
      );
    }

    const validation = teknologiSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Data input tidak valid';
      return errorResponse(firstError, 400, validation.error.format());
    }

    const { nama } = validation.data;

    const sheet = await getTeknologiSheet();
    const rows = await sheet.getRows();
    const targetRow = rows.find(
      (row) =>
        row.get('shortCode') === shortCodeTarget || row.get('id') === shortCodeTarget
    );

    if (!targetRow) {
      return errorResponse('Data teknologi tidak ditemukan', 404);
    }

    const tanggalUpdate = new Date().toISOString();
    targetRow.set('nama', nama);
    targetRow.set('tanggal update', tanggalUpdate);
    await targetRow.save();

    return successResponse(
      {
        id: targetRow.get('id'),
        shortCode: targetRow.get('shortCode'),
        nama,
        tanggalUpdate,
      },
      'Teknologi berhasil diperbarui'
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse('Gagal memperbarui data teknologi', 500, errorMessage);
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

    const sheet = await getTeknologiSheet();
    const rows = await sheet.getRows();
    const targetRow = rows.find(
      (row) =>
        row.get('shortCode') === shortCodeTarget || row.get('id') === shortCodeTarget
    );

    if (!targetRow) {
      return errorResponse('Data teknologi tidak ditemukan', 404);
    }

    await targetRow.delete();

    return NextResponse.json({
      success: true,
      message: 'Teknologi berhasil dihapus',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse('Gagal menghapus data teknologi', 500, errorMessage);
  }
}
