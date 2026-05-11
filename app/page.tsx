"use client";

import { createThirdwebClient, getContract } from "thirdweb";
import { ThirdwebProvider, ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { useState, useEffect } from "react";

// 1. Твій Клієнт (вкажи свій Client ID з Thirdweb Dashboard)
const client = createThirdwebClient({
  clientId: "ТВІЙ_CLIENT_ID_ТУТ", 
});

// 2. Адреси контрактів
const tokenAddress = "0x0CaA5E06e6335d2e29c6212CF851315bA2105C82";
const nftContractAddress = "0xCF0FCDBD6180245A70b2d0797386D36FC6712490";

export default function ArtifactVault() {
  const account = useActiveAccount();
  
  // Контракт токена $AVT
  const tokenContract = getContract({
    client,
    chain: base,
    address: tokenAddress,
  });

  // Читання балансу з блокчейну
  const { data: rawBalance, isLoading: isBalanceLoading, refetch: refetchBalance } = useReadContract({
    contract: tokenContract,
    method: "function balanceOf(address) view returns (uint256)",
    params: [account?.address || ""],
  });

  // Оновлюємо баланс автоматично при зміні аккаунта
  useEffect(() => {
    if (account?.address) {
      refetchBalance();
    }
  }, [account?.address, refetchBalance]);

  // Форматування балансу (Decimals 18)
  const formattedBalance = rawBalance 
    ? (Number(rawBalance) / 10 ** 18).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) 
    : "0";

  return (
    <ThirdwebProvider>
      <main style={styles.main}>
        {/* Хедер з підключенням гаманця */}
        <header style={styles.header}>
          <div style={styles.logo}>ARTIFACT VAULT</div>
          <ConnectButton 
            client={client} 
            chain={base}
            connectModal={{ size: "compact" }}
          />
        </header>

        {/* Секція балансу */}
        <section style={styles.balanceSection}>
          <div style={styles.balanceCard}>
            <p style={styles.label}>Your $AVT Balance</p>
            <h2 style={styles.amount}>
              {account ? (isBalanceLoading ? "Loading..." : `${formattedBalance} $AVT`) : "Connect Wallet"}
            </h2>
          </div>
        </section>

        {/* Секція NFT (Тут буде твій Embed від Thirdweb або кастомні картки) */}
        <section style={styles.nftGrid}>
          <iframe
            src={`https://embed.thirdweb.com/erc721/${nftContractAddress}?chain=8453&clientId=ТВІЙ_CLIENT_ID_ТУТ&theme=dark&primaryColor=blue`}
            width="100%"
            height="600px"
            style={{ border: "none", borderRadius: "15px" }}
          />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

const styles = {
  main: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "2px",
    color: "#3b82f6",
  },
  balanceSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px",
  },
  balanceCard: {
    background: "linear-gradient(145deg, #1e1e1e, #121212)",
    padding: "20px 40px",
    borderRadius: "20px",
    border: "1px solid #333",
    textAlign: "center" as const,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  label: {
    color: "#888",
    fontSize: "14px",
    marginBottom: "5px",
  },
  amount: {
    fontSize: "32px",
    margin: 0,
    color: "#fff",
  },
  nftGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
  }
};