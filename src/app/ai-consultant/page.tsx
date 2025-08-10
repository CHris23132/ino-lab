'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp, arrayUnion, collection, addDoc } from 'firebase/firestore';
import { Mic, Square, Sparkles } from 'lucide-react';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug Firebase config
console.log('Firebase config check:', {
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});

// Extend Window interface
declare global {
  interface Window {
    firebaseApp?: ReturnType<typeof initializeApp>;
  }
}

// Initialize Firebase
const firebaseApp = () => {
  if (typeof window !== 'undefined') {
    if (!window.firebaseApp) {
      console.log('Initializing Firebase app...');
      window.firebaseApp = initializeApp(firebaseConfig);
    }
    return window.firebaseApp;
  }
  return null;
};

// Questions array (business automation focus)
const questions: string[] = [
  "What in your business do you want to automate?",
  "What position or process do you want to replace to save money and time?",
  "What type of AI system can help improve processes?",
  "What industry are you in?",
  "What is your company size, how many employees?"
];

// Field keys aligned with questions (business automation focus)
const fieldKeys: string[] = [
  "automationTarget",      // What they want to automate
  "processToReplace",      // Position/process to replace
  "aiSystemType",          // Type of AI system needed
  "industry",              // Industry they're in
  "companySize"            // Company size/employee count
];

// Interface for QA entry
interface QAEntry {
  index: number;
  question: string;
  transcript: string;
  normalized: Record<string, unknown>;
}

// Alert message interface
interface AlertMessage {
  id: string;
  title: string;
  message: string;
}

export default function AIConsultantPage() {
  // State variables (matching Swift app)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [finished, setFinished] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const customerDocIDRef = useRef<string | null>(null);

  // Computed values
  const currentQuestion = questions[currentQuestionIndex];
  const totalSteps = questions.length;

  // Request microphone permission
  const requestMicPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      setAlert({
        id: Date.now().toString(),
        title: "Microphone Access Needed",
        message: "Please enable microphone access in Settings to proceed."
      });
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Stop TTS if playing
      if (ttsAudioRef.current && !ttsAudioRef.current.paused) {
        ttsAudioRef.current.pause();
      }

      setTranscription(null);
      setIsLoading(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Try different audio formats for better compatibility
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav'
      ];
      
      let selectedMimeType = null;
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported audio format found');
      }

      console.log('Using audio format:', selectedMimeType);

      const recorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      setAlert({
        id: Date.now().toString(),
        title: "Recording Error",
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    // Process the answer
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      await processAnswer(audioBlob);
    };
  }, [isRecording]);

  // TTS - Speak current question
  const speakCurrentQuestion = useCallback(async () => {
    if (isRecording) return;
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentQuestion })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (ttsAudioRef.current) {
          ttsAudioRef.current.src = audioUrl;
          ttsAudioRef.current.play();
        }
      }
    } catch (error) {
      console.error('TTS error:', error);
    }
  }, [currentQuestion, isRecording]);

  // Process answer (matching Swift app workflow)
  const processAnswer = async (audioBlob: Blob) => {
    setIsLoading(true);

    try {
      // 1) Transcribe with Whisper
      const transcript = await transcribeAudio(audioBlob);
      setTranscription(transcript);

      // 2) Normalize to JSON for storage
      const normalizedJSON = await normalizeAnswer(
        transcript,
        currentQuestionIndex,
        currentQuestion
      );

      // 3) Save to Firestore
      await saveToFirestore(
        normalizedJSON,
        currentQuestionIndex,
        currentQuestion,
        transcript
      );

      // 4) Advance or finish
      if (currentQuestionIndex + 1 < totalSteps) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setFinished(true);
        setAlert({
          id: Date.now().toString(),
          title: "All Done",
          message: "Thanks! The customer record has been created and updated."
        });
      }
    } catch (error) {
      setAlert({
        id: Date.now().toString(),
        title: "Processing Error",
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Transcribe audio with Whisper
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      console.log('Transcribing audio:', {
        size: audioBlob.size,
        type: audioBlob.type
      });

      // Create file with correct type and extension
      let fileName = 'audio.webm';
      let fileType = 'audio/webm';
      
      if (audioBlob.type.includes('mp4')) {
        fileName = 'audio.mp4';
        fileType = 'audio/mp4';
      } else if (audioBlob.type.includes('wav')) {
        fileName = 'audio.wav';
        fileType = 'audio/wav';
      }

      const file = new File([audioBlob], fileName, { type: fileType });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', 'whisper-1');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Transcription failed: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  };

  // Normalize answer (business automation focus)
  const normalizeAnswer = async (
    transcript: string,
    questionIndex: number,
    questionText: string
  ): Promise<string> => {
    const key = fieldKeys[questionIndex];

    let systemPrompt: string;
    if (questionIndex === 0) {
      // Automation target
      systemPrompt = `Return EXACTLY: {"fields":{"${key}":"<specific business process or task they want to automate>"}}
No extra text or backticks.`;
    } else if (questionIndex === 1) {
      // Process to replace
      systemPrompt = `Return EXACTLY: {"fields":{"${key}":"<specific position, role, or process they want to replace>"}}
No extra text or backticks.`;
    } else if (questionIndex === 2) {
      // AI system type
      systemPrompt = `Return EXACTLY: {"fields":{"${key}":"<type of AI system that would help (e.g., chatbot, automation software, computer vision, etc.)>"}}
No extra text or backticks.`;
    } else if (questionIndex === 3) {
      // Industry
      systemPrompt = `Return EXACTLY: {"fields":{"${key}":"<their industry or business sector>"}}
No extra text or backticks.`;
    } else if (questionIndex === 4) {
      // Company size
      systemPrompt = `Return EXACTLY: {"fields":{"${key}":"<number of employees or company size category>"}}
No extra text or backticks.`;
    } else {
      systemPrompt = `Return EXACTLY: {"fields":{"${key}":"<short, clear answer>"}}
No extra text or backticks.`;
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Question: ${questionText}\nAnswer: ${transcript}`,
        systemPrompt
      })
    });

    if (!response.ok) {
      throw new Error('Normalization failed');
    }

    const data = await response.json();
    return data.response;
  };

  // Save to Firestore (matching Swift app structure)
  const saveToFirestore = async (
    normalizedJSON: string,
    questionIndex: number,
    questionText: string,
    transcript: string
  ) => {
    try {
      console.log('Starting Firestore save...');
      
      const parsed = JSON.parse(normalizedJSON);
      const fields = parsed.fields || {};

      const app = firebaseApp();
      if (!app) {
        throw new Error('Firebase not initialized');
      }
      console.log('Firebase app initialized successfully');
      
      const db = getFirestore(app);
      console.log('Firestore instance created');

      const qaEntry: QAEntry = {
        index: questionIndex,
        question: questionText,
        transcript: transcript,
        normalized: fields
      };

      console.log('Current customerDocID:', customerDocIDRef.current);
      console.log('Question index:', questionIndex);

      if (!customerDocIDRef.current) {
        console.log('Creating new customer document...');
        // First step creates the doc with auto-generated ID
        const customersCollection = collection(db, 'customers');
        console.log('Collection reference created');
        
        const docRef = await addDoc(customersCollection, {
          createdAt: serverTimestamp(),
          qa: [qaEntry],
          ...fields
        });
        
        console.log('Document created with ID:', docRef.id);
        
        customerDocIDRef.current = docRef.id;
        console.log('Created new customer document:', docRef.id);
      } else {
        console.log('Updating existing customer document...');
        // Subsequent steps: merge + append to qa
        const ref = doc(db, 'customers', customerDocIDRef.current);
        console.log('Document reference created for update');
        
        const update: Record<string, unknown> = {
          qa: arrayUnion(qaEntry),
          ...fields
        };

        await setDoc(ref, update, { merge: true });
        console.log('Updated customer document:', customerDocIDRef.current);
      }

      console.log('Saved to Firestore:', {
        questionIndex,
        fields,
        customerDocID: customerDocIDRef.current
      });
    } catch (error) {
      console.error('Firestore save error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  };

  // Reset for next customer
  const resetForNextCustomer = useCallback(() => {
    // Stop and clear any recorder state
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    audioChunksRef.current = [];

    // Reset UI and flow state
    setIsRecording(false);
    setIsLoading(false);
    setTranscription(null);
    setCurrentQuestionIndex(0);

    // Reset Firestore tracking
    customerDocIDRef.current = null;

    // Clear flags and alert
    setFinished(false);
    setAlert(null);
  }, []);

  // Effects
  useEffect(() => {
    requestMicPermission();
    speakCurrentQuestion();
  }, [requestMicPermission, speakCurrentQuestion]);

  useEffect(() => {
    speakCurrentQuestion();
  }, [currentQuestionIndex, speakCurrentQuestion]);

  // Handle main button click
  const handleMainButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E19] via-[#111D3A] to-[#1A0F3B] relative overflow-hidden">
      {/* Subtle glow accent */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-gradient-radial from-[#6C47FF]/28 to-transparent rounded-full blur-3xl opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Progress */}
          <div className="text-center">
            <p className="text-sm text-white/70">
              Step {currentQuestionIndex + 1} of {totalSteps}
            </p>
          </div>

          {/* Question */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white leading-relaxed">
              {currentQuestion}
            </h2>
          </div>

          {/* Live transcription preview */}
          {transcription && (
            <div className="text-center">
              <p className="text-sm italic text-white/70">
                &ldquo;{transcription}&rdquo;
              </p>
            </div>
          )}

          <div className="flex-1"></div>

          {/* Record / Stop Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleMainButtonClick}
              className="relative group"
              disabled={isLoading}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#14F1D9] to-[#6C47FF] p-1 shadow-lg shadow-[#6C47FF]/35">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#14F1D9] to-[#6C47FF] flex items-center justify-center border border-white/22">
                  {isRecording ? (
                    <Square className="w-9 h-9 text-black/85" fill="currentColor" />
                  ) : (
                    <Mic className="w-9 h-9 text-black/85" />
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center pt-3">
              <div className="w-6 h-6 border-2 border-[#14F1D9] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="flex-1"></div>
        </div>
      </div>

      {/* Alert Modal */}
      {alert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">{alert.title}</h3>
            <p className="text-gray-600 mb-4">{alert.message}</p>
            <button
              onClick={() => {
                setAlert(null);
                if (finished) {
                  resetForNextCustomer();
                }
              }}
              className="w-full bg-[#6C47FF] text-white py-2 px-4 rounded-lg hover:bg-[#5A3FD8] transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Hidden audio element for TTS */}
      <audio ref={ttsAudioRef} className="hidden" />
    </div>
  );
}
