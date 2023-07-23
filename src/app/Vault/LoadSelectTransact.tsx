/** Generic component to load NFTs, select some of them, and then make a transaction for them */

import { Nft } from "alchemy-sdk";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TransactionModal } from "../TransactionModal";

interface Props {
  contractAddress: string;
  title: string;
  checkedTokenIds: string[];
  setCheckedTokenIds: (ids: string[]) => void;
  transactNode: React.ReactNode;
  hash?: `0x${string}`;
  nftsLoadTransform?: (nfts: Nft[]) => Promise<Nft[]>;
}

const LoadSelectTransact = (props: Props) => {
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
        <div className="grid grid-cols-4 gap-4 mx-auto">
          {nfts.map((nft: Nft) => {
            return (
              <div key={nft.tokenId + nft.title}>
                <label className="flex flex-col space-y-2 cursor-pointer">
                  <div className="flex flex-col border rounded w-48 space-y-3 p-4 border-gray-500 hover:border-gray-100 transition-colors">
                    <div className="leading-snug text-xl font-bold">
                      {nft.title}
                    </div>
                    <div className="leading-snug font-xs">
                      {nft.description}
                    </div>
                    <div>
                      <Image
                        src={nft.media[0]?.raw}
                        height={200}
                        width={200}
                        alt={nft.title}
                        className="rounded w-full h-36 mx-auto"
                      />
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center space-x-2">
                    <input
                      type="checkbox"
                      value={nft.tokenId}
                      checked={props.checkedTokenIds.includes(nft.tokenId)}
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
      <TransactionModal hash={props.hash} />
      <div className="flex space-x-2 absolute right-0 bottom-0">
        {props.transactNode}
      </div>
    </>
  );
};

export { LoadSelectTransact };
