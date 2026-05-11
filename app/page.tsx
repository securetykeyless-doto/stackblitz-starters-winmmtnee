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

  const artifacts = [
    { id: 0, name: "Jellyfish Artifact", category: "Zone", price: 750000, img: "/0.png" },
    { id: 1, name: "Creaking Heart", category: "Minecraft", price: 750000, img: "/1.png" },
    { id: 2, name: "Vice City Hype", category: "GTA VI", price: 750000, img: "/2.png" },
    { id: 3, name: "Blue Energy Sculpture", category: "Music", price: 750000, img: "/3.png" },
    { id: 4, name: "Genesis $AVT Token", category: "Protocol", price: 750000, img: "/4.png" },
  ];

  const priceRaw = "750000";
  const priceInWei = BigInt(750000) * BigInt(10 ** 18);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress);
    alert("Contract address copied!");
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
            <span className="text-sm font-black tracking-widest uppercase text-slate-800">Artifact Vault</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://t.me/your_telegram" target="_blank" className="hidden md:block text-slate-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.51 4.35-1.78 4.84-1.79.11 0 .35.03.5.16.13.12.16.28.18.39.02.07.02.2.01.24z"/></svg>
            </a>
            <ConnectButton client={client} chain={chain} theme="light" />
          </div>
        </nav>

        {/* Main Header & Description */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-slate-900 uppercase">Vault</h1>
          
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-sm mb-10">
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-6">
              Ласкаво просимо до <span className="text-blue-600 font-bold">Artifact Vault</span> — першого децентралізованого архіву на базі мережі Base. 
              Тут кожен артефакт є унікальним NFT, доступним для викупу виключно за токени <span className="font-bold text-slate-900">$AVT</span>.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-left border-t border-slate-100 pt-8">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] block mb-2">Крок 1</span>
                <p className="text-xs font-bold text-slate-500">Придбайте $AVT на Uniswap (Base), скопіювавши контракт нижче.</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] block mb-2">Крок 2</span>
                <p className="text-xs font-bold text-slate-500">Підключіть свій гаманець та натисніть "Approve" для дозволу на транзакцію.</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] block mb-2">Крок 3</span>
                <p className="text-xs font-bold text-slate-500">Натисніть "Claim" та заберіть свій артефакт. Вони видаються суворо по черзі.</p>
              </div>
            </div>
          </div>

          {/* Token Contract Block */}
          <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Token Contract (Base):</span>
            <code className="font-mono text-sm text-blue-300 break-all">{tokenAddress}</code>
            <button 
              onClick={copyToClipboard}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
              title="Copy Address"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artifacts.map((artifact) => {
            const isSold = totalClaimed !== undefined && BigInt(artifact.id) < totalClaimed;
            const needsApprove = !currentAllowance || currentAllowance < priceInWei;

            return (
              <div key={artifact.id} className={`group bg-white border border-slate-200 rounded-[32px] p-4 transition-all ${isSold ? 'grayscale-[0.2]' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
                <div className="relative aspect-square mb-6 rounded-[24px] overflow-hidden bg-slate-100">
                  <Image src={artifact.img} alt={artifact.name} fill className={`object-cover transition-transform duration-700 ${!isSold && 'group-hover:scale-110'}`} />
                  {isSold && (
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-white font-black text-2xl tracking-tighter border-2 border-white px-4 py-1 rotate-[-12deg]">SOLD OUT</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur shadow-sm text-[10px] font-bold text-blue-600 uppercase">
                    {artifact.category}
                  </div>
                </div>

                <div className="px-2 mb-6 text-center">
                  <h3 className="text-xl font-extrabold text-slate-800 mb-1">{artifact.name}</h3>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <p className="font-mono font-bold text-slate-900">{artifact.price.toLocaleString()} $AVT</p>
                  
                  {isSold ? (
                    <button disabled className="bg-slate-200 text-slate-500 font-bold py-2 px-4 rounded-xl text-xs cursor-not-allowed uppercase">Owned</button>
                  ) : (
                    <TransactionButton
                      transaction={() => {
                        if (needsApprove) {
                          return approve({ contract: tokenContract, spender: nftDropAddress, amount: priceRaw });
                        } else {
                          return claimTo({ contract: nftContract, to: account?.address || "", quantity: BigInt(1) });
                        }
                      }}
                      onTransactionConfirmed={() => window.location.reload()}
                      className={`!font-bold !py-2 !px-4 !rounded-xl !text-xs ${needsApprove ? "!bg-orange-500" : "!bg-blue-600"} !text-white uppercase`}
                    >
                      {needsApprove ? "Approve" : "Claim"}
                    </TransactionButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Socials */}
        <footer className="mt-40 pb-12 text-center border-t border-slate-200 pt-20">
          <div className="flex justify-center gap-8 mb-10 text-slate-400">
            <a href="https://t.me/your_telegram" target="_blank" className="hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors">Telegram</a>
            <a href="https://twitter.com/your_twitter" target="_blank" className="hover:text-blue-400 font-bold text-xs uppercase tracking-widest transition-colors">Twitter (X)</a>
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Artifact Vault Protocol &copy; 2026</p>
        </footer>
      </div>
    </main>
  );
}