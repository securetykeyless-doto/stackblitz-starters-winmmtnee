import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOOK V4 | Next-Gen Liquidity Artifacts",
  description: "Automated NFT Minting Protocol on Base Network. Hold tokens, provide liquidity, and unlock unique digital artifacts.",
  openGraph: {
    title: "HOOK V4 PROTOCOL",
    description: "The future of liquidity-based NFTs on Base.",
    url: "https://v4hook.com", // Сюди потім впишеш свій домен
    siteName: "Hook V4 Protocol",
    images: [
      {
        url: "/owl.jpg", // Telegram підтягне твою сову як прев'ю
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HOOK V4 PROTOCOL",
    description: "Liquidity Absorption Protocol on Base Network.",
    images: ["/owl.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Іконка для вкладки браузера */}
        <link rel="icon" href="/owl.jpg" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}