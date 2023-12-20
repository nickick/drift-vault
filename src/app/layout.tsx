import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiWrapper } from "./Wagmi";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaulted by Driftershoots",
  description: "Vault for FDO NFTs",
  metadataBase: new URL("https://vault.driftershoots.com"),
  openGraph: {
    title: "Vaulted by Driftershoots",
    description: "Vault for FDO NFTs",
    images: "/images/opengraph-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaulted by Driftershoots",
    description: "Vault for FDO NFTs",
    creator: "@driftershoots",
    images: "/images/opengraph-image.jpg",
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
