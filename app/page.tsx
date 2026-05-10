"use client";

import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { ThirdwebProvider, ConnectButton, MediaRenderer, useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";

const CLIENT_ID = "dbfc19d8605d8312fbe6c49b5d7328e7";
const CONTRACT_ADDRESS = "0x6ef145CBBCe9201E2f6E7C127A69577701Ba5432";

const client = createThirdwebClient({ clientId: CLIENT_ID });
const chain = defineChain(8453); 

function VaultContent() {
  const { data: nfts, isLoading } = useReadContract(getNFTs, {
    contract: getContract({ client, chain, address: CONTRACT_ADDRESS }),
    start: 0,
    count: 20,
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#050505",
      color: "#00f2ff",
      fontFamily: "'Courier New', Courier, monospace",
      padding: "60px 20px",
      position: "relative",
      overflowX: "hidden"
    }}>
      {/* Кнопка підключення зверху справа */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 100
      }}>
        <ConnectButton client={client} chain={chain} />
      </div>

      <header style={{ textAlign: "center", marginBottom: "80px" }}>
        <h1 style={{ 
          fontSize: "clamp(2rem, 10vw, 4rem)", 
          fontWeight: "900",
          margin: "0", 
          letterSpacing: "8px",
          textTransform: "uppercase",
          textShadow: "0 0 10px #00f2ff, 0 0 20px #00f2ff, 0 0 40px #bc00ff",
          color: "#fff"
        }}>
          Artifact Vault
        </h1>
        <p style={{ color: "#bc00ff", fontSize: "1rem", marginTop: "10px", textTransform: "uppercase", letterSpacing: "2px" }}>
          // System Status: Online | Protocol: VPROT
        </p>
      </header>

      <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {isLoading ? (
          <p style={{ textAlign: "center", color: "#00f2ff" }}>{">"} Loading neural link...</p>
        ) : nfts && nfts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "40px"
          }}>
            {nfts.map((nft) => (
              <div key={nft.id.toString()} style={{
                backgroundColor: "rgba(0, 242, 255, 0.03)",
                borderRadius: "0px",
                padding: "20px",
                border: "1px solid #00f2ff",
                textAlign: "left",
                boxShadow: "0 0 15px rgba(0, 242, 255, 0.2)",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Ефект сітки на фоні картки */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "5px", background: "#00f2ff"
                }}></div>
                
                <div style={{ 
                  marginBottom: "20px",
                  border: "1px solid #333",
                  aspectRatio: "1/1",
                  backgroundColor: "#000"
                }}>
                  <MediaRenderer 
                    client={client} 
                    src={nft.metadata.image} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
                
                <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "10px", borderBottom: "1px solid #bc00ff", display: "inline-block" }}>
                  {nft.metadata.name}
                </h3>
                
                <p style={{ fontSize: "0.8rem", color: "#bc00ff", margin: "5px 0" }}>
                   [OBJECT_ID: {nft.id.toString()}]
                </p>
                
                {nft.metadata.description && (
                  <p style={{ fontSize: "0.85rem", color: "#00f2ff", opacity: 0.8, lineHeight: "1.4", marginTop: "10px" }}>
                    {">"} {nft.metadata.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "100px 20px", 
            border: "1px solid #333",
            color: "#333"
          }}>
             {">"} NO DATA DETECTED IN STORAGE UNIT
          </div>
        )}
      </section>

      <footer style={{ 
        textAlign: "center", 
        marginTop: "100px", 
        color: "#222", 
        fontSize: "0.7rem"
      }}>
        [VAULT_PROTOCOL_V.1.0]
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