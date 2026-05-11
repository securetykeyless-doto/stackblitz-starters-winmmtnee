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

  const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";

  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

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

  const priceRaw = "750000";
  const priceInWei = BigInt(750000) * BigInt(10 ** 18);
  const claimedCount = totalClaimed !== undefined ? Number(totalClaimed) : 0;

  // Відображаємо всі продані + наступні 12 заблокованих
  const displayLimit = claimedCount + 12;
  const artifacts = Array.from({ length: displayLimit }, (_, i) => ({
    id: i,
    name: `Artifact #${String(i).padStart(3, '0')}`,
    category: "Archive",
    img: `/${i}.png`,
  }));

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress);
    alert("Contract copied!");
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-200 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Nav */}
        <nav className="flex justify-between items-center mb-16 p-4 bg-white/40 border border-white/60 backdrop-blur-md rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-bold text-white text-xs">AV</div>
            <span className="text-xs font-black tracking-[0.3em] uppercase text-slate-800 ml-2">Vault Protocol</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-blue-600 transition-colors">Telegram</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
            </div>
            <ConnectButton client={client} chain={chain} theme="light" />
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-8xl md:text-[120px] font-black mb-8 tracking-tighter text-slate-900 leading-none">VAULT</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-12">Digital Artifact Archive &mdash; Base Network</p>
          
          <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-white border border-slate-200 p-2 pl-6 rounded-2xl shadow-xl shadow-blue-500/5">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Token:</span>
            <code className="font-mono text-xs text-blue-600 font-bold">{tokenAddress}</code>
            <button onClick={copyToClipboard} className="bg-slate-900 text-white p-2 px-4 rounded-xl text-[10px] font-bold hover:bg-slate-800 transition-all uppercase">Copy</button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artifacts.map((artifact) => {
            const isSold = artifact.id < claimedCount;
            const isNext = artifact.id === claimedCount;
            const needsApprove = !currentAllowance || currentAllowance < priceInWei;

            return (
              <div 
                key={artifact.id} 
                className={`relative group rounded-[40px] p-4 transition-all duration-500 border
                  ${isSold ? 'bg-white/60 border-slate-200 grayscale-[0.6] opacity-70' : 
                    isNext ? 'bg-white border-blue-200 shadow-2xl shadow-blue-500/10 scale-105 z-20' : 
                    'bg-transparent border-dashed border-slate-200 opacity-20'}`} // <--- ТУТ прозорість для заблокованих
              >
                <div className="relative aspect-square mb-6 rounded-[32px] overflow-hidden bg-slate-200/50">
                  <Image 
                    src={artifact.img} 
                    alt={artifact.name} 
                    fill 
                    className={`object-cover transition-transform duration-1000 ${isNext && 'group-hover:scale-110'}`} 
                  />
                  
                  {isSold && (
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-end p-6">
                      <span className="text-white font-black text-xs tracking-widest uppercase bg-slate-900/40 px-3 py-1 rounded-full">Archived</span>
                    </div>
                  )}

                  {!isSold && !isNext && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="px-2 mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">{artifact.name}</h3>
                    <span className="text-[9px] font-bold text-slate-400">ID {artifact.id}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900/5 p-4 rounded-[24px]">
                  <p className="font-mono font-bold text-[10px] text-slate-600">750k $AVT</p>
                  
                  {isNext ? (
                    <TransactionButton
                      transaction={() => {
                        if (needsApprove) {
                          return approve({ contract: tokenContract, spender: nftDropAddress, amount: priceRaw });
                        } else {
                          return claimTo({ contract: nftContract, to: account?.address || "", quantity: BigInt(1) });
                        }
                      }}
                      onTransactionConfirmed={() => window.location.reload()}
                      className={`!min-w-[100px] !font-black !py-2 !px-4 !rounded-xl !text-[9px] ${needsApprove ? "!bg-orange-500" : "!bg-blue-600"} !text-white uppercase tracking-widest`}
                    >
                      {needsApprove ? "Approve" : "Claim"}
                    </TransactionButton>
                  ) : (
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                      {isSold ? "Owner Stored" : "Locked"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-40 pb-12 border-t border-slate-200 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">Vault Protocol &copy; 2026</p>
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              <a href={`https://basescan.org/address/${nftDropAddress}`} target="_blank" className="hover:text-slate-900 transition-colors">Basescan</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}