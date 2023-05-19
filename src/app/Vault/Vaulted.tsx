"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Tab } from "./Tab";
import { useAccount } from "wagmi";
import { Nft } from "alchemy-sdk";
import Image from "next/image";

type VaultedProps = {
  active: boolean;
};

export const Vaulted = (props: VaultedProps) => {
  const { address } = useAccount();
  const [vaulted, setVaulted] = useState<Nft[]>([]);

  const fetchVaulted = async () => {
    const vaulted = await fetch(`/api/nfts/${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await vaulted.json();

    setVaulted(result);
  };

  const fetchVaultedCb = useCallback(fetchVaulted, [address]);

  useEffect(() => {
    fetchVaultedCb();
  }, [address, fetchVaultedCb]);

  return (
    <Tab active={props.active}>
      <div className="flex flex-col">
        <div className="flex">Vaulted</div>
        <div className="flex">
          {vaulted.map((nft: Nft) => {
            return (
              <div
                key={nft.tokenId}
                className="flex flex-col p-2 border rounded-xl"
              >
                <div>{nft.title}</div>
                <div>{nft.description}</div>
                <div>
                  <Image
                    src={nft.media[0].raw}
                    height={200}
                    width={200}
                    alt={nft.title}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Tab>
  );
};
