import { goerli } from "viem/chains";
import { useNetwork, useSwitchNetwork } from "wagmi";

function NetworkSwitch() {
  const { chain } = useNetwork();
  const { chains, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const pendingChainName = chains.find(
    (chain) => chain.id === pendingChainId
  )?.name;

  return (
    <div className="flex space-x-2 items-center justify-center">
      {chain && <div>Network: {chain.name}</div>}
      {chain && chain.name !== "Goerli" && (
        <button onClick={() => switchNetwork?.(goerli.id)}>
          <span className="underline">Switch to Goerli</span>
        </button>
      )}
      {isLoading && pendingChainName && (
        <div>Switching to {pendingChainName}...</div>
      )}
    </div>
  );
}

export { NetworkSwitch };
