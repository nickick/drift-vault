import React, { useCallback, useEffect, useState } from "react";
import { Tab } from "./Tab";
import { useAccount, usePublicClient } from "wagmi";
import { LoadSelectTransact } from "./LoadSelectTransact";
import { Nft } from "alchemy-sdk";
import vaultedAbi from "../vaultedAbi.json";

type YourVaultProps = {
  active: boolean;
};

export const YourVault = (props: YourVaultProps) => {
  const [vaultHash, setVaultHash] = useState<`0x${string}`>();
  const { address } = useAccount();

  const [checkedTokenIds, setCheckedTokenIds] = useState<string[]>([]);

  const publicClient = usePublicClient();

  const nftsLoadTransform = async (nfts: Nft[]) => {
    const nftsData = (await Promise.all(
      nfts.map((nft) => {
        return publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULTED_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "vaultedTokens",
          args: [address as `0x${string}`, nft.tokenId],
        });
      })
    )) as string[][];

    const tokenIds = nftsData.map((nftData) => nftData[1].toString());

    const nftsTransformedRes = await fetch(
      `/api/nfts/${process.env.NEXT_PUBLIC_VAULTED_ADDRESS}/${process.env.NEXT_PUBLIC_CREATOR_ADDRESS}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(tokenIds);

    const nftsTransformed = await nftsTransformedRes.json();
    const filteredNfts = nftsTransformed.filter((nft: Nft) =>
      tokenIds.includes(nft.tokenId)
    );

    return filteredNfts;
  };

  return (
    <Tab active={props.active}>
      <LoadSelectTransact
        contractAddress={
          process.env.NEXT_PUBLIC_VAULTING_FROM_ADDRESS as `0x${string}`
        }
        title="Your Vault"
        checkedTokenIds={checkedTokenIds}
        setCheckedTokenIds={setCheckedTokenIds}
        transactNode={<div />}
        nftsLoadTransform={nftsLoadTransform}
        hash={vaultHash}
      />
    </Tab>
  );
};
