import cx from "classnames";
import { format } from "date-fns";
import Image from "next/image";
import { NftItemsProps, NftWithVaultedData } from "./LoadSelectTransact";
import { selectedBorderClasses } from "@/utils/styling";
import { numberFormatter } from "@/utils/format";

interface Props {
  nft: NftWithVaultedData;
  selected: boolean;
  toggleCheckedTokenId: (tokenId: string) => void;
  nftNamePrefix?: string;
  actionPrefix?: string;
  index: number;
}

const PointsTable = ({
  nfts,
  checkedTokenIds,
  toggleCheckedTokenId,
  nftNamePrefix,
  actionPrefix,
}: NftItemsProps) => (
  <div className="flex flex-col">
    <div className="flex py-2 text-sm text-slate-gray">
      <div className="relative px-8">
        <div className="relative w-5 h-5">
          <div className="checkbox rounded-none w-5 h-5 hidden" />
        </div>
      </div>
      <div className="w-full flex">
        <div className="w-[5.875rem] min-w-[5.875rem]" />
        <div className="w-96"></div>
        <div className="grid grid-cols-3 w-full">
          <div className="flex justify-center">Vaulted on</div>
          <div className="text-center">Unlocks on</div>
          <div className="text-center">Vaulted points</div>
        </div>
      </div>
    </div>
    {nfts.map((nft: NftWithVaultedData, index) => {
      const selected = checkedTokenIds.includes(nft.tokenId);
      return (
        <TableRow
          selected={selected}
          nft={nft}
          toggleCheckedTokenId={toggleCheckedTokenId}
          key={nft.tokenId + nft.title}
          nftNamePrefix={nftNamePrefix}
          actionPrefix={actionPrefix}
          index={index}
        />
      );
    })}
  </div>
);

const TableRow = ({ nft, selected, toggleCheckedTokenId, index }: Props) => {
  return (
    <label
      key={nft.tokenId + nft.title}
      className={cx({
        "flex items-center cursor-pointer my-1": true,
        "bg-[#303030]": index % 2 === 0,
        "bg-[#1F1F1F]": index % 2 === 1,
        ...selectedBorderClasses(selected),
      })}
    >
      <div
        className={cx({
          "flex items-center justify-center": true,
        })}
      >
        <div className="relative px-8">
          <div className="relative w-5 h-5">
            <input
              type="checkbox"
              value={nft.tokenId}
              checked={selected}
              className={cx({
                "checkbox rounded-none w-5 h-5 border border-white": true,
              })}
              onChange={() => toggleCheckedTokenId(nft.tokenId)}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div className="relative overflow-hidden border-[3px] my-1.5 border-white w-[5.875rem] min-w-[5.875rem] pb-[14%]">
          {nft.rawMetadata?.animation ? (
            <video
              autoPlay
              loop
              muted
              className="object-cover group-hover:scale-[1.7] scale-[1.4] transition-transform absolute left-0 top-0 min-w-full min-h-full w-full h-auto"
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
              className="w-full mx-auto group-hover:scale-105 transition-transform absolute left-0 top-0"
            />
          )}
        </div>
        <div className="flex items-center cursor-pointer group w-96">
          <div className="leading-snug text-lg font-bold ml-8">
            #{nft.tokenId}
          </div>
        </div>
        <VaultedDetails
          details={nft.vaultedData}
          points={numberFormatter.format(nft.points || 0)}
        />
      </div>
    </label>
  );
};

const VaultedDetails = ({
  details,
  points,
}: {
  details?: (string | bigint)[];
  points: string;
}) => {
  if (!details) return null;

  const columns = ["Vaulted", "", "Unlocks", "", "", ""];

  return (
    <div className="grid grid-cols-3 w-full">
      {columns.map((column, i) => {
        if (column.length === 0) {
          return null;
        }
        const detail = details[i];
        if (typeof detail === "bigint" && Number(detail) > 10000000) {
          return (
            <div
              key={column}
              className="text-lg flex items-center h-full justify-center"
            >
              {format(Number(detail) * 1000, "P")}
            </div>
          );
        }

        return (
          <div key={column}>
            {column}: {detail.toString()}
          </div>
        );
      })}
      <div className="flex items-center h-full justify-center">
        {points ? <div>{points}</div> : null}
      </div>
    </div>
  );
};

export { TableRow, PointsTable };
