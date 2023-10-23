import { selectedBorderClasses } from "@/utils/styling";
import cx from "classnames";
import { Modal } from "../Modal";

type UnvaultConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  unvault: () => void;
};

const UnvaultConvirmation = ({
  isOpen,
  onClose,
  selectedCount,
  unvault,
}: UnvaultConfirmationProps) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={"Vaulting options"}
      onClose={closeModal}
    >
      <div className="flex flex-col space-y-4">
        <div className="mt-2">
          Remove {selectedCount} NFT{selectedCount > 1 ? "s" : ""} from vault?
        </div>
        <button
          className={cx({
            "px-3 py-2 border border-gray-300 self-end mt-4": true,
            ...selectedBorderClasses(true),
          })}
          onClick={() => {
            unvault();
            closeModal();
          }}
        >
          <>Unvault</>
        </button>
      </div>
    </Modal>
  );
};

export { UnvaultConvirmation };
