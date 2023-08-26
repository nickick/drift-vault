import { ConnectButton } from "@rainbow-me/rainbowkit";
import cx from "classnames";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";

type TabProps = {
  children: React.ReactNode;
  active: boolean;
};

export const Tab = (props: TabProps) => {
  const { address } = useAccount();
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
      className={cx({
        "flex w-full min-h-[20rem] border-t border-gray-500 relative": true,
        hidden: !props.active,
        border: !address,
      })}
    >
      {address && loaded ? (
        props.children
      ) : (
        <div className="flex w-full h-full min-h-[20rem] items-center justify-center">
          <ConnectButton accountStatus={"address"} />
        </div>
      )}
    </div>
  );
};
