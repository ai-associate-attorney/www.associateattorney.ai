import { Button } from "@/components/ui/button";
import { Check, Github } from "lucide-react";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-hero-pattern bg-fixed bg-cover"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      <div className="max-w-layout mx-auto px-6 text-center">
        <a
          href="https://github.com/ai-associate-attorney"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium mb-6 hover:bg-slate-800 transition-colors"
        >
          <Github className="w-4 h-4" />
          View our code on GitHub
        </a>
        
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8">
          <span className="mr-2 font-bold">85% Time Saved on Forms</span> | <span className="ml-2 font-bold">99.8% Form Accuracy</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight">
          Enter Information Once, Automate All Your Legal Forms
        </h1>

        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          Our AI transforms one simple conversation into dozens of perfectly completed legal forms and documents.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-green-600 text-white hover:bg-green-700 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            onClick={() => window.location.href = 'https://www.associateattorney.ai/forms/'}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold">Start Automating Your Forms</span>
              <span className="text-sm opacity-90 mt-1">Free 14-day trial, no credit card required</span>
            </div>
          </Button>
          
          <div className="flex flex-col items-center">
            <button
              className="bg-white text-orange-600 hover:bg-orange-50 border-2 border-orange-200 
              font-semibold shadow-sm transition-all duration-200 hover:shadow-md 
              rounded-xl py-4 px-8 flex items-center gap-2"
              onClick={() => window.location.href = 'https://www.youtube.com/watch?v=F5QC4bwsaIk'}
            >
              <span className="font-bold">See Form Automation Demo</span>
              <span className="text-xl">→</span>
            </button>
            <span className="text-sm text-slate-600 mt-2">15-minute personalized walkthrough</span>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-500">
          Join 500+ businesses already saving time on legal paperwork
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 bg-white rounded-2xl shadow-sm p-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="text-green-500 w-5 h-5" />
              <span className="text-slate-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const features = [
  "Fill multiple forms at once",
  "85% time saved on paperwork",
  "99.8% form accuracy rate",
];

export default HeroSection;