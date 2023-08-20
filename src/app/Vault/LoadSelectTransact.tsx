/** Generic component to load NFTs, select some of them, and then make a transaction for them */

import { Nft } from "alchemy-sdk";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Spinner } from "../Spinner";
import { TransactionContext } from "../TransactionContext";
import { NftCard } from "./NftCard";

interface Props {
  contractAddress: string; // Address of the contract to load NFTs from
  title: string; // Title of the component
  checkedTokenIds: string[]; // List of tokenIds that are checked
  setCheckedTokenIds: (ids: string[]) => void; // Callback to set the checkedTokenIds
  transactNode: React.ReactNode; // Button that activates the transform
  hash?: `0x${string}`; // Txn hash of the transform action
  nftsLoadTransform?: (nfts: Nft[]) => Promise<NftWithVaultedData[]>; // Transform the NFTs after loading them
  instructions?: React.ReactNode; // Instructions for how to use this NFT load/select/transform
  noNftsMessage?: string; // Used when there are no NFTs to display after loading
  nftNamePrefix?: string; // Used in front of the NFT tokenId: FDO => "FDO #13"
  actionPrefix?: string; // used in front of the check: "Vault FDO #13" or "Unvault FDO #13"
}

export type NftWithVaultedData = Nft & {
  vaultedData?: (string | bigint)[];
};

const LoadSelectTransact = (props: Props) => {
  const { toggleButton, writeQueue } = useContext(TransactionContext);
  const { address } = useAccount();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);
  const noNftsMessage = props.noNftsMessage ?? "You have no NFTs to vault.";

  const fetchNfts = async () => {
    setLoading(true);
    const nfts = await fetch(`/api/nfts/${address}/${props.contractAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await nfts.json();

    if (props.nftsLoadTransform) {
      const transformed = await props.nftsLoadTransform(result);
      setNfts(transformed);
    } else {
      setNfts(result);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchNftsCb = useCallback(fetchNfts, [address, props.contractAddress]);

  useEffect(() => {
    fetchNftsCb();
  }, [address, fetchNftsCb]);

  const toggleCheckedTokenId = (tokenId: string) => {
    if (props.checkedTokenIds.includes(tokenId)) {
      props.setCheckedTokenIds(
        props.checkedTokenIds.filter((id) => id !== tokenId)
      );
    } else {
      props.setCheckedTokenIds([...props.checkedTokenIds, tokenId]);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col space-y-8 relative w-full border-r border-l border-b border-gray-500 p-4">
        <div className="flex flex-col">
          <h2 className="text-xl">{props.title}</h2>
          {props.instructions}
        </div>
        {loading && (
          <div className="flex w-full h-96 relative justify-center items-center">
            <div>
              Loading...
              <Spinner className="ml-2" />
            </div>
          </div>
        )}
        {!loading && !nfts.length && (
          <div className="h-full w-full flex items-center justify-center">
            {noNftsMessage}
          </div>
        )}
        <div
          className={`grid grid-cols-${
            nfts.length > 3 ? 4 : nfts.length
          } gap-4 mx-auto`}
        >
          {nfts.map((nft: NftWithVaultedData) => {
            const selected = props.checkedTokenIds.includes(nft.tokenId);
            return (
              <NftCard
                selected={selected}
                nft={nft}
                toggleCheckedTokenId={toggleCheckedTokenId}
                key={nft.tokenId + nft.title}
                nftNamePrefix={props.nftNamePrefix}
                actionPrefix={props.actionPrefix}
              />
            );
          })}
        </div>
      </div>
      {/* Adding empty divs with the correct grid col classes to make tailwind compile them */}
      <div className="grid-cols-2" />
      <div className="grid-cols-3" />
      <div className="grid-cols-4" />
      <div className="w-full h-16 relative">
        {writeQueue?.length ?? 0 > 0 ? toggleButton : null}
        <div className="flex space-x-4 absolute right-0 bottom-0">
          {props.transactNode}
        </div>
      </div>
    </div>
  );
};

export { LoadSelectTransact };
