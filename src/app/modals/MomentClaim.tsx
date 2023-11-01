import { selectedBorderClasses } from "@/utils/styling";
import cx from "classnames";
import { Modal } from "../Modal";
import { ReactNode } from "react";

type MomentClaimProps = {
  isOpen: boolean;
  onClose: () => void;
  moment: {
    title: ReactNode;
  };
  claimMoment: () => void;
};

const MomentClaim = ({
  isOpen,
  onClose,
  moment,
  claimMoment,
}: MomentClaimProps) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Exclusive link for ${moment.title}`}
      onClose={closeModal}
    >
      <div className="flex flex-col space-y-8 mt-8 text-center items-center">
        <div>
          Please do not share the link below with anyone. The link below can
          only be used once and is associated with your eligible wallet. Anyone
          found misusing Vaulted links may be removed from eligibility.
        </div>
        <button
          className={cx({
            "px-3 py-2 border border-gray-300 w-48 mt-4": true,
            ...selectedBorderClasses(true),
          })}
          onClick={() => {
            claimMoment();
            closeModal();
          }}
        >
          Your Exclusive Link
        </button>
      </div>
    </Modal>
  );
};

export { MomentClaim };
