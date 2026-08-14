
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
}

export default IndexPage;
import React from 'react';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col justify-between">
      {/* 1. TOP HEADER */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0A0A0C] border-b border-[#B87333]/30">
        <button className="p-2 text-[#B87333] hover:bg-white/5 rounded-md">☰</button>
        <h1 className="text-lg font-bold tracking-wider text-[#D4AF37]">
          X-COPPER AI
        </h1>
        <button className="p-2 text-[#B87333] hover:bg-white/5 rounded-md">⋮</button>
      </header>

      {/* 2. MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 mb-4 rounded-full border border-[#B87333]/50 flex items-center justify-center bg-[#121215]">
          <span className="text-[#D4AF37] text-2xl font-bold">X</span>
        </div>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">Welcome to X-COPPER AI</h2>
        <p className="text-gray-400 max-w-md text-sm">
          How can I assist you today? Choose a mode or type your request below.
        </p>
      </main>

      {/* 3. BOTTOM INPUT BAR */}
      <div className="p-3 bg-[#0A0A0C] border-t border-[#B87333]/30">
        <div className="max-w-2xl mx-auto flex items-center bg-[#121215] border border-[#B87333] rounded-xl px-3 py-2">
          <div className="flex items-center space-x-2 mr-2 text-[#B87333]">
            <button className="p-1 hover:bg-white/5 rounded">+</button>
            <button className="p-1 hover:bg-white/5 rounded">🎙️</button>
          </div>
          <input 
            type="text" 
            placeholder="Ask X-COPPER AI..." 
            className="flex-1 bg-transparent border-none text-white focus:outline-none px-2 text-sm"
          />
          <button className="text-xs px-3 py-1.5 rounded-md bg-[#B87333] text-black font-semibold hover:bg-[#D4AF37] transition">
            X-COPPER Live
          </button>
        </div>
      </div>
    </div>
  );
}
