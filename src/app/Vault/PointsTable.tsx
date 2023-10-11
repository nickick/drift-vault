import cx from "classnames";
import { format } from "date-fns";
import Image from "next/image";
import { NftItemsProps, NftWithVaultedData } from "./LoadSelectTransact";
import { selectedBorderClasses } from "@/utils/styling";

interface Props {
  nft: NftWithVaultedData;
  selected: boolean;
  toggleCheckedTokenId: (tokenId: string) => void;
  nftNamePrefix?: string;
  actionPrefix?: string;
}

const PointsTable = ({
  nfts,
  checkedTokenIds,
  toggleCheckedTokenId,
  nftNamePrefix,
  actionPrefix,
}: NftItemsProps) => {
  return (
    <div className={`flex flex-col border-t border-gray-500`}>
      <div className="col-span-7 grid grid-cols-7 gap-8 border-b border-gray-500 py-2">
        <div></div>
        <div className="col-span-2">Name</div>
        <div>Vaulted on</div>
        <div>Vault unlocks on</div>
        <div>Points accumulated</div>
        <div className="flex justify-end pr-8">Select</div>
      </div>
      {nfts.map((nft: NftWithVaultedData) => {
        const selected = checkedTokenIds.includes(nft.tokenId);
        return (
          <TableRow
            selected={selected}
            nft={nft}
            toggleCheckedTokenId={toggleCheckedTokenId}
            key={nft.tokenId + nft.title}
            nftNamePrefix={nftNamePrefix}
            actionPrefix={actionPrefix}
          />
        );
      })}
    </div>
  );
};

const TableRow = ({
  nft,
  selected,
  toggleCheckedTokenId,
  nftNamePrefix,
  actionPrefix,
}: Props) => {
  return (
    <label
      key={nft.tokenId + nft.title}
      className={cx({
        "grid grid-cols-7 items-center border-b border-gray-500 gap-8 cursor-pointer":
          true,
        ...selectedBorderClasses(selected),
        "bg-white text-black": selected,
      })}
    >
      <div className="col-span-1 relative overflow-hidden flex justify-center items-center h-56">
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
      <div className="col-span-2 flex items-center cursor-pointer group w-full">
        <div className="leading-snug text-lg font-bold">{nft.title}</div>
      </div>
      <VaultedDetails details={nft.vaultedData} />
      {nft.points ? <div>{nft.points?.toLocaleString()}</div> : null}
      <div className="w-full flex items-center justify-end">
        <div className="mr-8">
          {actionPrefix} {nftNamePrefix} #{nft.tokenId}
        </div>
        <div className="relative">
          <div className="absolute m-0 p-0 w-8 h-8 top-1/2 transform -translate-y-1/2 left-6">
            <input
              type="checkbox"
              value={nft.tokenId}
              checked={selected}
              className={cx({
                "checkbox rounded-none w-8 h-8": true,
              })}
              onChange={() => toggleCheckedTokenId(nft.tokenId)}
            />
          </div>
        </div>
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
          return <div key={column}>{format(Number(detail) * 1000, "P")}</div>;
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
