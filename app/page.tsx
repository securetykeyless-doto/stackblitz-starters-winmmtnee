"use client";

import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { ThirdwebProvider, ConnectButton, MediaRenderer, useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";

// Конфігурація
const CLIENT_ID = "dbfc19d8605d8312fbe6c49b5d7328e7";
const CONTRACT_ADDRESS = "0x6ef145CBBCe9201E2f6E7C127A69577701Ba5432";

const client = createThirdwebClient({ clientId: CLIENT_ID });
const chain = defineChain(8453); // Base

function VaultContent() {
  const { data: nfts, isLoading } = useReadContract(getNFTs, {
    contract: getContract({ client, chain, address: CONTRACT_ADDRESS }),
    start: 0,
    count: 20,
  });

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#0a0a0a",
      color: "#ffffff",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "40px 20px",
      boxSizing: "border-box"
    }}>
      <header style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ 
          fontSize: "clamp(2rem, 8vw, 3.5rem)", 
          fontWeight: "800",
          margin: "0 0 10px 0", 
          letterSpacing: "4px",
          textTransform: "uppercase",
          background: "linear-gradient(to right, #fff, #444)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Artifact Vault
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "30px" }}>
          Secure Blockchain Repository | Base Network
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ConnectButton client={client} chain={chain} />
        </div>
      </header>

      <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {isLoading ? (
          <p style={{ textAlign: "center", color: "#444" }}>Initializing secure connection...</p>
        ) : nfts && nfts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "30px"
          }}>
            {nfts.map((nft) => (
              <div key={nft.id.toString()} style={{
                backgroundColor: "#111",
                borderRadius: "20px",
                padding: "20px",
                border: "1px solid #222",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}>
                <div style={{ 
                  borderRadius: "12px", 
                  overflow: "hidden", 
                  marginBottom: "20px",
                  border: "1px solid #333",
                  aspectRatio: "1/1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#000"
                }}>
                  <MediaRenderer 
                    client={client} 
                    src={nft.metadata.image} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
                <h3 style={{ fontSize: "1.4rem", margin: "0 0 10px 0", fontWeight: "600" }}>
                  {nft.metadata.name}
                </h3>
                <div style={{ 
                  display: "inline-block", 
                  padding: "4px 12px", 
                  backgroundColor: "#222", 
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  color: "#aaa",
                  marginBottom: "15px"
                }}>
                  ID: {nft.id.toString()}
                </div>
                {nft.metadata.description && (
                  <p style={{ fontSize: "0.95rem", color: "#777", lineHeight: "1.5" }}>
                    {nft.metadata.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "100px 20px", 
            border: "1px dashed #222", 
            borderRadius: "40px" 
          }}>
            <h3 style={{ color: "#333", fontSize: "1.5rem" }}>Vault is empty. Awaiting artifacts...</h3>
          </div>
        )}
      </section>

      <footer style={{ 
        textAlign: "center", 
        marginTop: "120px", 
        paddingBottom: "40px",
        color: "#222", 
        fontSize: "0.8rem",
        letterSpacing: "1px"
      }}>
        © 2026 ARTIFACT VAULT | ENCRYPTED REPOSITORY
      </footer>
    </div>
  );
}

export default function ArtifactVault() {
  return (
    <ThirdwebProvider>
      <VaultContent />
    </ThirdwebProvider>
  );
}