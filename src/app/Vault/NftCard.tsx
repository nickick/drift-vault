import Image from "next/image";
import { NftWithVaultedData } from "./LoadSelectTransact";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import cx from "classnames";

const selectedBorderClasses = (selected: boolean) => {
  return {
    "group-hover:border-gray-100 transition-colors": true,
    "border-gray-300": selected,
    "border-gray-500": !selected,
  };
};
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
      <label className="flex flex-col cursor-pointer group">
        <div
          className={cx({
            "flex flex-col border md:w-52 lg:w-72 space-y-3": true,
            ...selectedBorderClasses(selected),
          })}
        >
          <div className="md:h-52 lg:h-72 relative overflow-hidden flex justify-center items-center">
            {nft.rawMetadata?.animation ? (
              <video
                autoPlay
                loop
                muted
                className="object-cover h-[32rem] group-hover:scale-105 transition-transform"
                width="100%"
                height="100%"
              >
                <source src={nft.rawMetadata.animation} />
              </video>
            ) : (
              <Image
                src={nft.media[0]?.raw}
                width={500}
                height={500}
                alt={nft.title}
                className="w-full mx-auto group-hover:scale-105 transition-transform"
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
        <div
          className={cx({
            "w-full flex items-center justify-start border-b border-l border-r":
              true,
            ...selectedBorderClasses(selected),
          })}
        >
          <div
            className={cx({
              "border-r m-0 p-0 w-8 h-8 border-gray-500 transition-colors":
                true,
              "group-hover:border-gray-300": true,
            })}
          >
            <input
              type="checkbox"
              value={nft.tokenId}
              checked={selected}
              className={cx({
                "checkbox rounded-none w-8 h-8 border-none": true,
              })}
              onChange={() => toggleCheckedTokenId(nft.tokenId)}
            />
          </div>
          <div className="pl-3">
            {actionPrefix} {nftNamePrefix} #{nft.tokenId}
          </div>
        </div>
      </label>
      <VaultedDetails details={nft.vaultedData} />
      {nft.points ? <div>Points: {nft.points?.toString()}</div> : null}
    </div>
  );
};

const VaultedDetails = ({ details }: { details?: (string | bigint)[] }) => {
  if (!details) return null;

  const columns = ["Vaulted", "", "Unlocks", "", "", ""];

  return (
    <div className="flex flex-col py-2">
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
