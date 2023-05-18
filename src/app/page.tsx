import { Vault } from "./Vault";
import { WagmiWrapper } from "./Wagmi";

export default function Home() {
  return (
    <WagmiWrapper>
      <main className="flex min-h-screen flex-col items-center justify-between p-12 max-w-screen-8xl mx-auto">
        <Vault />
      </main>
    </WagmiWrapper>
  );
}
