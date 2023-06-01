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
    setLoaded(true);
  }, [address]);

  if (!loaded) {
    return (
      <div className="flex w-full h-96 relative justify-center items-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full min-h-[20rem] ${
        props.active ? "" : "hidden"
      } relative`}
    >
      {address && loaded ? (
        props.children
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <ConnectButton accountStatus={"address"} />
        </div>
      )}
      {address && loaded && (
        <button
          className="rounded-xl p-2 border border-gray-200 h-10 absolute top-2 right-2"
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
