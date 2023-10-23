import { ConnectButton } from "@rainbow-me/rainbowkit";
import cx from "classnames";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { Spinner } from "../Spinner";

type TabProps = {
  children: React.ReactNode;
  walletRequired: boolean;
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
      {(address || !props.walletRequired) && loaded ? (
        props.children
      ) : (
        <>
          <div className="hidden sm:flex w-full h-full min-h-[20rem] items-center justify-center bg-dark-gray">
            <ConnectButton accountStatus={"address"} />
          </div>
          <div className="sm:hidden flex flex-col h-96 mb-16 w-full items-center justify-center">
            <p className="mb-4 mx-2">
              Vaulted is designed for desktop browser use only.
            </p>
            <p className="mx-2">Please visit in a desktop Chrome Browser.</p>
          </div>
        </>
      )}
    </div>
  );
};
