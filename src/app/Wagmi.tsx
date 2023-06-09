"use client";

import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { arbitrum, mainnet, optimism, polygon } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const WagmiWrapper = ({ children }: { children: React.ReactNode }) => (
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
  </WagmiConfig>
);
