"use client";

import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { ConnectButton, MediaRenderer, useActiveAccount, useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";

// Конфігурація твого проекту
const CLIENT_ID = "dbfc19d8605d8312fbe6c49b5d7328e7";
const CONTRACT_ADDRESS = "0x6ef145CBBCe9201E2f6E7C127A69577701Ba5432";

// Створюємо клієнт прямо тут, щоб не було помилок з "Module not found"
const client = createThirdwebClient({ clientId: CLIENT_ID });
const chain = defineChain(8453); // Мережа Base

export default function ArtifactVault() {
  const account = useActiveAccount();

  const contract = getContract({
    client: client,
    chain: chain,
    address: CONTRACT_ADDRESS,
  });

  // Завантажуємо перші 20 NFT з твого контракту
  const { data: nfts, isLoading } = useReadContract(getNFTs, {
    contract: contract,
    start: 0,
    count: 20,
  });

  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      color: "#ffffff",
      fontFamily: "Arial, sans-serif",
      padding: "40px 20px"
    }}>
      <header style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "10px", letterSpacing: "2px" }}>ARTIFACT VAULT</h1>
        <p style={{ color: "#888", marginBottom: "30px" }}>Secure Blockchain Repository | Base Network</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ConnectButton client={client} chain={chain} />
        </div>
      </header>

      <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {isLoading ? (
          <p style={{ textAlign: "center" }}>Завантаження артефактів...</p>
        ) : nfts && nfts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "30px"
          }}>
            {nfts.map((nft) => (
              <div key={nft.id.toString()} style={{
                backgroundColor: "#151515",
                borderRadius: "15px",
                padding: "20px",
                border: "1px solid #333",
                textAlign: "center",
                transition: "transform 0.2s"
              }}>
                <div style={{ borderRadius: "10px", overflow: "hidden", marginBottom: "15px" }}>
                  <MediaRenderer 
                    client={client} 
                    src={nft.metadata.image} 
                    style={{ width: "100%", height: "auto" }} 
                  />
                </div>
                <h3 style={{ margin: "10px 0", color: "#fff" }}>{nft.metadata.name}</h3>
                <p style={{ fontSize: "0.8rem", color: "#555" }}>ID: {nft.id.toString()}</p>
                {nft.metadata.description && (
                  <p style={{ fontSize: "0.9rem", color: "#888", marginTop: "10px" }}>
                    {nft.metadata.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "80px 20px", 
            border: "2px dashed #222", 
            borderRadius: "30px" 
          }}>
            <h3 style={{ color: "#444" }}>Сховище очікує на перший об'єкт</h3>
            <p style={{ color: "#333" }}>Дані з контракту {CONTRACT_ADDRESS.slice(0,6)}... підключено.</p>
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", marginTop: "100px", color: "#333", fontSize: "0.8rem" }}>
        © 2026 Artifact Vault | Powered by Base
      </footer>
    </main>
  );
}