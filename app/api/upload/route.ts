import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    const imageData = await Promise.all(
      files.map(async (file) => {
        // Generate unique filename
        const uniqueId = uuidv4();
        const extension = file.name.split('.').pop();
        const filename = `${uniqueId}.${extension}`;
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Save file to public/uploads
        const path = join(uploadDir, filename);
        await writeFile(path, buffer);
        
        // Return both URL and base64
        return {
          url: `/uploads/${filename}`,
          base64: `data:${file.type};base64,${buffer.toString('base64')}`
        };
      })
    );

    return NextResponse.json({ images: imageData });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 