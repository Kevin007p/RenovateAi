import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { base64Image, isCurrentState } = await request.json();

    const prompt = isCurrentState 
      ? "Analyze this image of the current state and provide a detailed description focusing on: 1) Room dimensions and layout 2) Existing materials and finishes 3) Visible wear, damage, or issues 4) Current fixtures and appliances 5) Any structural elements that might need attention. Be specific about measurements and material conditions."
      : "Analyze this image of the desired state and provide a detailed description focusing on: 1) New layout and design elements 2) Desired materials and finishes 3) New fixtures and appliances 4) Any structural changes needed 5) Special features or upgrades. Be specific about the design style and quality level of materials.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    return NextResponse.json({ 
      description: response.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
} 