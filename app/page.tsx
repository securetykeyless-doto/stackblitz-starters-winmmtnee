"use client";

import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { balanceOf as getBalance } from "thirdweb/extensions/erc20";

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

  return (
    <main className="min-h-screen bg-[#00040d] text-white font-sans selection:bg-blue-500/30">
      {/* Той самий красивий фон з градієнтом */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#00040d] to-purple-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-20 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.6)] flex items-center justify-center font-black text-xl">V</div>
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              ARTIFACT VAULT
            </h1>
          </div>
          <ConnectButton client={client} chain={chain} theme="dark" />
        </header>

        {/* Hero Section з тим самим дизайном карти */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h2 className="text-6xl md:text-7xl font-black leading-none mb-8 tracking-tighter">
              SECURE YOUR <br />
              <span className="text-blue-500">LEGACY</span>
            </h2>
            <p className="text-zinc-400 text-xl mb-10 max-w-lg leading-relaxed">
              Unlock unique digital artifacts using your <span className="text-white font-bold">$AVT</span>. 
              The vault is open for those who hold the key.
            </p>
            
            {account && (
              <div className="mb-8 p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl inline-block backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-400 mb-2">Your Token Balance</p>
                <div className="text-4xl font-mono font-bold">
                  {tokenBalance ? (Number(tokenBalance) / 1e18).toLocaleString() : "0"} <span className="text-sm text-zinc-500">AVT</span>
                </div>
              </div>
            )}
          </div>

          {/* Картка клейму */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[40px] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-[#0a0f1a] border border-white/10 p-10 rounded-[40px] shadow-2xl backdrop-blur-3xl text-center">
              <div className="w-full aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl mb-8 flex items-center justify-center overflow-hidden border border-white/5">
                <span className="text-6xl opacity-20">💎</span>
                {/* Тут буде відображатися NFT після завантаження */}
              </div>

              <TransactionButton
                transaction={() => 
                  claimTo({
                    contract: nftContract,
                    to: account?.address || "",
                    quantity: 1n,
                  })
                }
                onTransactionConfirmed={() => alert("Success! Artifact stored in your vault.")}
                className="!w-full !bg-blue-600 hover:!bg-blue-500 !text-white !font-black !py-5 !rounded-2xl !text-xl !transition-all !shadow-[0_0_30px_rgba(37,99,235,0.3)]"
              >
                Claim Artifact
              </TransactionButton>
              <p className="mt-4 text-zinc-500 text-sm">Base Network • Verified Contract</p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-10 border-t border-white/5 text-center text-zinc-600">
          <p className="text-sm tracking-widest font-medium uppercase">Artifact Vault Labs &copy; 2026</p>
        </footer>
      </div>
    </main>
  );
}