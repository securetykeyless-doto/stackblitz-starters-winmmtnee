"use client";
import { useState, useEffect } from "react";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";
import { approve, allowance } from "thirdweb/extensions/erc20";
import { claimTo, getTotalClaimedSupply, getNFT } from "thirdweb/extensions/erc721";

// 1. Допоміжна функція для обробки зображень
const getImageUrl = (ipfsUrl: string) => {
  if (!ipfsUrl) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
  if (ipfsUrl.startsWith("ipfs://")) return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
  return ipfsUrl;
};

// 2. Компонент однієї картки NFT
function NFTCard({ id, contract, nftDropAddress, tokenContract, claimedCount, currentAllowance, ACTIVE_MINT_PRICE, formatPriceLabel }: any) {
  const { data: nft, isLoading } = useReadContract(getNFT, { contract: contract, tokenId: BigInt(id) });
  const isSold = id < claimedCount;
  const isNext = id === claimedCount;
  const currentPriceTokens = isSold ? (id < 5 ? 750000 : 200000) : ACTIVE_MINT_PRICE;
  const currentPriceWei = BigInt(currentPriceTokens) * BigInt(10 ** 18);
  const needsApprove = !currentAllowance || currentAllowance < currentPriceWei;

  return (
    <div className={`bg-white border border-slate-200 rounded-[24px] p-4 shadow-sm transition-all duration-300 ${isSold ? 'opacity-60 grayscale-[0.2]' : isNext ? 'ring-2 ring-blue-500 shadow-xl scale-[1.01]' : 'opacity-40'}`}>
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-slate-100">
        {isLoading ? <div className="w-full h-full animate-pulse bg-slate-200" /> : <img src={getImageUrl(nft?.metadata?.image || "")} alt={nft?.metadata?.name || "Artifact"} className="w-full h-full object-cover" />}
        {isSold && <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center"><span className="text-white font-black text-sm border-2 border-white px-3 py-0.5 rotate-[-10deg]">ARCHIVED</span></div>}
      </div>
      <h3 className="text-md font-black uppercase text-slate-800 leading-none truncate">{nft?.metadata?.name || `Artifact #${id}`}</h3>
      <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 mb-4">ID #{id} — {isSold ? "Archived" : isNext ? "Active Mint" : "Locked"}</p>
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
        <span className="font-mono text-xs font-bold">{formatPriceLabel(currentPriceTokens)} $AVT</span>
        {isSold ? <span className="text-[10px] font-black text-slate-400 uppercase">Sold Out</span> : isNext ? (
          <TransactionButton transaction={() => needsApprove ? approve({ contract: tokenContract, spender: nftDropAddress, amount: currentPriceTokens.toString() }) : claimTo({ contract: contract, to: "", quantity: BigInt(1) })} onTransactionConfirmed={() => window.location.reload()} className="!font-bold !py-1.5 !px-3 !rounded-lg !text-[9px] !bg-blue-600 !text-white uppercase tracking-wider">{needsApprove ? "Approve" : "Mint"}</TransactionButton>
        ) : <span className="text-[10px] font-black text-slate-300 uppercase">Locked</span>}
      </div>
    </div>
  );
}

export default function Home() {
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState("vault");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const ACTIVE_MINT_PRICE = 750000;
  const tokenAddress = "0x6dBCa99e0dCb527D133D39E44ec8Bfbe95461493";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";
  
  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

  const { data: currentAllowance } = useReadContract(allowance, { contract: tokenContract, owner: account?.address || "0x000", spender: nftDropAddress });
  const { data: totalClaimed } = useReadContract(getTotalClaimedSupply, { contract: nftContract });
  const claimedCount = totalClaimed ? Number(totalClaimed) : 0;
  
  // Генеруємо всі ID для відображення: від 0 до (claimedCount + 3 для запасу)
  const allIds = Array.from({ length: claimedCount + 4 }, (_, i) => i);
  const formatPriceLabel = (price: number) => (price >= 1000 ? `${price / 1000}k` : price.toString());

  if (!isMounted) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">LOADING SYSTEM...</div>;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* --- Навігація залишається без змін --- */}
      <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-16 p-4 bg-white/70 border border-slate-200 backdrop-blur-xl rounded-2xl shadow-sm">
         <div className="flex items-center gap-2 font-black tracking-widest text-sm uppercase text-slate-800">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">AV</div>
           <span>Artifact Vault</span>
         </div>
         <div className="flex gap-6">
           {["vault", "roadmap", "archive", "stats", "market"].map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`font-black text-[10px] uppercase tracking-widest ${activeTab === tab ? "text-blue-600" : "text-slate-400"}`}>{tab}</button>
           ))}
         </div>
         <ConnectButton client={client} chain={chain} theme="light" />
      </nav>

      {/* --- Ваша галерея тепер відображає ВСІ NFT --- */}
      {activeTab === "vault" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allIds.map((id) => (
            <NFTCard key={id} id={id} contract={nftContract} nftDropAddress={nftDropAddress} tokenContract={tokenContract} claimedCount={claimedCount} currentAllowance={currentAllowance} ACTIVE_MINT_PRICE={ACTIVE_MINT_PRICE} formatPriceLabel={formatPriceLabel} />
          ))}
        </div>
      )}
{activeTab === "market" && (
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 max-w-3xl mx-auto shadow-sm">
          <h2 className="text-2xl font-black uppercase italic mb-8 text-center">Market Gallery</h2>
          <div className="space-y-4">
            {/* Замість Array.from ми беремо масив artifacts */}
            {artifacts.filter(art => art.id < claimedCount).map((art, i) => {
              const mintPriceTokens = 750000;
              const originalUsd = 4.5; 
              const currentUsd = 45.0; 
              
              return (
                <div key={art.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
                      <img 
                        src={getImageUrl(art.img)} 
                        alt={art.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{art.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg inline-block">Archived</p>
                    </div>
                  </div>
                  
                  <div className="text-right font-mono">
                    <p className="text-[9px] text-slate-400 uppercase line-through decoration-slate-400">Minted: ${originalUsd}</p>
                    <p className="text-sm font-black text-blue-600">Value: ${currentUsd}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">({mintPriceTokens / 1000}k $AVT)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === "roadmap" && (
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b pb-4">
            <h2 className="text-2xl font-black uppercase italic text-slate-900">6-Month Roadmap</h2>
            <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full uppercase self-start sm:self-center">Target: $500k MCAP</span>
          </div>
          <div className="border-l-2 border-blue-500 pl-4 space-y-6 text-sm">
            <div><div className="flex flex-wrap items-center gap-2 mb-1"><h4 className="font-bold text-blue-600">Month 1: Token Genesis & Setup</h4><span className="text-[8px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">Done</span></div><p className="text-slate-600 text-xs">Successful token deployment on Base. Branding integration, logo upload, and deploying the core NFT smart contract with initial test mints successfully completed.</p></div>
            <div><div className="flex flex-wrap items-center gap-2 mb-1"><h4 className="font-bold text-slate-800">Month 2: Liquidity Activation</h4><span className="text-[8px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase">In Progress</span></div><p className="text-slate-600 text-xs">Adding official liquidity pool on Uniswap. Opening public mint gateway access for global marketing campaigns and early community builders support.</p></div>
            <div><div className="flex flex-wrap items-center gap-2 mb-1"><h4 className="font-bold text-slate-800">Month 3: Platform Verification</h4><span className="text-[8px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">Upcoming</span></div><p className="text-slate-600 text-xs">Full indexing and data update on DexScreener, DEXTools, and GeckoTerminal. Expanding token metadata sets and locking team LP permanently.</p></div>
            <div><div className="flex flex-wrap items-center gap-2 mb-1"><h4 className="font-bold text-slate-800">Month 4: Algorithmic Volume</h4><span className="text-[8px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">Upcoming</span></div><p className="text-slate-600 text-xs">Activation of custom back-end automated trading scripts to maintain consistent organic metrics, supporting chart performance and market trends.</p></div>
            <div><div className="flex flex-wrap items-center gap-2 mb-1"><h4 className="font-bold text-slate-800">Month 5: Special Tier Extensions</h4><span className="text-[8px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">Upcoming</span></div><p className="text-slate-600 text-xs">Introduction of exclusive high-tier artifact series accessible only to historical serial holders, intensifying secondary market value.</p></div>
            <div><div className="flex flex-wrap items-center gap-2 mb-1"><h4 className="font-bold text-slate-800">Month 6: Deflation Shock</h4><span className="text-[8px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">Upcoming</span></div><p className="text-slate-600 text-xs">Massive automated token burn event to create a supply shock. Negotiating gaming utility integrations with verified Base network Web3 partners.</p></div>
          </div>
        </div>
      )}

      {activeTab === "archive" && (
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 max-w-3xl mx-auto shadow-sm">
          <h2 className="text-2xl font-black uppercase italic mb-2 text-slate-900 text-center">Artifact Rarity & Categories</h2>
          <p className="text-slate-500 text-sm text-center mb-8">The archive processes multiple genres of digital assets. Learn about item classes and classifications.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50"><div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-blue-500" /><h4 className="font-black text-sm uppercase text-slate-800">1. Cyberpunk & Sci-Fi Relics</h4></div><p className="text-xs text-slate-600 leading-relaxed">High-tech neon components, advanced machinery blueprints, and AI archive nodes. These form the primary backbone of the initial vault expansion rows.</p></div>
            <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50"><div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-purple-500" /><h4 className="font-black text-sm uppercase text-slate-800">2. Anime & Manga Edition</h4></div><p className="text-xs text-slate-600 leading-relaxed">Stylized illustrations, iconic visual items, and fantasy gear models inspired by Japanese pop culture. Highly demanded collectors items with distinct visual traits.</p></div>
            <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50"><div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /><h4 className="font-black text-sm uppercase text-slate-800">3. Classic Retro Games</h4></div><p className="text-xs text-slate-600 leading-relaxed">Pixel-art tributes, arcade-style trophies, and early-era sandbox models designed for nostalgic enthusiasts tracking early computer history logs.</p></div>
            <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50"><div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-amber-500" /><h4 className="font-black text-sm uppercase text-slate-800">4. Abstract Audio Vaults</h4></div><p className="text-xs text-slate-600 leading-relaxed">Visualized soundwaves, cosmic synth artifacts, and synthetic beats waveforms minted as multi-sensory interactive collectible layers.</p></div>
          </div>
          <div className="mt-6 border border-dashed border-slate-200 bg-slate-50 text-center p-4 rounded-xl text-xs font-bold text-slate-400 uppercase">⚠️ Extended dynamic gallery dashboard is currently being indexed by the database.</div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
          <h2 className="text-2xl font-black uppercase italic mb-2 text-slate-900 text-center">Ecosystem Tokenomics</h2>
          <p className="text-slate-500 text-sm text-center mb-8">System metrics, hyper-deflationary allocation setups, and AMM metrics for $AVT.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><span className="text-slate-400 text-xs block font-medium">Total Token Supply</span><strong className="text-md sm:text-lg font-mono text-slate-900">1,000,000,000 $AVT</strong></div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><span className="text-slate-400 text-xs block font-medium">Initial Liquidity Pair</span><strong className="text-md sm:text-lg font-mono text-slate-900">$2,500 ETH Pool</strong></div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center bg-orange-50 border border-orange-100 p-4 rounded-xl gap-4"><div><h4 className="text-xs font-black uppercase text-orange-800">🔥 50% Token Burn Allocation</h4><p className="text-[11px] text-orange-600 mt-0.5">Half of all $AVT received from every single NFT mint is permanently destroyed out of circulation.</p></div><span className="font-mono font-bold text-sm text-orange-700 bg-white px-2.5 py-1 rounded-lg border border-orange-200">50%</span></div>
            <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-4 rounded-xl gap-4"><div><h4 className="text-xs font-black uppercase text-blue-800">🛡️ 50% Ecosystem & Support Fund</h4><p className="text-[11px] text-blue-600 mt-0.5">Remaining half goes to buybacks, automated trading support, and continuous server indexing infrastructure.</p></div><span className="font-mono font-bold text-sm text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">50%</span></div>
          </div>
          <div className="bg-slate-900 text-blue-300 p-4 rounded-xl font-mono text-[11px] text-left leading-relaxed overflow-x-auto"><div>{"// Constant Product Market Maker Formula"}</div><div>{"// X * Y = K"}</div><div className="text-slate-400 mt-2">{"// The contraction of X (Supply) due to the 50% burn directly increases asset valuation inside the automated pool."}</div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <a href="https://uniswap.org" target="_blank" rel="noopener noreferrer" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all text-center">Buy $AVT on Uniswap</a>
            <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all text-center">Chart on DexScreener</a>
          </div>
        </div>
      )}

      <footer className="mt-24 text-center text-slate-400 text-[10px] uppercase tracking-wider border-t border-slate-200 pt-12">
        <div className="flex justify-center gap-8 mb-4">
          <button onClick={() => window.open("https://t.me/Artifact_vault", "_blank", "noopener,noreferrer")} className="hover:text-blue-600 transition-colors uppercase font-bold text-[10px] tracking-wider bg-transparent border-none cursor-pointer">Telegram</button>
          <button onClick={() => window.open("https://x.com/ArtifactVault1", "_blank", "noopener,noreferrer")} className="hover:text-blue-400 transition-colors uppercase font-bold text-[10px] tracking-wider bg-transparent border-none cursor-pointer">Twitter</button>
        </div>
        <p>Vault Protocol &copy; 2026 | Digital Archive System</p>
      </footer>
    </main>
  );
}