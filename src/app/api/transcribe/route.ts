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

    console.log('Transcription request:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Validate file size (Whisper has a 25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 25MB)' }, { status: 400 });
    }

    // More permissive file type validation
    const supportedTypes = [
      'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg',
      'audio/webm;codecs=opus', 'audio/webm;codecs=vorbis'
    ];
    
    if (!supportedTypes.includes(file.type)) {
      console.log('File type not in supported list, but trying anyway:', file.type);
      // Don't reject - let OpenAI handle it
    }

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    console.log('Sending to OpenAI Whisper...');
    const tr = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    });

    console.log('Transcription successful:', tr.text);
    return NextResponse.json({ text: tr.text });
  } catch (err: unknown) {
    console.error('Transcription error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Transcription error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
