import { Mic, Sparkles, Zap, Brain, ArrowRight, Play } from "lucide-react";

export default function Home() {
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
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content Container */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 rounded-3xl blur opacity-25 animate-pulse"></div>
            
            <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-16 shadow-2xl">
              {/* Main Headline - Hero Header */}
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Talk Now
                </span>
                <br />
                <span className="text-white/90">with Our Intelligent System</span>
              </h1>

              {/* Header Badge */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-POWERED INTELLIGENCE</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Microphone Section */}
              <div className="mb-12">
                <div className="relative inline-block">
                  {/* Outer Ring */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-full opacity-20 animate-spin" style={{animationDuration: '8s'}}></div>
                  
                  {/* Main Microphone */}
                  <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                    <Mic className="w-16 h-16 text-white drop-shadow-lg" />
                    
                    {/* Pulse Rings */}
                    <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-ping opacity-20" style={{animationDelay: '0.5s'}}></div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  <span className="text-emerald-300 font-semibold tracking-wider">SYSTEM ACTIVE</span>
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-6 mb-12">
                <a href="/ai-consultant" className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 hover:from-cyan-500 hover:via-purple-500 hover:to-blue-500 text-white font-semibold py-6 px-12 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25 border border-cyan-400/30">
                  <Play className="w-6 h-6" />
                  <span>Start AI Consultation</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  
                  {/* Button Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                </a>
                
                <p className="text-sm text-gray-400 font-light">
                  Experience the future of business intelligence
                </p>
              </div>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
                Discover how our cutting-edge AI technology can revolutionize your business operations, 
                <span className="text-cyan-300 font-medium"> saving time and money</span> with intelligent automation
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Time Saving */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-gray-300 leading-relaxed">AI-powered automation that processes tasks in milliseconds, not minutes</p>
              </div>
            </div>

            {/* Cost Efficiency */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Maximum ROI</h3>
                <p className="text-gray-300 leading-relaxed">Reduce operational costs by up to 80% with intelligent automation</p>
              </div>
            </div>

            {/* AI Intelligence */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Advanced AI</h3>
                <p className="text-gray-300 leading-relaxed">State-of-the-art machine learning algorithms that learn and adapt</p>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">10x</div>
              <div className="text-gray-400 text-sm">Faster</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">AI</div>
              <div className="text-gray-400 text-sm">Powered</div>
            </div>
          </div>

          {/* AI Solutions Section */}
          <div className="mt-24">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>COMPREHENSIVE AI SOLUTIONS</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  AI Powered Intelligent
                </span>
                <br />
                <span className="text-white/90">Automated Solutions</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Kiosks, Customer Service, Phone Support, Receptionist
              </p>
            </div>

            {/* Hero Image Section */}
            <div className="relative mb-16">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl blur opacity-25 animate-pulse"></div>
              
              <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 overflow-hidden">
                <div className="relative z-10">
                  <img 
                    src="/images/2.png" 
                    alt="AI Powered Intelligent Solutions" 
                    className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>

            {/* Solutions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Kiosks */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Smart Kiosks</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Interactive AI-powered kiosks for seamless customer engagement</p>
                </div>
              </div>

              {/* Customer Service */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Customer Service</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">24/7 AI customer support with human-like interactions</p>
                </div>
              </div>

              {/* Phone Support */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Phone Support</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Intelligent voice AI for automated phone assistance</p>
                </div>
              </div>

              {/* Receptionist */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">AI Receptionist</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Virtual receptionist for automated front desk management</p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <a href="/ai-consultant" className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 border border-purple-400/30">
                <span>Explore All Solutions</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
              </a>
            </div>
          </div>

          {/* Computer Vision & AI Software Section */}
          <div className="mt-24">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-medium backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>ADVANCED AI TECHNOLOGY</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                  Computer Vision
                </span>
                <br />
                <span className="text-white/90">Custom AI Software</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Monitoring Intelligent Systems
              </p>
            </div>

            {/* Hero Image Section */}
            <div className="relative mb-16">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 rounded-3xl blur opacity-25 animate-pulse"></div>
              
              <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 overflow-hidden">
                <div className="relative z-10">
                  <img 
                    src="/images/3.png" 
                    alt="Computer Vision Custom AI Software Monitoring" 
                    className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>

            {/* Technology Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Computer Vision */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Computer Vision</h3>
                  <p className="text-gray-300 leading-relaxed">Advanced image recognition and visual AI processing for automated monitoring and analysis</p>
                </div>
              </div>

              {/* Custom AI Software */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Custom AI Software</h3>
                  <p className="text-gray-300 leading-relaxed">Tailored artificial intelligence solutions designed for your specific business needs</p>
                </div>
              </div>

              {/* Monitoring Systems */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Intelligent Monitoring</h3>
                  <p className="text-gray-300 leading-relaxed">Real-time AI-powered monitoring systems for predictive analytics and automated responses</p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-300">Real-time image processing and analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Custom machine learning algorithms</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Predictive maintenance capabilities</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-300">Automated quality control systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Scalable AI infrastructure</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">24/7 intelligent surveillance</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <a href="/ai-consultant" className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 border border-emerald-400/30">
                <span>Learn More About Our AI</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
              </a>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
