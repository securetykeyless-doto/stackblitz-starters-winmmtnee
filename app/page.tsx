"use client";

import Image from "next/image";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { balanceOf as getBalance } from "thirdweb/extensions/erc20";
import { useState } from "react";

export default function Home() {
  const account = useActiveAccount();

  // Твої реальні адреси
  const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";

  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

  const { data: tokenBalance } = useReadContract(getBalance, {
    contract: tokenContract,
    address: account?.address || "",
  });

  // Локальний масив для відображення артефактів (поки вони не завантажені на контракт)
  const artifacts = [
    { id: 0, name: "Jellyfish Artifact", category: "Zone", price: 1000, img: "/0.png" },
    { id: 1, name: "Creaking Heart", category: "Minecraft", price: 2500, img: "/1.png" },
    { id: 2, name: "Vice City Hype", category: "GTA VI", price: 5000, img: "/2.png" },
    { id: 3, name: "Blue Energy Sculpture", category: "Music", price: 1500, img: "/3.png" },
    { id: 4, name: "Genesis $AVT Token", category: "Protocol", price: 10000, img: "/4.png" },
  ];

  return (
    <main className="min-h-screen bg-[#02040a] text-zinc-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16 p-4 bg-white/[0.01] border border-white/5 backdrop-blur-3xl rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white">V</div>
            <span className="text-sm font-bold tracking-[0.3em] uppercase opacity-80">Artifact Vault</span>
          </div>
          <div className="flex items-center gap-4">
            {account && (
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full font-mono text-sm text-blue-400">
                {tokenBalance ? (Number(tokenBalance) / 1e18).toLocaleString() : "0"} $AVT
              </div>
            )}
            <ConnectButton client={client} chain={chain} theme="dark" />
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-10 mb-24">
          <h2 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.8] text-white">
            UNVAULT <br /><span className="text-blue-500">HISTORY</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl mb-12 max-w-xl leading-relaxed">
            The premium decentralized archive for 2025's cultural artifacts. 
            Exchange your <span className="text-white font-semibold">$AVT</span> to claim immutable assets.
          </p>
        </div>

        {/* Artifacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="relative group p-1 bg-gradient-to-b from-white/5 to-transparent rounded-3xl transition-all hover:scale-[1.02] hover:from-blue-500/20 shadow-xl">
              <div className="bg-[#05070f] p-6 rounded-[22px] border border-white/5 h-full flex flex-col">
                <div className="relative aspect-[4/5] mb-6 rounded-xl bg-zinc-900/50 border border-white/5 flex items-center justify-center group overflow-hidden">
                  <Image 
                    src={artifact.img} 
                    alt={artifact.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    {artifact.category}
                  </div>
                </div>

                <div className="flex-grow mb-6">
                  <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{artifact.name}</h3>
                  <p className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">Base ERC-721 Drop</p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-sm text-zinc-400">
                    {artifact.price.toLocaleString()} <span className="text-blue-500">$AVT</span>
                  </p>
                  <TransactionButton
                    transaction={() => 
                      claimTo({
                        contract: nftContract,
                        to: account?.address || "",
                        quantity: BigInt(1),
                      })
                    }
                    onTransactionConfirmed={() => alert(`Success! ${artifact.name} Claimed.`)}
                    className="!bg-white hover:!bg-zinc-200 !text-black !font-black !py-2.5 !px-5 !rounded-lg !text-xs !uppercase !tracking-widest !transition-all active:!scale-95 !shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
                  >
                    Claim
                  </TransactionButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-10 border-t border-white/[0.03] text-center text-[10px] text-zinc-700 font-bold uppercase tracking-[0.4em]">
          Artifact Vault Labs &copy; 2026 | Secured by Base L2
        </footer>
      </div>
    </main>
  );
}