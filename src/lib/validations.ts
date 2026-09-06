import { z } from 'zod';

export const projekSchema = z.object({
  judul: z
    .string()
    .trim()
    .min(1, 'Judul projek wajib diisi')
    .max(35, 'Judul projek maksimal 35 karakter'),
  deskripsi: z
    .string()
    .trim()
    .min(1, 'Deskripsi projek wajib diisi')
    .max(130, 'Deskripsi projek maksimal 130 karakter'),
  link: z.string().trim().optional().default(''),
  tags: z
    .array(z.string().trim())
    .max(5, 'Tags projek maksimal 5 tag')
    .optional()
    .default([]),
});

export type ProjekInput = z.infer<typeof projekSchema>;

export const teknologiSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, 'Nama teknologi wajib diisi')
    .max(20, 'Nama teknologi maksimal 20 karakter'),
});

export type TeknologiInput = z.infer<typeof teknologiSchema>;
