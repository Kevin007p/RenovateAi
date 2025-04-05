import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory store for conversations (replace with database in production)
const conversations = new Map<string, any[]>();

export async function POST(req: Request) {
  try {
    const { message, conversationId, description, timeline, currentImages = [], desiredImages = [], isInitial } = await req.json();

    if (isInitial) {
      let currentStateAnalysis = [];
      let desiredStateAnalysis = [];

      try {
        // Analyze current state images if any
        if (currentImages.length > 0) {
          currentStateAnalysis = await Promise.all(
            currentImages.map(async (image: string) => {
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analyze-image`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ base64Image: image })
                });
                if (!response.ok) throw new Error('Image analysis failed');
                const data = await response.json();
                return data.description;
              } catch (error) {
                console.error('Error analyzing current state image:', error);
                return 'Unable to analyze image';
              }
            })
          );
        }

        // Analyze desired state images if any
        if (desiredImages.length > 0) {
          desiredStateAnalysis = await Promise.all(
            desiredImages.map(async (image: string) => {
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analyze-image`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ base64Image: image })
                });
                if (!response.ok) throw new Error('Image analysis failed');
                const data = await response.json();
                return data.description;
              } catch (error) {
                console.error('Error analyzing desired state image:', error);
                return 'Unable to analyze image';
              }
            })
          );
        }
      } catch (error) {
        console.error('Error in image analysis:', error);
        // Continue with empty analyses
      }

      const initialPrompt = `You are a renovation expert AI assistant having a natural conversation with a homeowner. The user has provided:

Current State Analysis:
${currentStateAnalysis.length > 0 ? currentStateAnalysis.join('\n\n') : 'No current state images provided'}

Desired State Analysis:
${desiredStateAnalysis.length > 0 ? desiredStateAnalysis.join('\n\n') : 'No desired state images provided'}

User's Description: ${description}
Timeline: ${timeline || 'flexible'}

Your role is to:
1. Start with a friendly greeting and acknowledge their renovation project
2. Ask specific questions to gather information needed for an accurate estimate
3. After 4-5 exchanges, provide a rough price range based on the information gathered
4. Continue the conversation to refine the estimate or discuss additional options
5. Be conversational and natural in your responses
6. Don't use rigid templates or hardcoded formats
7. Be understanding of any typos or informal language

Key points to discuss:
- Specific materials and finishes
- Room dimensions and layout changes
- Any structural modifications needed
- Quality level of materials (budget, mid-range, luxury)
- Any special requirements or preferences
- Local labor costs and availability

Remember to:
- Be empathetic and professional
- Ask one question at a time
- Provide context for your questions
- Give rough estimates when you have enough information
- Keep the conversation open for more details
- Be clear about what factors might affect the final price`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [{ role: "system", content: initialPrompt }],
          temperature: 0.7
        });

        return NextResponse.json({
          conversationId: Date.now().toString(),
          message: completion.choices[0].message.content
        });
      } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to get response from OpenAI');
      }
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a renovation expert AI assistant continuing a conversation about a renovation project. 

Your goals are to:
1. Continue gathering information to refine the cost estimate
2. If you have enough information, provide a price range
3. Keep the conversation open for more details or additional options
4. Be conversational and natural
5. Focus on understanding the user's needs
6. When the conversation naturally concludes, remind the user they can:
   - Click "Interested" if they want to proceed with the renovation
   - Click "Waiting" if they want to think about it
   - Click "Not Interested" if they don't want to proceed

Remember:
- Be clear about what factors might affect the final price
- Discuss any additional options or upgrades
- Keep the tone friendly and professional
- Be understanding of informal language
- Don't mention the options until the conversation naturally concludes`
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      });

      return NextResponse.json({
        message: completion.choices[0].message.content
      });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat message" },
      { status: 500 }
    );
  }
} 