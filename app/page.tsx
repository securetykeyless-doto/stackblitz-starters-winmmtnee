"use client";

import Image from "next/image";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";
import { approve, allowance } from "thirdweb/extensions/erc20";
import { claimTo, ownerOf, getTotalClaimedSupply } from "thirdweb/extensions/erc721";
import { balanceOf as getBalance } from "thirdweb/extensions/erc20";
import { useState, useEffect } from "react";

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

  // Отримуємо кількість уже проданих NFT
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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <nav className="flex justify-between items-center mb-20 p-4 bg-white/70 border border-slate-200 backdrop-blur-xl rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">AV</div>
            <span className="text-sm font-black tracking-widest uppercase text-slate-800">Artifact Vault</span>
          </div>
          <div className="flex items-center gap-4">
            {account && (
              <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full font-mono text-sm text-blue-600 font-bold">
                {isBalanceLoading ? "..." : (Number(tokenBalance) / 1e18).toLocaleString()} $AVT
              </div>
            )}
            <ConnectButton client={client} chain={chain} theme="light" />
          </div>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-slate-900 uppercase">Vault</h1>
          <p className="text-slate-500 font-medium tracking-widest uppercase text-sm">Digital Archive 2026</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artifacts.map((artifact) => {
            // Логіка перевірки: якщо ID артефакту менше ніж кількість проданих, значить він SOLD
            const isSold = totalClaimed !== undefined && BigInt(artifact.id) < totalClaimed;
            const needsApprove = !currentAllowance || currentAllowance < priceInWei;

            return (
              <div key={artifact.id} className={`group bg-white border border-slate-200 rounded-[32px] p-4 transition-all ${isSold ? 'grayscale-[0.2]' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
                <div className="relative aspect-square mb-6 rounded-[24px] overflow-hidden bg-slate-100">
                  <Image src={artifact.img} alt={artifact.name} fill className={`object-cover transition-transform duration-700 ${!isSold && 'group-hover:scale-110'}`} />
                  
                  {isSold && (
                    /* Виправлено затемнення: зроблено набагато легшим */
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-white font-black text-2xl tracking-tighter border-2 border-white px-4 py-1 rotate-[-12deg]">SOLD OUT</span>
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur shadow-sm text-[10px] font-bold text-blue-600 uppercase">
                    {artifact.category}
                  </div>
                </div>

                <div className="px-2 mb-6">
                  <h3 className="text-xl font-extrabold text-slate-800 mb-1">{artifact.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {isSold ? "Archived in Vault" : "Available to Claim"}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Cost</p>
                    <p className="font-mono font-bold text-slate-900">{artifact.price.toLocaleString()} $AVT</p>
                  </div>
                  
                  {isSold ? (
                    <button disabled className="bg-slate-200 text-slate-500 font-bold py-2 px-4 rounded-xl text-xs cursor-not-allowed">
                      Owned
                    </button>
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
                      className={`!font-bold !py-2 !px-4 !rounded-xl !text-xs ${needsApprove ? "!bg-orange-500" : "!bg-blue-600"} !text-white`}
                    >
                      {needsApprove ? "Approve" : "Claim"}
                    </TransactionButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}