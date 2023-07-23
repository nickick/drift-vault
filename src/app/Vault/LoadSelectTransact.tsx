/** Generic component to load NFTs, select some of them, and then make a transaction for them */

import { Nft } from "alchemy-sdk";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TransactionModal } from "../TransactionModal";
import { NftCard } from "./NftCard";
import { TransactionContext } from "../TransactionContext";
import { Spinner } from "../Spinner";

interface Props {
  contractAddress: string;
  title: string;
  checkedTokenIds: string[];
  setCheckedTokenIds: (ids: string[]) => void;
  transactNode: React.ReactNode;
  hash?: `0x${string}`;
  nftsLoadTransform?: (nfts: Nft[]) => Promise<NftWithVaultedData[]>;
}

export type NftWithVaultedData = Nft & {
  vaultedData?: (string | bigint)[];
};

const LoadSelectTransact = (props: Props) => {
  const { hash, toggleButton } = useContext(TransactionContext);
  const { address } = useAccount();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const fetchNfts = async () => {
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
    <>
      <div className="flex flex-col p-2 pb-14 space-y-8 relative w-full">
        <div className="flex">{props.title}</div>
        {nfts.length < 1 && (
          <div className="flex w-full h-96 relative justify-center items-center">
            <div>
              Loading...
              <Spinner className="ml-2" />
            </div>
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 mx-auto">
          {nfts.map((nft: NftWithVaultedData) => {
            const selected = props.checkedTokenIds.includes(nft.tokenId);
            return (
              <NftCard
                selected={selected}
                nft={nft}
                toggleCheckedTokenId={toggleCheckedTokenId}
                key={nft.tokenId + nft.title}
              />
            );
          })}
        </div>
      </div>
      {hash && toggleButton}
      <div className="flex space-x-2 absolute right-0 bottom-0">
        {props.transactNode}
      </div>
    </>
  );
};

export { LoadSelectTransact };
