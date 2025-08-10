export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Build conversation context
    const messages = [
      {
        role: 'system' as const,
        content: `You are an AI consultant assistant specializing in helping businesses discover how AI solutions can save them time and money. You have expertise in:

- Intelligent kiosks and customer service automation
- Computer vision and custom AI software
- Phone support and virtual receptionist systems
- Business process optimization with AI

Be helpful, professional, and focus on understanding their business needs to recommend appropriate AI solutions. Keep responses conversational and informative.`
      },
      ...(conversationHistory || []).slice(-10), // Keep last 10 messages for context
      {
        role: 'user' as const,
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';

    return NextResponse.json({ response });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Chat error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
