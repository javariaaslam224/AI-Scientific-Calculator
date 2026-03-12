import React from 'react';
import Calculator from './components/Calculator';
import { Calculator as CalcIcon, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <CalcIcon className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-zinc-100">AI Scientific</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-bold">Advanced Computing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Gemini 3.0 Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <Calculator />
      </main>

      {/* Footer */}
      <footer className="p-8 text-center">
        <p className="text-zinc-600 text-xs">
          Powered by <span className="text-zinc-400 font-medium">Gemini AI</span> & <span className="text-zinc-400 font-medium">MathJS</span>
        </p>
      </footer>
    </div>
  );
}
