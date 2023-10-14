"use client";

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect, useState } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { StateProvider } from "./AppState";

const { chains, publicClient } = configureChains(
  [goerli, mainnet],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
  ]
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

export const WagmiWrapper = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            theme={darkTheme({
              borderRadius: "none",
            })}
            chains={chains}
          >
            <StateProvider>{children}</StateProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      ) : null}
    </>
  );
};
