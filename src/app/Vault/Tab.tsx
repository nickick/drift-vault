import { ConnectButton } from "@rainbow-me/rainbowkit";
import cx from "classnames";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { Spinner } from "../Spinner";

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
      <div className="flex w-full h-96 relative justify-center items-center border-gray-500 border">
        <div>
          Loading...
          <Spinner className="ml-2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cx({
        "flex w-full min-h-[20rem] border-border-gray bg-dark-gray border-b border-l border-r border-t-0 relative mb-12":
          true,
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
