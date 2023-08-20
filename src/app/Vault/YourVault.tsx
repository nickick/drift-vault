import React, { useCallback, useEffect, useState } from "react";
import { Tab } from "./Tab";
import { useAccount, usePublicClient } from "wagmi";
import { LoadSelectTransact, NftWithVaultedData } from "./LoadSelectTransact";
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
    const data = (await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
      abi: vaultedAbi,
      functionName: "getVaultedTokensCount",
      args: [address as `0x${string}`],
    })) as BigInt;

    const tokensIndexArray = [];

    for (let i = 0; i < Number(data); i++) {
      tokensIndexArray.push(i);
    }

    const nftsData = (await Promise.all(
      tokensIndexArray.map((nft) => {
        return publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "vaultedTokens",
          args: [address as `0x${string}`, nft],
        });
      }),
    )) as string[][];

    const tokenIds = nftsData.map((nftData) => nftData[1].toString());

    const nftsTransformedRes = await fetch(
      `/api/nfts/${process.env.NEXT_PUBLIC_VAULT_ADDRESS}/${process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const nftsTransformed = await nftsTransformedRes.json();
    const filteredNfts: NftWithVaultedData[] = nftsTransformed.filter(
      (nft: Nft) => tokenIds.includes(nft.tokenId),
    );

    const vaultedData = (await Promise.all(
      filteredNfts.map((nft: Nft) => {
        const data = nftsData.find(
          (datum) => datum[1].toString() === nft.tokenId,
        ) as string[];

        return publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "contractTokenIdToVaulting",
          args: [data[0], data[1]],
        });
      }),
    )) as string[][];

    vaultedData.forEach((data, i) => {
      filteredNfts[i].vaultedData = data;
    });

    return filteredNfts;
  };

  return (
    <Tab active={props.active}>
      <LoadSelectTransact
        contractAddress={process.env.NEXT_PUBLIC_SBT_ADDRESS as `0x${string}`}
        title='Your Vault'
        checkedTokenIds={checkedTokenIds}
        setCheckedTokenIds={setCheckedTokenIds}
        transactNode={<div />}
        nftsLoadTransform={nftsLoadTransform}
        hash={vaultHash}
        noNftsMessage='You have no NFTs in your vault.'
        actionPrefix='Unvault'
      />
    </Tab>
  );
};
