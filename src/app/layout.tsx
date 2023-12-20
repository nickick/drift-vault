import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiWrapper } from "./Wagmi";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Drift Vault",
  description: "Vault for FDO NFTs",
  metadataBase: new URL("https://vault.driftershoots.com"),
  openGraph: {
    images: "/images/opengraph-image.png",
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
