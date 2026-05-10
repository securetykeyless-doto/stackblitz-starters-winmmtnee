"use client";

import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { balanceOf as getBalance } from "thirdweb/extensions/erc20";

export default function Home() {
  const account = useActiveAccount();

  // Твої контракти
  const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";

  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

  const { data: tokenBalance } = useReadContract(getBalance, {
    contract: tokenContract,
    address: account?.address || "",
  });

  return (
    <main className="relative min-h-screen bg-[#020202] text-white overflow-hidden font-sans">
      {/* Анімований фон */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <header className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase">Artifact Vault</h1>
        </div>
        <ConnectButton client={client} chain={chain} theme="dark" />
      </header>

      <div className="relative z-10 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <div className="inline-block px-4 py-1 mb-6 border border-blue-500/30 rounded-full bg-blue-500/5 text-blue-400 text-xs font-mono tracking-widest uppercase">
          Base Network Live
        </div>
        
        <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
          DIGITAL <br /> PRESERVATION
        </h2>

        <p className="max-w-xl text-zinc-400 text-lg mb-10 leading-relaxed">
          The first decentralized archive for 2025's cultural artifacts. 
          Use your <span className="text-blue-400 font-bold">$AVT</span> to unlock historical assets.
        </p>

        {account && (
          <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-2 font-bold">Your Assets</p>
            <div className="text-3xl font-mono font-black text-blue-400">
              {tokenBalance ? (Number(tokenBalance) / 1e18).toLocaleString() : "0"} <span className="text-xs">AVT</span>
            </div>
          </div>
        )}

        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
          <TransactionButton
            transaction={() => 
              claimTo({
                contract: nftContract,
                to: account?.address || "",
                quantity: 1n,
              })
            }
            onTransactionConfirmed={() => alert("Artifact Acquired.")}
            className="!relative !bg-white !text-black !font-black !py-5 !px-16 !rounded-full !text-xl !uppercase !tracking-widest !border-none !transition-transform active:!scale-95"
          >
            Claim Artifact
          </TransactionButton>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left opacity-50">
          <div className="p-6 border-l border-white/10 italic text-sm">Secure storage on Base blockchain</div>
          <div className="p-6 border-l border-white/10 italic text-sm">Limited collection of 1000+ items</div>
          <div className="p-6 border-l border-white/10 italic text-sm">Verified $AVT utility token</div>
        </div>
      </div>
    </main>
  );
}