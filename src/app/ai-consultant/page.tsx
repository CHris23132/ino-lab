"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Phone, Headphones, Sparkles, Zap, Brain, Radio, Settings, RotateCcw } from "lucide-react";

interface Message {
  id: number;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function AIConsultant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI voice consultant. I\'m here to help you discover how our intelligent systems can save your business time and money. Just speak naturally and I\'ll assist you with everything you need to know about our AI solutions.',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate voice level animation
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVoiceLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVoiceLevel(0);
    }
  }, [isListening]);

  const handleStartListening = () => {
    setIsListening(true);
    setIsProcessing(false);
    
    // Simulate voice recognition
    setTimeout(() => {
      const userMessage = "I'd like to learn more about your AI solutions for my business.";
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        content: userMessage,
        timestamp: new Date()
      }]);
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate AI processing and response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          content: 'Excellent! I\'d be happy to help you explore our AI solutions. We offer several cutting-edge technologies including intelligent kiosks, customer service automation, computer vision systems, and custom AI software. Which area interests you most?',
          timestamp: new Date()
        }]);
        setIsProcessing(false);
        setIsSpeaking(true);
        
        // Auto-stop speaking after response
        setTimeout(() => {
          setIsSpeaking(false);
        }, 3000);
      }, 2000);
    }, 3000);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleConnect = () => {
    setIsConnected(true);
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      content: 'Voice connection established. You can now speak with your AI consultant.',
      timestamp: new Date()
    }]);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      content: 'Voice connection disconnected.',
      timestamp: new Date()
    }]);
  };

  const handleReset = () => {
    setMessages([{
      id: Date.now(),
      type: 'ai',
      content: 'Hello! I\'m your AI voice consultant. I\'m here to help you discover how our intelligent systems can save your business time and money. Just speak naturally and I\'ll assist you with everything you need to know about our AI solutions.',
      timestamp: new Date()
    }]);
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>VOICE-POWERED AI CONSULTANT</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                Voice AI
              </span>
              <br />
              <span className="text-white/90">Consultant</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Speak naturally with our intelligent voice AI assistant
            </p>
          </div>

          {/* Connection Status */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
              isConnected 
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-300' 
                : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300'
            }`}>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-orange-400'} animate-pulse`}></div>
              <span className="font-semibold tracking-wider">
                {isConnected ? 'VOICE CONNECTED' : 'VOICE DISCONNECTED'}
              </span>
            </div>
          </div>

          {/* Main Voice Interface */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 rounded-3xl blur opacity-25 animate-pulse"></div>
            
            <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              {/* Voice Status Display */}
              <div className="text-center mb-8">
                {!isConnected ? (
                  <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <Phone className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-400">Connect to start voice conversation</p>
                  </div>
                ) : isListening ? (
                  <div className="space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                      {/* Voice Level Visualization */}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-black/20 rounded-full flex items-center justify-center">
                        <Mic className="w-16 h-16 text-white" />
                      </div>
                      {/* Voice Level Bars */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-end gap-1 h-8">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-cyan-400 rounded-full transition-all duration-100"
                            style={{
                              height: `${Math.max(20, voiceLevel * (0.3 + i * 0.1))}%`,
                              opacity: 0.3 + (i * 0.1)
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-cyan-300 font-medium">Listening... Speak now</p>
                  </div>
                ) : isProcessing ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-purple-300 font-medium">Processing your request...</p>
                  </div>
                ) : isSpeaking ? (
                  <div className="space-y-4">
                                         <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center">
                       <Radio className="w-16 h-16 text-white animate-pulse" />
                     </div>
                    <p className="text-emerald-300 font-medium">AI is speaking...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                      <Mic className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-cyan-300 font-medium">Tap to speak or click the button below</p>
                  </div>
                )}
              </div>

              {/* Voice Controls */}
              <div className="flex items-center justify-center gap-6 mb-8">
                {!isConnected ? (
                  <button
                    onClick={handleConnect}
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 border border-emerald-400/30"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Connect Voice</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={isListening ? handleStopListening : handleStartListening}
                      disabled={isProcessing || isSpeaking}
                      className={`group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 shadow-2xl ${
                        isListening 
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 animate-pulse' 
                          : isProcessing || isSpeaking
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/25'
                      }`}
                    >
                      {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                      {isListening && (
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-50 animate-ping"></div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setIsSpeaking(!isSpeaking)}
                      disabled={isListening || isProcessing}
                      className={`group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isSpeaking 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : isListening || isProcessing
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                    </button>

                    <button
                      onClick={handleDisconnect}
                      className="group relative w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 transition-all duration-500 transform hover:scale-110"
                    >
                      <Phone className="w-6 h-6 text-white rotate-90" />
                    </button>
                  </>
                )}
              </div>

              {/* Conversation History */}
              <div className="h-64 overflow-y-auto mb-6 space-y-4 border-t border-white/10 pt-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                        : message.type === 'system'
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    }`}>
                      <div className="flex items-start gap-3">
                        {message.type === 'ai' && (
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reset Button */}
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Reset Conversation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Voice Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Voice-First Design</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Optimized for natural voice conversations with minimal text input</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-500">
                                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                <h3 className="text-lg font-bold text-white mb-2">Real-time Processing</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Instant voice recognition and AI response generation</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Natural Speech</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Advanced speech synthesis for human-like AI responses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
