import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const SYSTEM_PROMPT = `
You are a helpful DevDynamo AI assistant. You only answer questions related to DevDynamo's services.
FAQ:
- Pricing: Corporate sites (LKR 80k-150k), eCommerce (LKR 150k-400k+), maintenance (LKR 5k-15k/mo).
- Timeline: 4-6 weeks for corporate sites.
- Maintenance: 30-day post-launch support included.
- SEO: Full audit and redirect maps provided.
- Tech: React, Next.js, Laravel, Tailwind.
- Global: We serve global clients (UK, Australia, UAE, etc.).
- Why DevDynamo: In-house team, structured process, long-term accountability.
- If a question is off-topic (e.g., coding, general knowledge), set isOffTopic to true.
`;

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const schema = z.object({
      isOffTopic: z.boolean(),
      replyText: z.string(),
    });

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: "user", parts: [{ text: JSON.stringify(messages) }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            isOffTopic: { type: "boolean" },
            replyText: { type: "string" },
          },
          required: ["isOffTopic", "replyText"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from AI");

    return Response.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error("DEBUG API ERROR:", error);

    if (error.status === 429) {
      return Response.json(
        {
          replyText:
            "I'm currently busy with too many requests. Please wait a few seconds and try again.",
        },
        { status: 429 },
      );
    }

    return Response.json(
      { error: "Failed to fetch response" },
      { status: 500 },
    );
  }
}
