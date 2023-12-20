import { goerli } from "viem/chains";
import { useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";

function NetworkSwitch() {
  const { chain } = useNetwork();
  const { chains, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const { disconnect } = useDisconnect();
  const environtmentChainName =
    process.env.NEXT_PUBLIC_CHAIN_NAME!.toLowerCase();
  const environmentChain = chains.find(
    (c) => c.name.toLowerCase() === environtmentChainName!
  );

  const onCorrectNetwork =
    chain && chain.name.toLowerCase() === environtmentChainName;

  return (
    <div className="flex space-x-2 items-center justify-center">
      {chain &&
        ["Goerli", "Ethereum"].includes(chain.name) &&
        onCorrectNetwork && (
          <details className="dropdown">
            <summary className="m-1 flex items-center border border-gray-200 py-2 px-3 cursor-pointer">
              Connected <Dot okay />
            </summary>
            <ul className="shadow menu dropdown-content z-[1] bg-base-100 w-32 relative left-1">
              <li
                onClick={() => {
                  disconnect();
                }}
              >
                <button
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect
                </button>
              </li>
            </ul>
          </details>
        )}
      {!onCorrectNetwork && (
        <button onClick={() => switchNetwork?.(environmentChain!.id)}>
          <div className="flex items-center border border-gray-200 py-2 px-5">
            Switch network
            <Dot okay={false} />
          </div>
        </button>
      )}
    </div>
  );
}

const Dot = (props: { okay: boolean }) => {
  const { okay } = props;
  return (
    <div
      className={`${
        okay ? "bg-green-500" : "bg-red-500"
      } ml-2 h-2 w-2 rounded-full`}
    />
  );
};

export { NetworkSwitch };
