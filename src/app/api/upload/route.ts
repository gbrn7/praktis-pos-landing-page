import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Harap unggah PNG, JPG, WEBP, atau SVG.' },
        { status: 400 }
      );
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimum 5 MB.' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || '.png';
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `${Date.now()}-${cleanBase}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan di server saat mengunggah file' },
      { status: 500 }
    );
  }
}
