import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PROMPTS: Record<string, (text: string) => string> = {
  improve: (t) => `Improve the following text, making it clearer and more professional. Return only the improved text, no explanations:\n\n${t}`,
  summarize: (t) => `Summarize the following text concisely. Return only the summary:\n\n${t}`,
  expand: (t) => `Expand on the following text with more detail and examples. Return only the expanded text:\n\n${t}`,
  fix: (t) => `Fix any grammar and spelling errors in the following text. Return only the corrected text:\n\n${t}`,
  continue: (t) => `Continue writing the following text naturally. Return only the continuation:\n\n${t}`,
};

export async function POST(request: NextRequest) {
  const { text, action } = await request.json();

  if (!text) {
    return Response.json({ error: "text is required" }, { status: 400 });
  }

  const buildPrompt = PROMPTS[action] ?? ((t: string) => `${action}:\n\n${t}`);

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: buildPrompt(text) }],
    max_tokens: 1024,
  });

  const result = completion.choices[0]?.message?.content ?? "";

  return Response.json({ result });
}
