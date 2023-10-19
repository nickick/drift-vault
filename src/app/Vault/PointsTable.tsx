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
    <div className="col-span-7 grid grid-cols-7 py-2 text-sm text-slate-gray">
      <div />
      <div />
      <div className="col-span-2 ml-8"></div>
      <div className="text-center">Vaulted on</div>
      <div className="text-center">Unlocks on</div>
      <div className="text-center">Vaulted points</div>
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
        "grid grid-cols-7 items-center cursor-pointer my-1": true,
        "bg-[#303030]": index % 2 === 0,
        "bg-[#1F1F1F]": index % 2 === 1,
        ...selectedBorderClasses(selected),
      })}
    >
      <div
        className={cx({
          "w-full flex items-center justify-center": true,
        })}
      >
        <div className="relative">
          <div className="relative m-0 p-0 w-6 h-6">
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
      <div className="col-span-1 relative overflow-hidden flex justify-center items-center border-2 my-1.5 border-white w-[5.875rem] pb-[100%]">
        {nft.rawMetadata?.animation ? (
          <video
            autoPlay
            loop
            muted
            className="object-cover group-hover:scale-[1.7] scale-[1.4] transition-transform absolute left-0 top-0 min-w-full min-h-full w-auto h-auto overflow-hidden bg-cover"
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
      <div className="col-span-2 flex items-center cursor-pointer group w-full">
        <div className="leading-snug text-lg font-bold ml-8">
          #{nft.tokenId}
        </div>
      </div>
      <VaultedDetails details={nft.vaultedData} />
      <div className="text-center">
        {nft.points ? <div>{numberFormatter.format(nft.points)}</div> : null}
      </div>
    </label>
  );
};

const VaultedDetails = ({ details }: { details?: (string | bigint)[] }) => {
  if (!details) return null;

  const columns = ["Vaulted", "", "Unlocks", "", "", ""];

  return (
    <>
      {columns.map((column, i) => {
        if (column.length === 0) {
          return null;
        }
        const detail = details[i];
        if (typeof detail === "bigint" && Number(detail) > 10000000) {
          return (
            <div key={column} className="text-center text-lg">
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
    </>
  );
};

export { TableRow, PointsTable };
