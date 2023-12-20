import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiWrapper } from "./Wagmi";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaulted by Driftershoots",
  description: "Vault for FirstDayOut NFTs with leaderboard and rewards",
  metadataBase: new URL("https://vault.driftershoots.com"),
  openGraph: {
    title: "Vaulted by Driftershoots",
    description: "Vault for FirstDayOut NFTs with leaderboard and rewards",
    images: [
      {
        url: "https://vault.driftershoots.com/images/opengraph-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaulted by Driftershoots",
    description: "Vault for FirstDayOut NFTs with leaderboard and rewards",
    creator: "@driftershoots",
    images: [
      {
        url: "https://vault.driftershoots.com/images/opengraph-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    creatorId: "413571172",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.className} max-h-screen bg-black`}>
        <WagmiWrapper>{children}</WagmiWrapper>
      </body>
    </html>
  );
}
