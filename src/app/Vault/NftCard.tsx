import cx from "classnames";
import { format } from "date-fns";
import Image from "next/image";
import { NftWithVaultedData } from "./LoadSelectTransact";
import { selectedBorderClasses } from "@/utils/styling";

interface Props {
  nft: NftWithVaultedData;
  selected: boolean;
  toggleCheckedTokenId: (tokenId: string) => void;
  nftNamePrefix?: string;
  actionPrefix?: string;
}

const NftCard = ({ nft, selected, toggleCheckedTokenId }: Props) => {
  return (
    <div key={nft.tokenId + nft.title}>
      <label className="flex flex-col cursor-pointer group">
        <div
          className={cx({
            "flex flex-col border w-32 md:w-52 lg:w-54 space-y-3 p-2 bg-white":
              true,
            ...selectedBorderClasses(selected),
            "bg-white text-black": true,
          })}
        >
          <div className="md:h-52 lg:h-72 relative overflow-hidden flex justify-center items-center">
            {nft.rawMetadata?.animation ? (
              <video
                autoPlay
                loop
                muted
                className="object-cover h-[11rem] sm:h-[14rem] md:h-[22rem] group-hover:scale-105 transition-transform"
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
          <div className="space-y-4 pb-1">
            <div
              className={cx({
                "w-full flex items-center justify-start p-2 px-4": true,
                "bg-white text-black": true,
              })}
            >
              <div
                className={cx({
                  "border-r m-0 p-0 w-8 h-8 transition-colors": true,
                  "group-hover:border-gray-300": true,
                })}
              >
                <input
                  type="checkbox"
                  value={nft.tokenId}
                  checked={selected}
                  className="checkbox rounded-none w-8 h-8 border border-black"
                  onChange={() => toggleCheckedTokenId(nft.tokenId)}
                />
              </div>
              <div className="pl-3 font-bold">
                #{Number(nft.tokenId).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export { NftCard };
