import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface EstimateResponse {
  estimate: string;
  timeline: string;
  questions: string[];
}

interface ImageAnalysis {
  current: string[];
  desired: string[];
}

export async function generateEstimate(
  description: string,
  imageAnalysis: ImageAnalysis
): Promise<EstimateResponse> {
  const prompt = `As a renovation expert, analyze this project:

Description: ${description}

Current State Analysis:
${imageAnalysis.current.map((caption, i) => `- Image ${i + 1}: ${caption}`).join('\n')}

Desired State Analysis:
${imageAnalysis.desired.map((caption, i) => `- Image ${i + 1}: ${caption}`).join('\n')}

Based on the description and image analysis, provide a detailed response in this exact JSON format:
{
  "estimate": "Detailed cost estimate with breakdown, considering the current and desired states",
  "timeline": "Realistic project timeline based on the scope of work",
  "questions": ["Question 1", "Question 2", "Question 3"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a renovation expert with experience in:
- Cost estimation for residential and commercial projects
- Timeline planning for renovations
- Identifying potential challenges and requirements
- Asking relevant follow-up questions to clarify project scope`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  const response = completion.choices[0].message.content;
  if (!response) throw new Error('No response from GPT');

  return JSON.parse(response) as EstimateResponse;
} 