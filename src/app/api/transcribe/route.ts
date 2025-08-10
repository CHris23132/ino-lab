export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const tr = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      // language: 'en', // optionally pin a language
      // response_format: 'json',
    });

    return NextResponse.json({ text: tr.text });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Transcription error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
