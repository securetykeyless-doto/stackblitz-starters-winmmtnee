"use client";

import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { ThirdwebProvider, ConnectButton, MediaRenderer, useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";

// Конфігурація
const CLIENT_ID = "dbfc19d8605d8312fbe6c49b5d7328e7";
const CONTRACT_ADDRESS = "0x6ef145CBBCe9201E2f6E7C127A69577701Ba5432";

const client = createThirdwebClient({ clientId: CLIENT_ID });
const chain = defineChain(8453); // Base Network

function VaultContent() {
  const { data: nfts, isLoading } = useReadContract(getNFTs, {
    contract: getContract({ client, chain, address: CONTRACT_ADDRESS }),
    start: 0,
    count: 20,
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      color: "#ffffff",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      padding: "40px 20px",
      position: "relative"
    }}>
      {/* Кнопка гаманця зверху справа */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 100
      }}>
        <ConnectButton client={client} chain={chain} />
      </div>

      <header style={{ textAlign: "center", marginBottom: "60px", marginTop: "40px" }}>
        <h1 style={{ 
          fontSize: "clamp(2.5rem, 8vw, 4.5rem)", 
          fontWeight: "900",
          margin: "0", 
          letterSpacing: "6px",
          textTransform: "uppercase",
          color: "#fff",
          textShadow: "0 0 15px #00d2ff, 0 0 30px #00d2ff, 0 0 45px #9d00ff"
        }}>
          Artifact Vault
        </h1>
        <p style={{ 
          color: "#00d2ff", 
          fontSize: "1.2rem", 
          marginTop: "15px", 
          letterSpacing: "3px",
          textTransform: "uppercase",
          opacity: 0.8
        }}>
          {"SECURE DIGITAL REPOSITORY"}
        </p>
      </header>

      <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {isLoading ? (
          <p style={{ textAlign: "center", color: "#00d2ff", fontSize: "1.2rem" }}>
            {"Syncing with Base network..."}
          </p>
        ) : nfts && nfts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "35px"
          }}>
            {nfts.map((nft) => (
              <div key={nft.id.toString()} style={{
                backgroundColor: "rgba(15, 15, 15, 0.9)",
                borderRadius: "24px",
                padding: "25px",
                border: "1px solid rgba(0, 210, 255, 0.3)",
                textAlign: "center",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(157, 0, 255, 0.1)",
                transition: "all 0.3s ease"
              }}>
                <div style={{ 
                  borderRadius: "16px", 
                  overflow: "hidden", 
                  marginBottom: "20px",
                  boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                  border: "1px solid #222"
                }}>
                  <MediaRenderer 
                    client={client} 
                    src={nft.metadata.image} 
                    style={{ width: "100%", height: "auto", display: "block" }} 
                  />
                </div>
                
                <h3 style={{ 
                  fontSize: "1.5rem", 
                  margin: "10px 0", 
                  color: "#fff",
                  fontWeight: "700"
                }}>
                  {nft.metadata.name}
                </h3>
                
                <span style={{ 
                  fontSize: "0.8rem", 
                  color: "#9d00ff", 
                  backgroundColor: "rgba(157, 0, 255, 0.1)",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontWeight: "bold"
                }}>
                  {"ID #" + nft.id.toString()}
                </span>
                
                {nft.metadata.description && (
                  <p style={{ 
                    fontSize: "0.95rem", 
                    color: "#aaa", 
                    marginTop: "15px",
                    lineHeight: "1.6"
                  }}>
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
            border: "2px dashed rgba(0, 210, 255, 0.2)", 
            borderRadius: "32px" 
          }}>
            <h3 style={{ color: "#333", fontSize: "1.8rem" }}>{"Vault is currently empty"}</h3>
            <p style={{ color: "#222" }}>{"Connect to contract: " + CONTRACT_ADDRESS.slice(0,6) + "..."}</p>
          </div>
        )}
      </section>

      <footer style={{ 
        textAlign: "center", 
        marginTop: "120px", 
        paddingBottom: "40px",
        color: "#333", 
        fontSize: "0.9rem",
        letterSpacing: "2px"
      }}>
        {"© 2026 ARTIFACT VAULT | BASE ECOSYSTEM"}
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