import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory store for conversations (replace with database in production)
const conversations = new Map<string, any[]>();

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { message, conversationId, description, timeline, currentImages = [], desiredImages = [], isInitial, messages = [] } = await req.json();

    // Get the base URL from the request
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    if (isInitial) {
      let currentStateAnalysis = [];
      let desiredStateAnalysis = [];

      try {
        // Analyze current state images if any
        if (currentImages.length > 0) {
          currentStateAnalysis = await Promise.all(
            currentImages.map(async (image: string) => {
              try {
                const response = await fetch(`${baseUrl}/api/analyze-image`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    base64Image: image,
                    isCurrentState: true 
                  })
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
                const response = await fetch(`${baseUrl}/api/analyze-image`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    base64Image: image,
                    isCurrentState: false 
                  })
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

${currentImages.length > 0 ? `Current State Analysis:
${currentStateAnalysis.join('\n\n')}` : 'No current state images provided'}

${desiredImages.length > 0 ? `Desired State Analysis:
${desiredStateAnalysis.join('\n\n')}` : 'No desired state images provided'}

User's Description: ${description}
Timeline: ${timeline || 'flexible'}

Your role is to:
1. Start with a brief greeting and acknowledge their renovation project
2. If images were provided:
   - Briefly summarize what you see in the current state (if provided)
   - Briefly summarize the desired changes (if provided)
   - Compare the two states if both are provided
3. Provide an initial rough price range based on available information
4. Ask ONE specific question to gather more details
5. After each response:
   - Provide an updated price range based on all information so far
   - End with: "Feel free to provide more information to get a more precise price range or select one of the options below."

Remember to:
- Be concise and direct
- Ask one question at a time
- Provide a price range with every response
- Each new piece of information should narrow the price range
- Don't assume details that weren't provided in images
- If no images were provided, focus on gathering information through conversation`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "system", content: initialPrompt }],
          temperature: 0.7
        });

        const content = completion.choices[0].message.content;
        return NextResponse.json({
          conversationId: Date.now().toString(),
          message: content,
          priceRange: extractPriceRange(content)
        });
      } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to get response from OpenAI');
      }
    }

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content
      }));

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a renovation expert AI assistant continuing a conversation about a renovation project. 

Your goals are to:
1. Keep responses concise (2-3 sentences max)
2. Ask one specific question at a time
3. With every response, provide an updated price range based on all information gathered so far
4. End with: "Feel free to provide more information to get a more precise price range or select one of the options below."

Remember:
- Be concise and direct
- Provide a price range with every response
- Each new piece of information should narrow the price range
- ALWAYS include the price range in this exact format at the end of your response:
  "Estimated Price Range: $X,XXX to $X,XXX"
  For example: "Estimated Price Range: $15,000 to $25,000"
- The price range should be the last line of your response`
          },
          ...conversationHistory,
          { role: "user", content: message }
        ],
        temperature: 0.7
      });

      const content = completion.choices[0].message.content;
      const priceRange = extractPriceRange(content);
      
      if (!priceRange) {
        console.warn('No price range found in response:', content);
      }

      return NextResponse.json({
        message: content,
        priceRange
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

function extractPriceRange(text: string | null): { min: number; max: number } | null {
  if (!text) return null;
  const priceMatch = text.match(/\$(\d+,\d+|\d+)\s*to\s*\$(\d+,\d+|\d+)/);
  if (priceMatch) {
    return {
      min: parseInt(priceMatch[1].replace(/,/g, '')),
      max: parseInt(priceMatch[2].replace(/,/g, ''))
    };
  }
  return null;
} 