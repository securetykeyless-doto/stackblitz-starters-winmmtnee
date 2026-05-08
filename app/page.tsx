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
  const itemsPerPage = 24;
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const allArtifacts = Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    category: i % 3 === 0 ? 'TECH' : i % 3 === 1 ? 'CHINA' : 'ANIME',
    name: i % 3 === 0 ? 'VIRTUAL_NODE' : i % 3 === 1 ? 'GOLDEN_DRAGON' : 'CYBER_ANIME',
    status: i % 5 === 0 ? 'ACTIVE' : 'LOCKED',
    tier: i % 4 === 0 ? 'T3' : 'T1',
    icon: i % 3 === 0 ? '💾' : i % 3 === 1 ? '🐉' : '🎎',
    color: i % 3 === 0 ? 'from-blue-900/40 to-cyan-900/40' : i % 3 === 1 ? 'from-yellow-900/40 to-red-900/40' : 'from-purple-900/40 to-pink-900/40'
  }));

  const filtered = activeCategory === "ALL" 
    ? allArtifacts 
    : allArtifacts.filter(item => item.category === activeCategory);

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
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          
          <nav className="flex justify-between items-center mb-20 border-b border-white/5 pb-8">
            <div className="text-3xl font-black tracking-[0.2em] text-white italic uppercase">
              <span className="text-cyan-500">HOOK</span> PROT <span className="text-xs align-top text-cyan-500/50 font-mono italic">V4.0</span>
            </div>
            
            <div className="border border-cyan-500/30 p-[2px] bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
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

          <section className="mb-32">
            <div className="inline-block px-4 py-1 border border-cyan-500/20 text-[10px] tracking-[0.4em] text-cyan-400 mb-8 uppercase bg-cyan-500/5">
              System_Protocol_Rules
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 border border-white/5 p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-xs font-mono">LOG_TYPE: RULES</div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-cyan-500 font-mono font-bold">01/</span>
                  <div className="text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white uppercase block mb-1 tracking-widest">Ownership Access</strong>
                    To interact with the Vault, users must hold $CAISHEN tokens. Higher balance unlocks higher Tier artifacts.
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-cyan-500 font-mono font-bold">02/</span>
                  <div className="text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white uppercase block mb-1 tracking-widest">Liquidity Mining</strong>
                    Staking LP tokens on Base network provides 2x speed for Artifact synchronization and rewards.
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-cyan-500 font-mono font-bold">03/</span>
                  <div className="text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white uppercase block mb-1 tracking-widest">Rare Artifacts</strong>
                    Tier 3 Artifacts are limited edition. Only 100 units per cycle will be generated.
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-cyan-500 font-mono font-bold">04/</span>
                  <div className="text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white uppercase block mb-1 tracking-widest">Burn Protocol</strong>
                    Every transaction within the ecosystem contributes to a 1% $CAISHEN burn, increasing scarcity.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <header className="text-center mb-16 relative">
            <h1 className="text-6xl md:text-[8.5rem] font-black mb-6 tracking-tighter uppercase italic leading-none">
              Artifact <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-700 filter drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">Vault</span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 mt-12 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 text-[10px] tracking-[0.3em] font-black border transition-all ${
                    activeCategory === cat 
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                    : "border-white/10 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  [ {cat} ]
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.slice(0, visibleCount).map((t) => (
              <div 
                key={t.id} 
                className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 transition-all duration-500 hover:border-cyan-500/50 overflow-hidden"
              >
                <div className={`h-[240px] relative overflow-hidden bg-gradient-to-br ${t.color}`}>
                  <div className="w-full h-full flex items-center justify-center text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-700">
                    {t.icon}
                  </div>
                </div>

                <div className="p-5 relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-mono text-cyan-500/50 uppercase">{t.category} // S_{t.id}</span>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight uppercase italic group-hover:text-cyan-400 mb-4">{t.name}</h3>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[9px] font-mono">
                    <span className="text-slate-500 uppercase italic font-bold tracking-widest">{t.tier} SECURE</span>
                    <span className="text-cyan-500">INIT →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="mt-20 flex justify-center">
              <button 
                onClick={handleLoadMore}
                className="px-12 py-4 border border-cyan-500/40 text-cyan-400 font-black text-[10px] tracking-[0.5em] uppercase hover:bg-cyan-500/10 transition-all"
              >
                Load_Data_Batch [+]
              </button>
            </div>
          )}

          <footer className="mt-40 border-t border-white/5 pt-16 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              
              <div className="space-y-4">
                <h4 className="text-[10px] tracking-[0.4em] text-cyan-500 font-black uppercase italic">Contract_Address_Base</h4>
                <div className="p-4 border border-white/5 bg-white/5 backdrop-blur-sm hover:border-cyan-500/30 transition-all">
                  <p className="text-[11px] font-mono text-slate-400 break-all leading-relaxed">
                    0xB2057F675102F8E7a2a3f9ee9B142d22E64fB6F6
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] tracking-[0.4em] text-purple-500 font-black uppercase italic">Support_Nodes</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-white/5 bg-white/5 flex justify-between items-center hover:border-purple-500/30 transition-all">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">EVM_NODE:</span>
                    <span className="text-[10px] font-mono text-slate-300 italic">WALLET_ADDRESS_PENDING</span>
                  </div>
                  <div className="p-3 border border-white/5 bg-white/5 flex justify-between items-center hover:border-purple-500/30 transition-all">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">SOL_NODE:</span>
                    <span className="text-[10px] font-mono text-slate-300 italic">SOL_ADDRESS_PENDING</span>
                  </div>
                </div>
              </div>

            </div>
          </footer>
        </div>
      </div>
    </ThirdwebProvider>
  );
}