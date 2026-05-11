"use client";

import Image from "next/image";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";
import { approve, allowance } from "thirdweb/extensions/erc20";
import { claimTo, getTotalClaimedSupply } from "thirdweb/extensions/erc721";
import { balanceOf as getBalance } from "thirdweb/extensions/erc20";

export default function Home() {
  const account = useActiveAccount();

  // CONTRACT ADDRESSES
  const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";

  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

  // READ DATA
  const { data: tokenBalance, isLoading: isBalanceLoading } = useReadContract(getBalance, {
    contract: tokenContract,
    address: account?.address || "0x0000000000000000000000000000000000000000",
  });

  const { data: currentAllowance } = useReadContract(allowance, {
    contract: tokenContract,
    owner: account?.address || "0x0000000000000000000000000000000000000000",
    spender: nftDropAddress,
  });

  const { data: totalClaimed } = useReadContract(getTotalClaimedSupply, {
    contract: nftContract,
  });

  // CONSTANTS
  const priceRaw = "750000";
  const priceInWei = BigInt(750000) * BigInt(10 ** 18);
  const claimedCount = totalClaimed ? Number(totalClaimed) : 0;

  // DYNAMIC GRID GENERATION
  const displayLimit = claimedCount + 12;
  const artifacts = Array.from({ length: displayLimit }, (_, i) => ({
    id: i,
    name: `Artifact #${String(i).padStart(4, '0')}`,
    category: i < 100 ? "Legacy" : "Sector B",
    img: `/${i}.png`,
  }));

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress);
    alert("Contract copied!");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16 p-4 bg-white/70 border border-slate-200 backdrop-blur-xl rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">AV</div>
            <span className="text-sm font-black tracking-widest uppercase text-slate-800 pl-2">Artifact Vault</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors font-bold text-[10px] uppercase tracking-widest">Telegram</a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors font-bold text-[10px] uppercase tracking-widest">Twitter</a>
            </div>
            <ConnectButton client={client} chain={chain} theme="light" />
          </div>
        </nav>

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-slate-900 uppercase italic">The Vault</h1>
          
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-sm mb-10">
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
              Decentralized archive on Base. Sequential NFT claims powered by <span className="font-bold text-slate-900">$AVT</span>.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left border-t border-slate-100 pt-10">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] block mb-3">Step 1</span>
                <p className="text-xs font-bold text-slate-500 italic">Get $AVT on Uniswap.</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] block mb-3">Step 2</span>
                <p className="text-xs font-bold text-slate-500 italic">Connect &amp; Approve $AVT.</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] block mb-3">Step 3</span>
                <p className="text-xs font-bold text-slate-500 italic">Claim next available Artifact.</p>
              </div>
            </div>
          </div>

          {/* Contract Address */}
          <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl transition-transform hover:scale-[1.02]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contract (Base):</span>
            <code className="font-mono text-sm text-blue-300 break-all">{tokenAddress}</code>
            <button onClick={copyToClipboard} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
            </button>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artifacts.map((artifact) => {
            const isSold = artifact.id < claimedCount;
            const isNext = artifact.id === claimedCount;
            const needsApprove = !currentAllowance || currentAllowance < priceInWei;

            return (
              <div 
                key={artifact.id} 
                className={`group bg-white border border-slate-200 rounded-[32px] p-4 transition-all duration-500
                  ${isSold ? 'opacity-60 grayscale-[0.5]' : 
                    isNext ? 'ring-2 ring-blue-500 shadow-2xl scale-[1.02] z-10' : 
                    'opacity-70 grayscale'}`} // <--- Набагато прозоріші заблоковані фото
              >
                <div className="relative aspect-square mb-6 rounded-[24px] overflow-hidden bg-slate-100">
                  <Image 
                    src={artifact.img} 
                    alt={artifact.name} 
                    fill 
                    className={`object-cover transition-transform duration-1000 ${isNext && 'group-hover:scale-110'}`} 
                  />
                  {isSold && (
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-white font-black text-xl tracking-tighter border-2 border-white px-4 py-1 rotate-[-12deg]">ARCHIVED</span>
                    </div>
                  )}
                </div>

                <div className="px-2 mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">{artifact.name}</h3>
                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">{artifact.category}</p>
                  </div>
                  {!isSold && !isNext && (
                    <div className="p-2 bg-slate-100 rounded-full opacity-50">
                      <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <p className="font-mono font-bold text-xs text-slate-900 tracking-tighter">750,000 $AVT</p>
                  
                  {isSold ? (
                    <span className="text-[10px] font-black text-slate-400 uppercase">Stored</span>
                  ) : isNext ? (
                    <TransactionButton
                      transaction={() => {
                        if (needsApprove) {
                          return approve({ contract: tokenContract, spender: nftDropAddress, amount: priceRaw });
                        } else {
                          return claimTo({ contract: nftContract, to: account?.address || "", quantity: BigInt(1) });
                        }
                      }}
                      onTransactionConfirmed={() => window.location.reload()}
                      className={`!font-bold !py-2 !px-4 !rounded-xl !text-[10px] ${needsApprove ? "!bg-orange-500" : "!bg-blue-600"} !text-white uppercase tracking-widest`}
                    >
                      {needsApprove ? "Approve" : "Claim"}
                    </TransactionButton>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase italic">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Footer */}
        <footer className="mt-40 pb-12 text-center border-t border-slate-200 pt-20">
          <div className="flex justify-center gap-12 mb-10 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-blue-600 transition-colors">Telegram</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
            <a href={`https://basescan.org/address/${nftDropAddress}`} target="_blank" className="hover:text-slate-900 transition-colors">Basescan</a>
          </div>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.5em]">Vault Protocol &copy; 2026 | Digital Archive System</p>
        </footer>
      </div>
    </main>
  );
}