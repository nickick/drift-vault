import cx from "classnames";
import dayjs from "dayjs";
import React from "react";
import { Modal } from "./Modal";
import { selectedBorderClasses } from "./Vault/NftCard";

const year = dayjs().get("year");
const vaultOptions = [
  {
    title: "No lock",
    unlockableTime: "Always",
    multiplier: "1x",
    timeDescriptor: "without lock",
    timeOption: 0,
  },
  {
    title: "1 year",
    unlockableTime: dayjs()
      .set("year", year + 1)
      .format("MM/DD/YYYY"),
    multiplier: "2x",
    timeDescriptor: "for 1 year",
    timeOption: 1,
  },
  {
    title: "5 years",
    unlockableTime: dayjs()
      .set("year", year + 5)
      .format("MM/DD/YYYY"),
    multiplier: "3x",
    timeDescriptor: "for 5 years",
    timeOption: 5,
  },
  {
    title: "10 years",
    unlockableTime: dayjs()
      .set("year", year + 10)
      .format("MM/DD/YYYY"),
    multiplier: "5x",
    timeDescriptor: "for 10 years",
    timeOption: 10,
  },
];

type VaultTimeSelectProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  setVaultTime: (time: number) => void;
  vault: () => void;
};

const VaultTimeSelect = ({
  isOpen,
  onClose,
  selectedCount,
  setVaultTime,
  vault,
}: VaultTimeSelectProps) => {
  const [selected, setSelected] = React.useState<number>(0);
  const closeModal = () => {
    setTimeout(() => setSelected(0), 500);
    setVaultTime(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={"Pick a vaulting option"}
      onClose={closeModal}
    >
      <div className="flex flex-col space-y-4">
        <div className="mt-2">
          Select how long you would like to vault your FirstDayOut NFTs. If you
          select a time locked option, you will get a points multiplier bonus.
          You will not be able to remove your FirstDayOut from your vault until
          the time lock expires.
        </div>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-3">
            <div>Time</div>
            <div className="text-center">Unlockable</div>
            <div className="text-right">Points Multiplier</div>
          </div>
          {vaultOptions.map((option, index) => (
            <VaultOption
              {...option}
              onClick={() => {
                setSelected(index);
                setVaultTime(vaultOptions[index].timeOption);
              }}
              selected={index === selected}
              key={index}
            />
          ))}
        </div>
        <button
          className={cx({
            "px-3 py-2 border border-gray-300 self-end mt-4": true,
            ...selectedBorderClasses(true),
          })}
          onClick={() => {
            vault();
            closeModal();
          }}
        >
          {selected !== undefined ? (
            <>
              Vault {selectedCount > 1 ? `${selectedCount} tokens` : "1 token"}{" "}
              {vaultOptions[selected]?.timeDescriptor}
            </>
          ) : (
            <>Select a vaulting option</>
          )}
        </button>
      </div>
    </Modal>
  );
};

const VaultOption = (props: {
  title: string;
  unlockableTime: React.ReactNode;
  multiplier: string;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="group" onClick={() => props.onClick()}>
      <div
        className={cx({
          "grid grid-cols-3 border py-2 px-3 cursor-pointer": true,
          ...selectedBorderClasses(props.selected),
          "bg-white text-black": props.selected,
        })}
      >
        <div className="">{props.title}</div>
        <div className="text-center">{props.unlockableTime}</div>
        <div className="text-right">{props.multiplier}</div>
      </div>
    </div>
  );
};

export { VaultTimeSelect };
