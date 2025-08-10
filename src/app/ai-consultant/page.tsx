"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Square, Sparkles } from "lucide-react";
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

// Firebase configuration
function firebaseApp() {
  if (!getApps().length) {
    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }
  return getApp();
}

interface Answer {
  question: string;
  answer: string;
  timestamp: Date;
}

const QUESTIONS = [
  "What in your business do you want to automate?",
  "What position or process do you want to replace to save money and time?",
  "What type of AI system can help improve your processes?",
  "What industry are you in?",
  "What is your company size, how many employees?"
] as const;

export default function AIConsultant() {
  // UI state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  // Firestore tracking
  const [consultationDocID, setConsultationDocID] = useState<string | null>(null);

  // Function refs to avoid circular dependencies
  const askQuestionRef = useRef<((questionIndex: number) => Promise<void>) | null>(null);
  const endConsultationRef = useRef<(() => Promise<void>) | null>(null);
  const startListeningRef = useRef<(() => Promise<void>) | null>(null);
  const stopListeningRef = useRef<(() => Promise<void>) | null>(null);

  // Check microphone permission status
  const checkMicPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Check if we already have permission
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      if (permission.state === 'granted') {
        setMicPermission('granted');
        return true;
      } else if (permission.state === 'denied') {
        setMicPermission('denied');
        setError('Microphone access is required. Please enable it in your browser settings.');
        return false;
      } else {
        setMicPermission('prompt');
        return false;
      }
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      setMicPermission('prompt');
      return false;
    }
  }, []);

  // Request microphone permission
  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately - we just wanted permission
      stream.getTracks().forEach(track => track.stop());
      
      setMicPermission('granted');
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setMicPermission('denied');
        setError('Microphone access was denied. Please allow microphone access and try again.');
      } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('NotReadableError')) {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (errorMessage.includes('NotSupportedError') || errorMessage.includes('NotSecureContextError')) {
        setError('Microphone access requires a secure connection (HTTPS) or localhost. Please access this site via localhost:3000 instead of IP address.');
      } else {
        setError('Failed to access microphone. Please check your browser settings and ensure you\'re using localhost:3000.');
      }
      
      return false;
    }
  }, []);

  // Speak text using TTS
  const speak = useCallback(async (text: string): Promise<void> => {
    try {
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        URL.revokeObjectURL(ttsAudioRef.current.src);
      }
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('TTS request failed');
      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      ttsAudioRef.current = audio;
      await audio.play();
    } catch (error: unknown) {
      console.error('TTS error:', error);
    }
  }, []);

  // Save answer to Firestore
  const saveToFirestore = useCallback(async (answer: Answer) => {
    try {
      const app = firebaseApp();
      const auth = getAuth(app);
      
      const db = getFirestore(app);

      if (consultationDocID) {
        const ref = doc(db, 'ai_consultations', consultationDocID);
        const updateData: Record<string, unknown> = {
          answers: arrayUnion(answer),
          currentQuestion: currentQuestionIndex + 1,
          lastUpdated: serverTimestamp(),
        };
        await setDoc(ref, updateData, { merge: true });
      }
    } catch (error: unknown) {
      console.error('Firestore save error:', error);
    }
  }, [consultationDocID, currentQuestionIndex]);

  // Save consultation complete
  const saveConsultationComplete = useCallback(async () => {
    try {
      const app = firebaseApp();
      const auth = getAuth(app);
      
      const db = getFirestore(app);

      if (consultationDocID) {
        const ref = doc(db, 'ai_consultations', consultationDocID);
        const finalData: Record<string, unknown> = {
          status: 'completed',
          completedAt: serverTimestamp(),
          totalQuestions: QUESTIONS.length,
          userId: auth.currentUser?.uid || 'anonymous',
        };
        await setDoc(ref, finalData, { merge: true });
      }
    } catch (error: unknown) {
      console.error('Firestore save error:', error);
    }
  }, [consultationDocID]);

  // End consultation
  const endConsultation = useCallback(async () => {
    setIsCallActive(false);
    setIsListening(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    
    const completionMessage = "Thank you for completing the consultation. I have all the information I need to help you with AI solutions for your business.";
    await speak(completionMessage);
    
    // Save final consultation data
    await saveConsultationComplete();
  }, [speak, saveConsultationComplete]);

  // Process the recorded answer
  const processAnswer = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // 1) Transcribe
      const fd = new FormData();
      fd.append('file', audioBlob, `answer_${currentQuestionIndex}.webm`);
      const tr = await fetch('/api/transcribe', { method: 'POST', body: fd });
      if (!tr.ok) throw new Error('Transcription failed');
      const { text } = await tr.json();
      setTranscription(text);

      // 2) Save answer
      const answer: Answer = {
        question: QUESTIONS[currentQuestionIndex],
        answer: text,
        timestamp: new Date()
      };

      // 3) Save to Firestore
      await saveToFirestore(answer);

      // 4) Move to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      if (nextIndex < QUESTIONS.length) {
        setTimeout(() => {
          askQuestionRef.current?.(nextIndex);
        }, 2000);
      } else {
        await endConsultation();
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Processing Error:', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [currentQuestionIndex, saveToFirestore, endConsultation]);

  // Stop listening and process answer
  const stopListening = useCallback(async () => {
    if (!isListening || !mediaRecorderRef.current) return;

    // Clear silence timer
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
    }

    const recorder = mediaRecorderRef.current;
    recorder.stop();
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    mediaRecorderRef.current = null;
    setIsListening(false);

    // Build the blob and process
    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = [];
    await processAnswer(blob);
  }, [isListening, silenceTimer, processAnswer]);

  // Silence detection for auto-stop
  const startSilenceDetection = useCallback(() => {
    const timer = setTimeout(() => {
      if (isListening) {
        stopListeningRef.current?.();
      }
    }, 3000); // Stop after 3 seconds of silence
    setSilenceTimer(timer);
  }, [isListening]);

  // Start listening for answer
  const startListening = useCallback(async () => {
    try {
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
      }
      setTranscription(null);
      setIsProcessing(false);

      const mime = 'audio/webm;codecs=opus';
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType: mime });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsListening(true);

      // Start silence detection
      startSilenceDetection();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Could not start recording.';
      console.error('Recording Error:', errorMessage);
      setError('Failed to start recording. Please check your microphone.');
    }
  }, [startSilenceDetection]);

  // Ask a specific question
  const askQuestion = useCallback(async (questionIndex: number) => {
    if (questionIndex >= QUESTIONS.length) {
      // Consultation complete
      await endConsultation();
      return;
    }

    setIsSpeaking(true);
    const question = QUESTIONS[questionIndex];
    await speak(question);
    setIsSpeaking(false);
    
    // Start listening after question is asked
    setTimeout(() => {
      startListeningRef.current?.();
    }, 1000);
  }, [speak, endConsultation]);

  // Start the consultation
  const startConsultation = useCallback(async () => {
    // First check if we have microphone permission
    const hasPermission = await checkMicPermission();
    
    if (!hasPermission) {
      // Request permission
      const granted = await requestMicPermission();
      if (!granted) {
        return; // Don't start if permission denied
      }
    }

    setIsCallActive(true);
    setCurrentQuestionIndex(0);
    setConsultationDocID(crypto.randomUUID());
    setError(null);
    
    // Ask the first question
    await askQuestion(0);
  }, [checkMicPermission, requestMicPermission, askQuestion]);

  // Update function refs
  useEffect(() => {
    askQuestionRef.current = askQuestion;
    endConsultationRef.current = endConsultation;
    startListeningRef.current = startListening;
    stopListeningRef.current = stopListening;
  }, [askQuestion, endConsultation, startListening, stopListening]);

  // Handle button click
  const handleButtonClick = useCallback(() => {
    if (isCallActive) {
      // Stop consultation
      setIsCallActive(false);
      setIsListening(false);
      setIsProcessing(false);
      setIsSpeaking(false);
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        setSilenceTimer(null);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    } else {
      // Start consultation
      startConsultation();
    }
  }, [isCallActive, silenceTimer, startConsultation]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI BUSINESS CONSULTANT</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                AI Consultant
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-xl mx-auto">
              Answer 5 questions to discover how AI can transform your business
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
                <p className="text-red-300 text-sm">{error}</p>
                {micPermission === 'denied' && (
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-red-200 hover:text-white text-xs underline"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status Display */}
          {isCallActive && (
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full text-emerald-300">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-semibold tracking-wider">
                  Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                </span>
              </div>
            </div>
          )}

          {/* Current Question */}
          {isCallActive && currentQuestionIndex < QUESTIONS.length && (
            <div className="mb-8">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {QUESTIONS[currentQuestionIndex]}
                </h2>
                {isSpeaking && (
                  <p className="text-cyan-300 text-sm">AI is asking the question...</p>
                )}
              </div>
            </div>
          )}

          {/* Live transcription */}
          {transcription && (
            <div className="mb-6">
              <p className="text-sm text-gray-300 italic">&ldquo;{transcription}&rdquo;</p>
            </div>
          )}

          {/* Main Button */}
          <div className="mb-8">
            <button
              onClick={handleButtonClick}
              disabled={isProcessing || !!error}
              className={`group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 shadow-2xl ${
                isCallActive 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
              } ${(isProcessing || !!error) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCallActive ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
              
              {/* Voice level visualization when listening */}
              {isListening && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full animate-pulse"></div>
              )}
            </button>
          </div>

          {/* Status Messages */}
          <div className="space-y-2">
            {!isCallActive && !error && (
              <p className="text-gray-400">Click to start your AI consultation</p>
            )}
            {!isCallActive && error && (
              <p className="text-red-300 text-sm">Please resolve the microphone issue above</p>
            )}
            {isListening && (
              <p className="text-cyan-300 font-medium">Listening... Speak your answer</p>
            )}
            {isProcessing && (
              <p className="text-purple-300 font-medium">Processing your answer...</p>
            )}
            {isSpeaking && (
              <p className="text-emerald-300 font-medium">AI is speaking...</p>
            )}
          </div>

          {/* Progress */}
          {isCallActive && (
            <div className="mt-8">
              <div className="flex justify-center gap-2">
                {QUESTIONS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < currentQuestionIndex 
                        ? 'bg-emerald-400' 
                        : index === currentQuestionIndex 
                        ? 'bg-cyan-400 animate-pulse' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Consultation Complete */}
          {isCallActive && currentQuestionIndex >= QUESTIONS.length && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-emerald-300 mb-2">
                  Consultation Complete!
                </h3>
                <p className="text-gray-300">
                  Thank you for your answers. Your consultation has been saved.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
