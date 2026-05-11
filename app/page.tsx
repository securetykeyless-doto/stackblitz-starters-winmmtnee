"use client";

import Image from "next/image";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { balanceOf as getBalance } from "thirdweb/extensions/erc20";

export default function Home() {
  const account = useActiveAccount();

  // Твої адреси
  const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";

  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

  const { data: tokenBalance } = useReadContract(getBalance, {
    contract: tokenContract,
    address: account?.address || "",
  });

  const artifacts = [
    { id: 0, name: "Jellyfish Artifact", category: "Zone", price: 1000, img: "/0.png" },
    { id: 1, name: "Creaking Heart", category: "Minecraft", price: 2500, img: "/1.png" },
    { id: 2, name: "Vice City Hype", category: "GTA VI", price: 5000, img: "/2.png" },
    { id: 3, name: "Blue Energy Sculpture", category: "Music", price: 1500, img: "/3.png" },
    { id: 4, name: "Genesis $AVT Token", category: "Protocol", price: 10000, img: "/4.png" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Світлий градієнтний фон */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <nav className="flex justify-between items-center mb-20 p-4 bg-white/70 border border-slate-200 backdrop-blur-xl rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-200">V</div>
            <span className="text-sm font-black tracking-widest uppercase text-slate-800">Artifact Vault</span>
          </div>
          <div className="flex items-center gap-4">
            {account && (
              <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full font-mono text-sm text-blue-600 font-bold">
                {tokenBalance ? (Number(tokenBalance) / 1e18).toLocaleString() : "0"} $AVT
              </div>
            )}
            <ConnectButton client={client} chain={chain} theme="light" />
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-slate-900">
            DIGITAL <span className="text-blue-600">VAULT</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Archive the pulse of 2025. Use your $AVT to claim exclusive artifacts from gaming, music, and cinema.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="group bg-white border border-slate-200 rounded-[32px] p-4 transition-all hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1">
              <div className="relative aspect-square mb-6 rounded-[24px] overflow-hidden bg-slate-100 border border-slate-100">
                <Image 
                  src={artifact.img} 
                  alt={artifact.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur shadow-sm text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                  {artifact.category}
                </div>
              </div>

              <div className="px-2 mb-6">
                <h3 className="text-xl font-extrabold text-slate-800 mb-1">{artifact.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Base Network &bull; Artifact</p>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black">Cost</p>
                  <p className="font-mono font-bold text-slate-900">{artifact.price.toLocaleString()} <span className="text-blue-600">$AVT</span></p>
                </div>
                <TransactionButton
                  transaction={() => 
                    claimTo({
                      contract: nftContract,
                      to: account?.address || "",
                      quantity: BigInt(1),
                    })
                  }
                  onTransactionConfirmed={() => alert(`Artifact ${artifact.name} is yours!`)}
                  className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-4 !rounded-xl !text-xs !transition-all"
                >
                  Claim
                </TransactionButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}