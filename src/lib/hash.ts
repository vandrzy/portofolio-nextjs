import crypto from 'crypto';

/**
 * Membuat shortCode unik dari ID (UUID) menggunakan hash SHA-256 (8 karakter pertama).
 */
export function generateShortCode(id: string): string {
  return crypto.createHash('sha256').update(id).digest('hex').substring(0, 8);
}
