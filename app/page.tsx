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

  // CONTRACT ADDRESSES
  const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
  const nftDropAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";
  
  const tokenContract = getContract({ client, chain, address: tokenAddress });
  const nftContract = getContract({ client, chain, address: nftDropAddress });

  // READ CONTRACT DATA
  const { data: currentAllowance } = useReadContract(allowance, {
    contract: tokenContract,
    owner: account?.address || "0x0000000000000000000000000000000000000000",
    spender: nftDropAddress,
  });

  const { data: totalClaimed } = useReadContract(getTotalClaimedSupply, { contract: nftContract });
  
  const priceInWei = BigInt(750000) * BigInt(10 ** 18);
  
  // Кількість NFT, які вже викуплені в контракті (наприклад: 1 або 5)
  const claimedCount = totalClaimed ? Number(totalClaimed) : 0;

  // ДИНАМІЧНА ЧЕРГА NFT
  // Порожджуємо масив з 4-х карток навколо поточного стану лічильника мінту.
  // Показуємо: 2 останні викуплені, 1 поточну активну та 1 наступну заблоковану.
  const useFetchDynamicNFTs = () => {
    // Обчислюємо ID токенів, які логічно показати на екрані
    const currentMintId = claimedCount; // Актуальний ID для мінту
    
    const id0 = currentMintId > 1 ? currentMintId - 2 : 0;
    const id1 = currentMintId > 0 ? (currentMintId > 1 ? currentMintId - 1 : 1) : 1;
    const id2 = currentMintId > 0 ? (currentMintId > 1 ? currentMintId : 2) : 2;
    const id3 = currentMintId > 0 ? (currentMintId > 1 ? currentMintId + 1 : 3) : 3;

    const nft0 = useReadContract(getNFT, { contract: nftContract, tokenId: BigInt(id0) });
    const nft1 = useReadContract(getNFT, { contract: nftContract, tokenId: BigInt(id1) });
    const nft2 = useReadContract(getNFT, { contract: nftContract, tokenId: BigInt(id2) });
    const nft3 = useReadContract(getNFT, { contract: nftContract, tokenId: BigInt(id3) });

    return [
      { id: id0, name: nft0.data?.metadata?.name || `Artifact #${id0}`, category: id0 < currentMintId ? "Archived Asset" : "Next In Queue", img: nft0.data?.metadata?.image || "" },
      { id: id1, name: nft1.data?.metadata?.name || `Artifact #${id1}`, category: id1 < currentMintId ? "Archived Asset" : "Next In Queue", img: nft1.data?.metadata?.image || "" },
      { id: id2, name: nft2.data?.metadata?.name || `Artifact #${id2}`, category: id2 < currentMintId ? "Archived Asset" : (id2 === currentMintId ? "Active Mint" : "Locked Asset"), img: nft2.data?.metadata?.image || "" },
      { id: id3, name: nft3.data?.metadata?.name || `Artifact #${id3}`, category: id3 === currentMintId ? "Active Mint" : "Locked Asset", img: nft3.data?.metadata?.image || "" },
    ];
  };

  const artifacts = useFetchDynamicNFTs();

  const getImageUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
    if (ipfsUrl.startsWith("ipfs://")) {
      return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return ipfsUrl;
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">LOADING SYSTEM...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden relative z-10 max-w-7xl mx-auto px-6 py-12">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-16 p-4 bg-white/70 border border-slate-200 backdrop-blur-xl rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 font-black tracking-widest text-sm uppercase text-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">AV</div>
          <span className="pl-2">Artifact Vault</span>
        </div>
        <div className="hidden md:flex gap-6">
          {["vault", "roadmap", "archive", "stats"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`font-bold text-[10px] uppercase tracking-widest ${activeTab === tab ? "text-blue-600" : "text-slate-400"}`}>
              {tab === "vault" ? "Home (Mint)" : tab === "roadmap" ? "Roadmap" : tab === "archive" ? "Archive" : "Tokenomics"}
            </button>
          ))}
        </div>
        <ConnectButton client={client} chain={chain} theme="light" />
      </nav>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase italic tracking-tighter">The Artifact Vault</h1>
        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm mb-6">
          <p className="text-lg text-slate-600 mb-4">Decentralized archive on Base network. Sequential claims powered by <span className="font-bold text-slate-900">$AVT</span>.</p>
          <p className="text-xs text-blue-700 bg-blue-50 py-2 px-4 rounded-xl font-bold uppercase tracking-wide inline-block">🎮 Gaming Utility Integration in Progress</p>
        </div>
        <div className="inline-block bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-mono">
          Contract: <span className="text-blue-300 break-all">{tokenAddress}</span>
        </div>
      </div>

      {/* Tab 1: Mint Showroom */}
      {activeTab === "vault" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artifacts.map((art) => {
            // Динамічна перевірка статусу на основі даних з блокчейну
            const isSold = art.id < claimedCount;          // Токен вже викуплено
            const isNext = art.id === claimedCount;         // Це саме той єдиний токен, який можна мінтити зараз
            const needsApprove = !currentAllowance || currentAllowance < priceInWei;

            return (
              <div key={art.id} className={`bg-white border border-slate-200 rounded-[24px] p-4 shadow-sm transition-all duration-300 ${isSold ? 'opacity-60 grayscale-[0.2]' : isNext ? 'ring-2 ring-blue-500 shadow-xl scale-[1.01]' : 'opacity-40'}`}>
                <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-slate-100">
                  <img src={getImageUrl(art.img)} alt={art.name} className="w-full h-full object-cover" />
                  {isSold && <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center"><span className="text-white font-black text-sm border-2 border-white px-3 py-0.5 rotate-[-10deg]">ARCHIVED</span></div>}
                </div>
                <h3 className="text-md font-black uppercase text-slate-800 leading-none truncate">{art.name}</h3>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 mb-4">ID #{art.id} — {art.category}</p>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                  <span className="font-mono text-xs font-bold">750k $AVT</span>
                  {isSold ? <span className="text-[10px] font-black text-slate-400 uppercase">Sold Out</span> : isNext ? (
                    <TransactionButton
                      transaction={() => needsApprove ? approve({ contract: tokenContract, spender: nftDropAddress, amount: "750000" }) : claimTo({ contract: nftContract, to: account?.address || "", quantity: BigInt(1) })}
                      onTransactionConfirmed={() => window.location.reload()}
                      className="!font-bold !py-1.5 !px-3 !rounded-lg !text-[9px] !bg-blue-600 !text-white uppercase tracking-wider"
                    >
                      {needsApprove ? "Approve" : "Mint"}
                    </TransactionButton>
                  ) : <span className="text-[10px] font-black text-slate-300 uppercase">Locked</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Roadmap */}
      {activeTab === "roadmap" && (
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-black uppercase italic border-b pb-2">6-Month Roadmap</h2>
          <div className="border-l-2 border-blue-500 pl-4 space-y-4 text-sm">
            <div><h4 className="font-bold text-blue-600">M1: Launch &amp; Base Liquidity</h4><p className="text-slate-600">Uniswap setup and active tracking foundation.</p></div>
            <div><h4 className="font-bold text-slate-800">M2: Chart Floor Stabilization</h4><p className="text-slate-600">Liquidity locking and tactical buybacks.</p></div>
            <div><h4 className="font-bold text-slate-800">M3: Dex Verification</h4><p className="text-slate-600">DexScreener updates &amp; new custom metadata sets.</p></div>
            <div><h4 className="font-bold text-slate-800">M4: Automated Support</h4><p className="text-slate-600">Scripts to maintain constant daily volume metrics.</p></div>
            <div><h4 className="font-bold text-slate-800">M5: Gated Vaults</h4><p className="text-slate-600">Advanced tiers for early platform artifact holders.</p></div>
            <div><h4 className="font-bold text-slate-800">M6: Deflation Events</h4><p className="text-slate-600">Large burns to secure long-term circulating scarcity.</p></div>
          </div>
        </div>
      )}

      {/* Tab 3: Complete Archive */}
      {activeTab === "archive" && (
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black uppercase italic mb-2">The Historical Vault</h2>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50 text-xs font-bold text-slate-400 uppercase">Extended Tracking Interface Coming Soon</div>
        </div>
      )}

      {/* Tab 4: Tokenomics */}
      {activeTab === "stats" && (
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black uppercase italic mb-4">Tokenomics</h2>
          <div className="grid grid-cols-2 gap-4 text-left text-sm mb-4">
            <div className="bg-slate-50 p-4 rounded-xl"><span className="text-slate-400 text-xs block">Supply</span><strong>1,000,000,000 $AVT</strong></div>
            <div className="bg-slate-50 p-4 rounded-xl"><span className="text-slate-400 text-xs block">Initial AMM</span><strong>$2,500 ETH Liquidity</strong></div>
          </div>
          <div className="bg-slate-900 text-blue-300 p-3 rounded-xl font-mono text-[11px] text-left">X * Y = K // Constant Product Formula</div>
        </div>
      )}

      <footer className="mt-24 text-center text-slate-400 text-[10px] uppercase tracking-wider">
        <p>Vault Protocol &copy; 2026 | Digital Archive System</p>
      </footer>
    </main>
  );
}