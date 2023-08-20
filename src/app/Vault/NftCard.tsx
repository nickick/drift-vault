import Image from "next/image";
import { NftWithVaultedData } from "./LoadSelectTransact";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

interface Props {
  nft: NftWithVaultedData;
  selected: boolean;
  toggleCheckedTokenId: (tokenId: string) => void;
  nftNamePrefix?: string;
  actionPrefix?: string;
}
const NftCard = ({
  nft,
  selected,
  toggleCheckedTokenId,
  nftNamePrefix,
  actionPrefix,
}: Props) => {
  return (
    <div key={nft.tokenId + nft.title}>
      <label className="flex flex-col space-y-2 cursor-pointer">
        <div
          className={twMerge(
            "flex flex-col border w-56 space-y-3 hover:border-gray-100 transition-colors",
            `${selected ? "border-gray-300" : "border-gray-500"}`
          )}
        >
          <div className="h-[22rem] relative overflow-hidden flex justify-center items-center">
            {nft.rawMetadata?.animation ? (
              <video
                autoPlay
                loop
                muted
                className="object-cover h-[26rem] hover:scale-105 transition-transform"
                width="100%"
                height="100%"
              >
                <source src={nft.rawMetadata.animation} />
              </video>
            ) : (
              <Image
                src={nft.media[0]?.raw}
                fill
                alt={nft.title}
                className="w-full h-36 mx-auto hover:scale-105 transition-transform"
              />
            )}
          </div>
          <div className="px-4 pb-4 space-y-4">
            <div className="leading-snug text-lg font-bold">{nft.title}</div>
            <div className="leading-snug text-xs whitespace-pre-wrap">
              {nft.description}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            value={nft.tokenId}
            checked={selected}
            onChange={() => toggleCheckedTokenId(nft.tokenId)}
          />
          <div>
            {actionPrefix} {nftNamePrefix} #{nft.tokenId}
          </div>
        </div>
      </label>
      <VaultedDetails details={nft.vaultedData} />
    </div>
  );
};

const VaultedDetails = ({ details }: { details?: (string | bigint)[] }) => {
  if (!details) return null;

  const columns = ["Vaulted", "", "Unlocks", "", "", ""];

  return (
    <div className="flex flex-col">
      {columns.map((column, i) => {
        if (column.length === 0) {
          return null;
        }
        const detail = details[i];
        if (typeof detail === "bigint" && Number(detail) > 10000000) {
          const date = new Date(Number(detail) * 1000);
          return (
            <div key={column}>
              {column}: {format(Number(detail) * 1000, "P")}
            </div>
          );
        }

        return (
          <div key={column}>
            {column}: {detail.toString()}
          </div>
        );
      })}
    </div>
  );
};

export { NftCard };
