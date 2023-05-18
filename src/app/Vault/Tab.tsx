import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";

type TabProps = {
  children: React.ReactNode;
  active: boolean;
};

export const Tab = (props: TabProps) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, [address]);

  return (
    <div className={`flex w-full h-96 ${props.active ? "" : "hidden"}`}>
      {address && loaded ? (
        props.children
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <ConnectButton accountStatus={"address"} />
        </div>
      )}
      {address && loaded && (
        <button
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </button>
      )}
    </div>
  );
};
