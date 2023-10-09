import React, { useCallback, useEffect, useState } from "react";
import { Tab } from "./Tab";
import { useAccount, usePublicClient } from "wagmi";
import { LoadSelectTransact, NftWithVaultedData } from "./LoadSelectTransact";
import { Nft } from "alchemy-sdk";
import vaultedAbi from "../vaultedAbi.json";
import { NftCard } from "./NftCard";
import { PointsTable } from "./PointsTable";

type YourVaultProps = {
  active: boolean;
};

export const YourVault = (props: YourVaultProps) => {
  const [vaultHash, setVaultHash] = useState<`0x${string}`>();
  const { address } = useAccount();

  const [checkedTokenIds, setCheckedTokenIds] = useState<string[]>([]);

  const publicClient = usePublicClient();

  const nftsLoadTransform = async (nfts: Nft[]) => {
    // get vaulted tokens count to iterate through for vaulted token data
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

    // Iterate through the count to get the vaulted token data
    const nftsData = (await Promise.all(
      tokensIndexArray.map((nft) => {
        return publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "vaultedTokens",
          args: [address as `0x${string}`, nft],
        });
      })
    )) as string[][]; // [contractAddress (FDO / Vaulting contract), tokenId as bigint][]

    // convert tokenIds from bigint into strings
    const tokenIds = nftsData.map((nftData) => nftData[1].toString());

    // get NFTs from the Vaulting FDO contract owned by the Vault contract
    const nftsTransformedRes = await fetch(
      `/api/nfts/${process.env.NEXT_PUBLIC_VAULT_ADDRESS}/${process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const nftsTransformed = await nftsTransformedRes.json();
    const filteredNfts: NftWithVaultedData[] = nftsTransformed.filter(
      (nft: Nft) => tokenIds.includes(nft.tokenId)
    );

    const vaultedData = (await Promise.all(
      filteredNfts.map((nft: Nft) => {
        const data = nftsData.find(
          (datum) => datum[1].toString() === nft.tokenId
        ) as string[];

        return publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "contractTokenIdToVaulting",
          args: [data[0], data[1]],
        });
      })
    )) as string[][];

    vaultedData.forEach((data, i) => {
      filteredNfts[i].vaultedData = data;
    });

    const pointsData = (await Promise.all(
      filteredNfts.map(async (nft: Nft) => {
        const points = await publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "calculatePoints",
          args: [nft.tokenId, nft.contract.address],
        });
        return {
          tokenId: nft.tokenId,
          points,
        };
      })
    )) as { tokenId: string; points: bigint }[];

    pointsData.forEach((data, i) => {
      const nft = filteredNfts.find((nft) => nft.tokenId === data.tokenId);
      if (nft) {
        nft.points = data.points;
      }
    });

    return filteredNfts;
  };

  return (
    <Tab active={props.active}>
      <LoadSelectTransact
        contractAddress={process.env.NEXT_PUBLIC_SBT_ADDRESS as `0x${string}`}
        title="Your Vault"
        checkedTokenIds={checkedTokenIds}
        setCheckedTokenIds={setCheckedTokenIds}
        transactNode={<div />}
        nftsLoadTransform={nftsLoadTransform}
        hash={vaultHash}
        noNftsMessage="You have no NFTs in your vault."
        actionPrefix="Unvault"
      >
        {(props) => {
          return <PointsTable {...props} />;
        }}
      </LoadSelectTransact>
    </Tab>
  );
};
