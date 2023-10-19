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
            "flex flex-col border w-32 md:w-52 lg:w-54 space p-1.5 pb-0 bg-white bg-opacity-90 text-black":
              true,
            ...selectedBorderClasses(selected),
          })}
        >
          <div className="relative overflow-hidden flex justify-center items-center w-full pb-[125%]">
            {nft.rawMetadata?.animation ? (
              <video
                autoPlay
                loop
                muted
                className="group-hover:scale-[1.7] scale-[1.5] transition-transform absolute left-0 top-0 min-w-full min-h-full w-auto h-auto overflow-hidden bg-cover object-cover"
              >
                <source src={nft.rawMetadata.animation} />
              </video>
            ) : (
              <Image
                src={nft.media[0]?.raw}
                width={500}
                height={500}
                alt={nft.title}
                className="absolute inset-0 object-cover group-hover:scale-105 transition-transform"
              />
            )}
          </div>
          <div className="">
            <div
              className={cx({
                "w-full flex items-center justify-start px-[0.875rem] pt-[1rem] pb-[0.875rem] text-black bg-opacity-90":
                  true,
              })}
            >
              <div
                className={cx({
                  "border-r m-0 p-0 w-5 h-5 transition-colors": true,
                  "group-hover:border-gray-300": true,
                })}
              >
                <input
                  type="checkbox"
                  value={nft.tokenId}
                  checked={selected}
                  className="checkbox rounded-none w-5 h-5 border border-black"
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
