/** Generic component to load NFTs, select some of them, and then make a transaction for them */

import { Nft } from "alchemy-sdk";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Spinner } from "../Spinner";
import { TransactionContext } from "../TransactionContext";
import { NftCard } from "./NftCard";

export interface NftItemsProps {
  nfts: NftWithVaultedData[];
  checkedTokenIds: string[];
  toggleCheckedTokenId: (tokenId: string) => void;
  nftNamePrefix?: string;
  actionPrefix?: string;
}
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
  children: (props: NftItemsProps) => React.ReactNode; // Children of the component, used to render the NFTs
}

export type NftWithVaultedData = Nft & {
  vaultedData?: (string | bigint)[];
  points?: bigint;
};

const LoadSelectTransact = (props: Props) => {
  const { toggleButton, currentTxn } = useContext(TransactionContext);
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

  useEffect(() => {
    if (
      currentTxn?.name === "Vault NFTs" &&
      currentTxn?.status === "succeeded"
    ) {
      setNfts([]);
      fetchNftsCb();
    }
  }, [currentTxn, fetchNftsCb]);

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
      <div className="flex flex-col relative w-full border-r border-l border-b border-gray-500">
        {props.instructions && !loading ? (
          <div className="flex flex-col p-4">{props.instructions}</div>
        ) : null}
        {props.children({
          nfts,
          toggleCheckedTokenId,
          checkedTokenIds: props.checkedTokenIds,
          nftNamePrefix: props.nftNamePrefix,
          actionPrefix: props.actionPrefix,
        })}
        {loading && (
          <div className="flex w-full h-96 relative justify-center items-center">
            <div>
              Loading...
              <Spinner className="ml-2" />
            </div>
          </div>
        )}
        {!loading && !nfts.length && (
          <div className="h-96 mb-16 w-full flex items-center justify-center">
            <div className="text-center">
              <div>{noNftsMessage}</div>
              <div>
                You can get some at
                <a
                  href="https://opensea.io/collection/firstdayout"
                  rel="nofollow noreferrer"
                  target="_blank"
                  className="underline ml-1"
                >
                  Opensea
                </a>
                .
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Adding empty divs with the correct grid col classes to make tailwind compile them */}
      <div className="grid-cols-2 hidden" />
      <div className="grid-cols-3 hidden" />
      <div className="grid-cols-4 hidden" />
      {/* end empty divs */}
      <div className="w-full h-16 relative">
        {currentTxn ? toggleButton : null}
        <div className="flex space-x-4 absolute right-0 bottom-0">
          {props.transactNode}
        </div>
      </div>
    </div>
  );
};

export { LoadSelectTransact };
