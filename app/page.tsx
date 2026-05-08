"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { darkTheme } from "thirdweb/react";

// Встав свій Client ID, коли він буде
const client = createThirdwebClient({
  clientId: "1234567890abcdef1234567890abcdef", 
});

// Виправлена тема (прибрано dropdownBg, що викликав помилку)
const customTheme = darkTheme({
  colors: {
    accentText: "#06b6d4",
    accentButtonBg: "#06b6d4",
    modalBg: "#020617",
    borderColor: "#1e293b",
  },
});

export default function Home() {
  const tiers = [
    { id: 1, name: 'TECHNO OWL', price: 'TIER 1', color: 'from-blue-900/60 to-cyan-900/60', border: 'border-cyan-500/50', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]', image: '/owl.jpg', icon: '🦉' },
    { id: 2, name: 'GOLDEN DRAGON', price: 'TIER 2', color: 'from-yellow-900/60 to-red-900/60', border: 'border-yellow-500/50', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]', image: null, icon: '🐉' },
    { id: 3, name: 'CYBER ANIME', price: 'TIER 3', color: 'from-purple-900/60 to-pink-900/60', border: 'border-purple-500/50', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]', image: null, icon: '🎎' }
  ];

  return (
    <ThirdwebProvider>
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden" suppressHydrationWarning>
        {/* Background Lights */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <nav className="flex justify-between items-center mb-24 border-b border-white/5 pb-8">
            <div className="text-3xl font-black tracking-[0.2em] text-white italic uppercase leading-none">
              <span className="text-cyan-500">HOOK</span> PROT <span className="text-xs align-top text-cyan-500/50 font-mono">V4</span>
            </div>
            
            <div className="border border-cyan-500/30 p-[2px] bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <ConnectButton
                client={client}
                chain={base}
                theme={customTheme}
                connectButton={{
                  label: "INITIALIZE TERMINAL",
                  style: {
                    background: "transparent",
                    color: "#22d3ee",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    fontWeight: "900",
                    borderRadius: "0px",
                    border: "none"
                  }
                }}
              />
            </div>
          </nav>

          {/* Hero Content */}
          <header className="text-center mb-32 relative">
            <div className="inline-block px-4 py-1 border border-cyan-500/20 rounded-none text-[10px] tracking-[0.5em] text-cyan-400 mb-8 uppercase bg-cyan-500/5">
              Protocol: Active • Node: Connected
            </div>
            <h1 className="text-7xl md:text-[9.5rem] font-black mb-8 tracking-tighter uppercase italic leading-none">
              Hook <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-700 filter drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">V.4</span>
            </h1>
          </header>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {tiers.map((t) => (
              <div key={t.id} className={`group relative bg-slate-900/60 backdrop-blur-xl border-t border-l ${t.border} transition-all duration-700 hover:-translate-y-4 ${t.glow}`}>
                <div className={`h-[450px] relative overflow-hidden bg-gradient-to-br ${t.color}`}>
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover grayscale-[20%] contrast-125 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-1000" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-9xl opacity-40">{t.icon}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
                </div>

                <div className="p-8 relative">
                  <h3 className="text-[10px] tracking-[0.5em] text-cyan-500/70 mb-2 uppercase font-black font-mono italic">Access Protocol</h3>
                  <p className="text-2xl font-black tracking-tight uppercase italic text-white group-hover:text-cyan-400 transition-colors">{t.name}</p>
                  
                  <div className="flex justify-between items-center pt-6 mt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Status</p>
                      <p className="text-xl font-mono font-bold text-white tracking-tighter">{t.price}</p>
                    </div>
                    <div className="h-10 w-10 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50">
                      <span className="text-cyan-500 group-hover:translate-x-1 transition-transform font-bold">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThirdwebProvider>
  );
}