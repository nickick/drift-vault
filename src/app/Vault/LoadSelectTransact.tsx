/** Generic component to load NFTs, select some of them, and then make a transaction for them */

import { Nft } from "alchemy-sdk";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Spinner } from "../Spinner";
import { TransactionContext } from "../TransactionContext";

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
  selectAllChecked: boolean; // Whether or not all NFTs should be selected
  setSelectAllChecked: (checked: boolean) => void; // Callback to set the selectAllChecked state
  hash?: `0x${string}`; // Txn hash of the transform action
  nftsLoadTransform?: (nfts: Nft[]) => Promise<NftWithVaultedData[]>; // Transform the NFTs after loading them
  instructions?: React.ReactNode; // Instructions for how to use this NFT load/select/transform
  noNftsMessage?: string; // Used when there are no NFTs to display after loading
  nftNamePrefix?: string; // Used in front of the NFT tokenId: FDO => "FDO #13"
  actionPrefix?: string; // used in front of the check: "Vault FDO #13" or "Unvault FDO #13"
  setLoading?: (loading: boolean) => void; // Used to set loading state in a parent component
  setAssets?: (assets: Nft[]) => void; // Used to share the loaded NFTs with a parent component
  children: (props: NftItemsProps) => React.ReactNode; // Children of the component, used to render the NFTs
}

export type NftWithVaultedData = Nft & {
  vaultedData?: (string | bigint)[];
  points?: bigint;
};

const LoadSelectTransact = (props: Props) => {
  const {
    setLoading,
    setAssets,
    nftsLoadTransform,
    contractAddress,
    selectAllChecked,
    setSelectAllChecked,
    checkedTokenIds,
    setCheckedTokenIds,
    instructions,
    nftNamePrefix,
    actionPrefix,
    children,
  } = props;
  const { currentTxn } = useContext(TransactionContext);
  const { address } = useAccount();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [nftsLoading, setNftsLoading] = useState(false);
  const noNftsMessage =
    props.noNftsMessage ??
    "Unable to find any 'First Day Out' pieces in this wallet.";

  const setLoadingState = (loading: boolean) => {
    if (setLoading) {
      setLoading(loading);
    }
    setNftsLoading(loading);
  };

  const setNftAssets = (assets: Nft[]) => {
    setNfts(assets);
    setAssets?.(assets);
  };

  const fetchNfts = async () => {
    setLoadingState(true);
    const nfts = await fetch(`/api/nfts/${address}/${contractAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await nfts.json();

    if (nftsLoadTransform) {
      const transformed = await nftsLoadTransform(result);
      setNftAssets(transformed);
    } else {
      setNftAssets(result);
    }
    setLoadingState(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchNftsCb = useCallback(fetchNfts, [address, contractAddress]);

  useEffect(() => {
    fetchNftsCb();
  }, [address, fetchNftsCb]);

  useEffect(() => {
    if (
      currentTxn?.name === "Vault NFTs" &&
      currentTxn?.status === "succeeded"
    ) {
      setNftAssets([]);
      fetchNftsCb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTxn, fetchNftsCb]);

  useEffect(() => {
    if (selectAllChecked) {
      setCheckedTokenIds(nfts.map((nft) => nft.tokenId));
    } else {
      setCheckedTokenIds([]);
    }
  }, [nfts, selectAllChecked, setCheckedTokenIds]);

  const toggleCheckedTokenId = (tokenId: string) => {
    if (checkedTokenIds.includes(tokenId)) {
      if (checkedTokenIds.length === 1 && selectAllChecked) {
        setSelectAllChecked(false);
      } else {
        setCheckedTokenIds(checkedTokenIds.filter((id) => id !== tokenId));
      }
    } else {
      if (checkedTokenIds.length === nfts.length - 1 && !selectAllChecked) {
        setSelectAllChecked(true);
      } else {
        setCheckedTokenIds([...checkedTokenIds, tokenId]);
      }
    }
  };

  return (
    <div className="flex flex-col w-full border-l border-r border-b border-[#5c5c5c] bg-[#161616]">
      <div className="flex flex-col relative w-full">
        {instructions && !nftsLoading ? (
          <div className="flex flex-col p-4">{instructions}</div>
        ) : null}
        {children({
          nfts,
          toggleCheckedTokenId,
          checkedTokenIds: checkedTokenIds,
          nftNamePrefix: nftNamePrefix,
          actionPrefix: actionPrefix,
        })}
        {nftsLoading && (
          <div className="flex w-full h-96 relative justify-center items-center">
            <div>
              Loading...
              <Spinner className="ml-2" />
            </div>
          </div>
        )}
        {!nftsLoading && !nfts.length && (
          <div className="h-96 mb-16 w-full flex items-center justify-center">
            <div className="text-center">
              <div className="hidden sm:flex">{noNftsMessage}</div>
              <div className="hidden sm:flex">
                Buy them on secondary at
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
    </div>
  );
};

export { LoadSelectTransact };
