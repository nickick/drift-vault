import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiWrapper } from "./Wagmi";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drift Vault",
  description: "Vault for FDO NFTs",
  metadataBase: new URL("https://vault.driftershoots.com"),
  openGraph: {
    title: "Drift Vault",
    description: "Vault for FDO NFTs",
    images: "/opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drift Vault",
    description: "Vault for FDO NFTs",
    creator: "@driftershoots",
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
