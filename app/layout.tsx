import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOOK V4 | Next-Gen Liquidity Artifacts",
  description: "Automated NFT Minting Protocol on Base Network. Hold tokens and unlock unique digital artifacts.",
  openGraph: {
    title: "HOOK V4 PROTOCOL",
    description: "The future of liquidity-based NFTs on Base.",
    url: "https://v4hook.com", 
    siteName: "Hook V4 Protocol",
    images: [{ url: "/owl.jpg", width: 1200, height: 630 }],
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/owl.jpg" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
