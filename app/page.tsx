"use client";

import { useState, useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { darkTheme } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "1234567890abcdef1234567890abcdef", 
});

const customTheme = darkTheme({
  colors: {
    accentText: "#06b6d4",
    accentButtonBg: "#06b6d4",
    modalBg: "#020617",
    borderColor: "#1e293b",
  },
});

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const itemsPerPage = 24; // Кількість елементів на одну порцію
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  // Імітація великого масиву (для тесту створимо 100 об'єктів автоматично)
  const allArtifacts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    category: i % 3 === 0 ? 'TECH' : i % 3 === 1 ? 'CHINA' : 'ANIME',
    name: `ARTIFACT_#${1000 + i}`,
    status: i % 5 === 0 ? 'ACTIVE' : 'LOCKED',
    tier: i % 4 === 0 ? 'T3' : 'T1',
    icon: i % 3 === 0 ? '💾' : i % 3 === 1 ? '🐉' : '🎎',
    color: i % 3 === 0 ? 'from-blue-900/40 to-cyan-900/40' : i % 3 === 1 ? 'from-yellow-900/40 to-red-900/40' : 'from-purple-900/40 to-pink-900/40'
  }));

  // Фільтрація
  const filtered = activeCategory === "ALL" 
    ? allArtifacts 
    : allArtifacts.filter(item => item.category === activeCategory);

  // Скидання кількості при зміні категорії
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [activeCategory]);

  const categories = ["ALL", "TECH", "CHINA", "ANIME"];

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + itemsPerPage);
  };

  return (
    <ThirdwebProvider>
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden" suppressHydrationWarning>
        
        {/* Background FX */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          
          {/* Header */}
          <nav className="flex justify-between items-center mb-20 border-b border-white/5 pb-8">
            <div className="text-3xl font-black tracking-[0.2em] text-white italic uppercase">
              <span className="text-cyan-500">HOOK</span> PROT <span className="text-xs align-top text-cyan-500/50 font-mono italic">V4.0</span>
            </div>
            
            <div className="border border-cyan-500/30 p-[2px] bg-cyan-500/5">
              <ConnectButton
                client={client}
                chain={base}
                theme={customTheme}
                connectButton={{
                  label: "INITIALIZE_TERMINAL",
                  style: { background: "transparent", color: "#22d3ee", fontSize: "10px", letterSpacing: "0.2em", fontWeight: "900", borderRadius: "0px", border: "none" }
                }}
              />
            </div>
          </nav>

          {/* Hero */}
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-[7rem] font-black mb-6 tracking-tighter uppercase italic leading-none">
              Vault <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-700 filter drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">Access</span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 mt-12 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 text-[10px] tracking-[0.3em] font-black transition-all border ${
                    activeCategory === cat 
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                    : "border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300"
                  }`}
                >
                  [ {cat} ]
                </button>
              ))}
            </div>
          </header>

          {/* Grid - Тільки перші visibleCount елементів */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.slice(0, visibleCount).map((t) => (
              <div 
                key={t.id} 
                className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 transition-all duration-500 hover:border-cyan-500/50 overflow-hidden"
              >
                <div className={`h-[240px] relative overflow-hidden bg-gradient-to-br ${t.color}`}>
                  <div className="w-full h-full flex items-center justify-center text-5xl grayscale group-hover:grayscale-0 transition-all duration-700">
                    {t.icon}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-mono text-cyan-500/50 uppercase">{t.category} #{t.id}</span>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase italic group-hover:text-cyan-400 transition-colors">{t.name}</h3>
                </div>

                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>

          {/* Кнопка "Показати ще" */}
          {visibleCount < filtered.length && (
            <div className="mt-20 flex justify-center">
              <button 
                onClick={handleLoadMore}
                className="group relative px-12 py-4 border border-cyan-500/40 text-cyan-400 font-black text-[10px] tracking-[0.5em] uppercase hover:bg-cyan-500/10 transition-all"
              >
                <span className="relative z-10">Load_More_Artifacts [+]</span>
                <div className="absolute inset-0 bg-cyan-500/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          )}

          <footer className="mt-40 text-center opacity-20 border-t border-white/5 pt-10">
             <p className="text-[8px] font-mono tracking-[0.5em] uppercase">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} total units</p>
          </footer>
        </div>
      </div>
    </ThirdwebProvider>
  );
}
