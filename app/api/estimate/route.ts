import { NextResponse } from 'next/server';
import { generateEstimate } from '@/lib/estimate';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const description = formData.get('description') as string;
    const currentImages = formData.getAll('currentImages') as File[];
    const desiredImages = formData.getAll('desiredImages') as File[];

    // Generate detailed analysis for images
    const imageAnalysis = {
      current: await Promise.all(currentImages.map(generateImageAnalysis)),
      desired: await Promise.all(desiredImages.map(generateImageAnalysis))
    };

    const response = await generateEstimate(description, imageAnalysis);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error processing estimate:', error);
    return NextResponse.json(
      { error: 'Failed to process estimate' },
      { status: 500 }
    );
  }
}

async function generateImageAnalysis(file: File): Promise<string> {
  const base64 = await file.arrayBuffer()
    .then(buffer => Buffer.from(buffer).toString('base64'));

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image as a renovation expert. Focus on:
1. Current condition and materials
2. Notable features or issues
3. Space dimensions and layout
4. Any visible damage or wear
5. Potential renovation challenges

Provide a concise but detailed analysis.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64}`
            }
          }
        ]
      }
    ],
    max_tokens: 200
  });

  return completion.choices[0].message.content || 'Unable to analyze image';
} 