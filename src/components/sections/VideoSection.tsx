import React, { useState } from 'react';

const VideoSection = () => {
  const [activeVideo, setActiveVideo] = useState('full'); // 'full' or 'quick'
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="pt-20 pb-24 relative">
      <div className="container max-w-layout mx-auto px-4 sm:px-6">
        <div className="max-w-[1080px] mx-auto flex flex-col items-center">
          {/* Title Section - Improved centering */}
          <div className="text-center w-full max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
              Watch Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              See AI Legal Workflow <span className="text-[#FFB800]">Automation in Action</span>
            </h2>
            {/* Added brief description of what viewers will learn */}
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Watch how our AI assistant automatically extracts information and completes legal forms, saving hours of manual work.
            </p>
          </div>

          {/* Video Selection Tabs - Improved spacing and alignment */}
          <div className="flex justify-center gap-4 mb-8 w-full">
            <button
              onClick={() => setActiveVideo('full')}
              className={`px-6 py-3 rounded-full transition-all flex-1 max-w-[200px] text-center ${
                activeVideo === 'full'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Full 2-Minute Demo
            </button>
            <button
              onClick={() => setActiveVideo('quick')}
              className={`px-6 py-3 rounded-full transition-all flex-1 max-w-[200px] text-center ${
                activeVideo === 'quick'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Quick 30-Second Overview
            </button>
          </div>
          
          {/* Video Container - Improved positioning */}
          <div 
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Multiple floating tooltips for key moments */}
            <div className={`absolute -top-4 right-4 z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                💡 AI-powered document analysis
              </div>
            </div>
            <div className={`absolute top-1/4 left-4 z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                ✓ Automatic data extraction
              </div>
            </div>
            <div className={`absolute bottom-1/4 right-4 z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                🔄 Real-time form completion
              </div>
            </div>

            {/* Play button overlay - Improved centering */}
            <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)] transform hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Main video container - Added responsive padding */}
            <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-slate-100">
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo === 'full' ? 'F5QC4bwsaIk' : 'shortVideoId'}${isHovered ? '?autoplay=1' : ''}`}
                  title="AssociateAttorney.AI Product Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Added chapter markers */}
          <div className="mt-8 w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="font-medium text-slate-900 mb-1">1. Document Upload</div>
                <div className="text-sm text-slate-600">0:00 - 0:30</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="font-medium text-slate-900 mb-1">2. AI Analysis</div>
                <div className="text-sm text-slate-600">0:31 - 1:15</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="font-medium text-slate-900 mb-1">3. Form Completion</div>
                <div className="text-sm text-slate-600">1:16 - 2:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements - Adjusted positioning */}
      <div className="absolute -left-20 top-10 w-40 h-40 bg-[#0A0F1F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-10 w-40 h-40 bg-[#FFB800]/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default VideoSection;