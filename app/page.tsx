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

  // Твої контракти
  const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";

  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

  // Читаємо баланс токенів користувача
  const { data: tokenBalance } = useReadContract(getBalance, {
    contract: tokenContract,
    address: account?.address || "",
  });

  return (
    <main className="p-8 flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white font-sans">
      <header className="fixed top-0 w-full p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-blue-500/20 z-50">
        <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          ARTIFACT VAULT
        </h1>
        <ConnectButton client={client} chain={chain} theme={"dark"} />
      </header>

      <div className="max-w-4xl w-full mt-24">
        <div className="bg-gradient-to-b from-zinc-900 to-black p-1 rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
          <div className="bg-black rounded-[22px] p-8 md:p-12 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Unlock the Digital History
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              Preserve your legacy with unique artifacts. Exchange your 
              <span className="text-blue-400 font-mono ml-2">$AVT</span> to claim exclusive NFTs.
            </p>

            {account && (
              <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5 inline-block">
                <p className="text-sm text-zinc-500 uppercase tracking-widest mb-1">Your Balance</p>
                <p className="text-2xl font-mono font-bold text-blue-400">
                  {tokenBalance ? (Number(tokenBalance) / 1e18).toLocaleString() : "0"} AVT
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <TransactionButton
                transaction={() => 
                  claimTo({
                    contract: nftContract,
                    to: account?.address || "",
                    quantity: 1n,
                  })
                }
                onTransactionConfirmed={(tx) => alert("Artifact Unlocked! Check your wallet.")}
                onError={(err) => alert("Error: " + err.message)}
                className="!bg-blue-600 hover:!bg-blue-500 !text-white !font-bold !py-4 !px-12 !rounded-full !text-xl !transition-all !shadow-lg !shadow-blue-500/20"
              >
                Claim Artifact
              </TransactionButton>
              <p className="text-xs text-zinc-600">Cost per claim: defined in your contract settings</p>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-zinc-700 text-sm">
          &copy; 2026 ARTIFACT VAULT LABS | POWERED BY BASE
        </footer>
      </div>
    </main>
  );
}