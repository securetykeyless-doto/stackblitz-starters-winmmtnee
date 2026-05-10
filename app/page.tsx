"use client";

import { ConnectButton, MediaRenderer, useActiveAccount, useReadContract, useContract } from "thirdweb/react";
import { client } from "./client";
import { defineChain, getContract } from "thirdweb";
import { getNFTs } from "thirdweb/extensions/erc721";

// Твій новий Client ID та Адреса контракту
const CLIENT_ID = "dbfc19d8605d8312fbe6c49b5d7328e7";
const CONTRACT_ADDRESS = "0x6ef145CBBCe9201E2f6E7C127A69577701Ba5432";
const chain = defineChain(8453); // Мережа Base

export default function ArtifactVault() {
  const account = useActiveAccount();

  const contract = getContract({
    client: client,
    chain: chain,
    address: CONTRACT_ADDRESS,
  });

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
        <ConnectButton client={client} chain={chain} />
      </header>

      <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {isLoading ? (
          <p style={{ textAlign: "center" }}>Завантаження артефактів...</p>
        ) : nfts && nfts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "30px"
          }}>
            {nfts.map((nft) => (
              <div key={nft.id.toString()} style={{
                backgroundColor: "#151515",
                borderRadius: "15px",
                padding: "15px",
                border: "1px solid #333",
                textAlign: "center"
              }}>
                <MediaRenderer client={client} src={nft.metadata.image} style={{ borderRadius: "10px", width: "100%" }} />
                <h3 style={{ marginTop: "15px" }}>{nft.metadata.name}</h3>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>ID: {nft.id.toString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "50px", border: "2px dashed #333", borderRadius: "20px" }}>
            <h3>Сховище порожнє</h3>
            <p style={{ color: "#666" }}>Зайдіть у Thirdweb Dashboard, щоб завантажити перші артефакти.</p>
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", marginTop: "100px", color: "#444", fontSize: "0.9rem" }}>
        © 2026 Artifact Vault | Hook Protocol
      </footer>
    </main>
  );
}