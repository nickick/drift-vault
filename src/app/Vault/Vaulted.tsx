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

  const [checkedTokenIds, setCheckedTokenIds] = useState<string[]>([]);

  const toggleCheckedTokenId = (tokenId: string) => {
    if (checkedTokenIds.includes(tokenId)) {
      setCheckedTokenIds(checkedTokenIds.filter((id) => id !== tokenId));
    } else {
      setCheckedTokenIds([...checkedTokenIds, tokenId]);
    }
  };

  enum vaultTimeOptions {
    "1Year" = "1 Year",
    "5Year" = "5 Years",
    "10Years" = "10 Years",
  }

  const [vaultTime, setVaultTime] = useState<vaultTimeOptions>(
    vaultTimeOptions["1Year"]
  );

  return (
    <Tab active={props.active}>
      <div className="flex flex-col p-2 space-y-2 relative">
        <div className="flex">Vaulted</div>
        <div className="flex">
          {vaulted.map((nft: Nft) => {
            return (
              <div key={nft.tokenId + nft.title}>
                <label className="flex flex-col space-y-2 cursor-pointer">
                  <div className="flex flex-col border rounded-xl w-48 space-y-3 p-4 hover:border-gray-500 transition-colors">
                    <div className="leading-snug text-xl font-bold">
                      {nft.title}
                    </div>
                    <div className="leading-snug font-xs">
                      {nft.description}
                    </div>
                    <div>
                      <Image
                        src={nft.media[0].raw}
                        height={200}
                        width={200}
                        alt={nft.title}
                        className="rounded-xl w-full h-36 mx-auto"
                      />
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center space-x-2">
                    <input
                      type="checkbox"
                      value={nft.tokenId}
                      checked={checkedTokenIds.includes(nft.tokenId)}
                      onChange={() => toggleCheckedTokenId(nft.tokenId)}
                    />
                    <div>#{nft.tokenId}</div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex space-x-2 absolute right-0 bottom-0">
        <select
          value={vaultTime}
          onChange={(e) => {
            setVaultTime(e.target.value as vaultTimeOptions);
          }}
          className="rounded-xl p-2 border border-gray-200 h-10 w-48"
        >
          {Object.values(vaultTimeOptions).map((option) => {
            return <option key={option}>{option}</option>;
          })}
        </select>
        <div>
          <button
            className="rounded-xl p-2 border border-gray-200 h-10 w-48 cursor-pointer hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:hover:bg-red-900"
            disabled={checkedTokenIds.length === 0}
          >
            Vault
          </button>
        </div>
      </div>
    </Tab>
  );
};
