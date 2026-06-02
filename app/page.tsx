"use client";
import { useState, useEffect } from "react";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";
import { approve, allowance } from "thirdweb/extensions/erc20";
import { claimTo, getTotalClaimedSupply, getNFT } from "thirdweb/extensions/erc721";

export default function Home() {
  const account = useActiveAccount();
  const [activeTab, setActiveTab] = useState("vault");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const ACTIVE_MINT_PRICE = 750000;
  const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";
  
  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

  const { data: currentAllowance } = useReadContract(allowance, {
    contract: tokenContract,
    owner: account?.address || "0x0000000000000000000000000000000000000000",
    spender: nftDropAddress,
  });

  const { data: totalClaimed } = useReadContract(getTotalClaimedSupply, { contract: nftContract });
  const claimedCount = totalClaimed ? Number(totalClaimed) : 0;

  const useFetchDynamicNFTs = () => {
    const currentMintId = claimedCount;
    
    const id0 = currentMintId > 1 ? currentMintId - 2 : 0;
    const id1 = currentMintId > 0 ? (currentMintId > 1 ? currentMintId - 1 : 1) : 1;
    const id2 = currentMintId > 0 ? (currentMintId > 1 ? currentMintId : 2) : 2;
    const id3 = currentMintId > 0 ? (currentMintId > 1 ? currentMintId + 1 : 3) : 3;

    const nft0 = useReadContract(getNFT, { contract: nftContract, tokenId: BigInt(id0) });
    const nft1 = useReadContract(getNFT, { contract: nftContract, tokenId: BigInt(id1) });
    const nft2 = useReadContract(getNFT, { contract: nftContract, tokenId: BigInt(id2) });
    const nft3 = useReadContract(getNFT, { contract: nftContract, tokenId: BigInt(id3) });

    return [
      { id: id0, name: nft0.data?.metadata?.name || `Artifact #${id0}`, category: id0 < currentMintId ? "Archived" : "Next", img: nft0.data?.metadata?.image || "" },
      { id: id1, name: nft1.data?.metadata?.name || `Artifact #${id1}`, category: id1 < currentMintId ? "Archived" : "Next", img: nft1.data?.metadata?.image || "" },
      { id: id2, name: nft2.data?.metadata?.name || `Artifact #${id2}`, category: id2 < currentMintId ? "Archived" : (id2 === currentMintId ? "Active Mint" : "Locked"), img: nft2.data?.metadata?.image || "" },
      { id: id3, name: nft3.data?.metadata?.name || `Artifact #${id3}`, category: id3 === currentMintId ? "Active Mint" : "Locked", img: nft3.data?.metadata?.image || "" },
    ];
  };

  const artifacts = useFetchDynamicNFTs();

  const getImageUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
    if (ipfsUrl.startsWith("ipfs://")) return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    return ipfsUrl;
  };

  const formatPriceLabel = (price: number) => {
    return price >= 1000 ? `${price / 1000}k` : price.toString();
  };

  if (!isMounted) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">LOADING SYSTEM...</div>;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 sm:mb-16 p-4 bg-white/70 border border-slate-200 backdrop-blur-xl rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 font-black tracking-widest text-sm uppercase text-slate-800 w-full sm:w-auto justify-start">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">AV</div>
          <span className="pl-2">Artifact Vault</span>
        </div>
        
        <div className="flex w-full sm:w-auto overflow-x-auto no-scrollbar gap-6 pb-2 sm:pb-0 border-b sm:border-none border-slate-100 justify-start sm:justify-center px-1">
          {["vault", "roadmap", "archive", "stats", "market"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`font-black text-[10px] uppercase tracking-widest whitespace-nowrap bg-transparent border-none cursor-pointer py-1 block transition-colors ${activeTab === tab ? "text-blue-600" : "text-slate-400"}`}
            >
              {tab === "vault" ? "Home (Mint)" : tab === "roadmap" ? "Roadmap" : tab === "archive" ? "Rarity" : tab === "stats" ? "Tokenomics" : "Market"}
            </button>
          ))}
        </div>
        
        <div className="w-full sm:w-auto flex justify-end sm:justify-center">
          <ConnectButton client={client} chain={chain} theme="light" />
        </div>
      </nav>

      <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 px-2">
        <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase italic tracking-tighter leading-none">The Artifact Vault</h1>
        <div className="bg-white border border-slate-200 rounded-[24px] p-4 sm:p-6 shadow-sm mb-6">
          <p className="text-base sm:text-lg text-slate-600 mb-4">Decentralized archive on Base network. Sequential claims powered by <span className="font-bold text-slate-900">$AVT</span>.</p>
          <p className="text-xs text-blue-700 bg-blue-50 py-2 px-4 rounded-xl font-bold uppercase tracking-wide inline-block">🎮 Gaming Utility Integration in Progress</p>
        </div>
        <div className="inline-block bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] sm:text-xs font-mono cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => { navigator.clipboard.writeText(tokenAddress); alert("Contract address copied!"); }} title="Click to copy address">
          Contract: <span className="text-blue-300">{tokenAddress}</span>
        </div>
      </div>

      {activeTab === "vault" && (
        <div className="space-y-12 sm:space-y-16">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-xl mx-auto text-center">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Live Vault Status</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 mb-3">{claimedCount} Artifacts Extracted</div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min((claimedCount / 100) * 100, 100)}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">The system tracks claims automatically directly from the Base blockchain.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artifacts.map((art) => {
              const isSold = art.id < claimedCount;
              const isNext = art.id === claimedCount;
              return (
                <div key={art.id} className={`bg-white border border-slate-200 rounded-[24px] p-4 shadow-sm transition-all duration-300 ${isSold ? 'opacity-60 grayscale-[0.2]' : isNext ? 'ring-2 ring-blue-500 shadow-xl scale-[1.01]' : 'opacity-40'}`}>
                  <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-slate-100">
                    <img src={getImageUrl(art.img)} alt={art.name} className="w-full h-full object-cover" />
                    {isSold && <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center"><span className="text-white font-black text-sm border-2 border-white px-3 py-0.5 rotate-[-10deg]">ARCHIVED</span></div>}
                  </div>
                  <h3 className="text-md font-black uppercase text-slate-800 leading-none truncate">{art.name}</h3>
                  <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 mb-4">ID #{art.id} — {art.category}</p>
                  {(() => {
                    const currentPriceTokens = isSold ? (art.id < 5 ? 750000 : 200000) : ACTIVE_MINT_PRICE;
                    const currentPriceWei = BigInt(currentPriceTokens) * BigInt(10 ** 18);
                    const needsApprove = !currentAllowance || currentAllowance < currentPriceWei;
                    return (
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                        <span className="font-mono text-xs font-bold">{formatPriceLabel(currentPriceTokens)} $AVT</span>
                        {isSold ? <span className="text-[10px] font-black text-slate-400 uppercase">Sold Out</span> : isNext ? (
                          <TransactionButton transaction={() => needsApprove ? approve({ contract: tokenContract, spender: nftDropAddress, amount: currentPriceTokens.toString() }) : claimTo({ contract: nftContract, to: account?.address || "", quantity: BigInt(1) })} onTransactionConfirmed={() => window.location.reload()} className="!font-bold !py-1.5 !px-3 !rounded-lg !text-[9px] !bg-blue-600 !text-white uppercase tracking-wider">{needsApprove ? "Approve" : "Mint"}</TransactionButton>
                        ) : <span className="text-[10px] font-black text-slate-300 uppercase">Locked</span>}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* НОВА ВКЛАДКА MARKET */}
      {activeTab === "market" && (
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 max-w-3xl mx-auto shadow-sm">
          <h2 className="text-2xl font-black uppercase italic mb-8 text-center">Market Gallery</h2>
          <div className="space-y-4">
            {Array.from({ length: claimedCount }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Artifact #{i}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Archived</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <p className="text-[9px] text-slate-400 uppercase">Original: {formatPriceLabel(750000)} AVT</p>
                  <p className="text-sm font-black text-blue-600">Current: {formatPriceLabel(750000 + i * 50000)} AVT</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "roadmap" && ( /* Вміст Roadmap з вашого коду */ )}
      {activeTab === "archive" && ( /* Вміст Archive з вашого коду */ )}
      {activeTab === "stats" && ( /* Вміст Stats з вашого коду */ )}

      <footer className="mt-24 text-center text-slate-400 text-[10px] uppercase tracking-wider border-t border-slate-200 pt-12">
        <p>Vault Protocol &copy; 2026 | Digital Archive System</p>
      </footer>
    </main>
  );
}