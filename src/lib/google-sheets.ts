import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

/**
 * Mendapatkan instance GoogleSpreadsheet yang sudah terautentikasi dengan Service Account.
 */
export async function getGoogleSheetsDoc() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;

  if (!serviceAccountEmail || !rawPrivateKey || !spreadsheetId) {
    throw new Error(
      'Kredensial Google Sheets belum dikonfigurasi di .env.local (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, atau SPREADSHEET_ID masih kosong).'
    );
  }

  // Mengubah escaped \n menjadi newlines aktual jika ada
  const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

  const serviceAccountAuth = new JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  return doc;
}

/**
 * Menguji koneksi ke Google Spreadsheet.
 * Memuat metadata spreadsheet untuk memverifikasi bahwa kredensial valid.
 */
export async function testGoogleSheetsConnection() {
  try {
    const doc = await getGoogleSheetsDoc();
    await doc.loadInfo();
    return {
      success: true,
      title: doc.title,
      sheetCount: doc.sheetCount,
      sheets: doc.sheetsByIndex.map((s) => s.title),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Gagal terhubung ke Google Sheets API.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
