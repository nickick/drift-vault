import { selectedBorderClasses } from "@/utils/styling";
import cx from "classnames";
import { Modal } from "../Modal";
import { ReactNode, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import axios from "axios";
import { Spinner } from "../Spinner";

type MomentClaimProps = {
  isOpen: boolean;
  onClose: () => void;
  link?: string;
  loading: boolean;
  moment: {
    title: ReactNode;
  };
  claimMoment: () => void;
};

const MomentClaim = ({
  isOpen,
  onClose,
  moment,
  loading,
  claimMoment,
}: MomentClaimProps) => {
  const closeModal = () => {
    onClose();
  };

  const { address } = useAccount();
  const [verifiedAddress, setVerifiedAddress] = useState<string>();
  const [isVerified, setIsVerified] = useState(false);
  const [msg, setMsg] = useState<string>();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setMsg(
      `Login to Drift Vault with account ${address}: ${new Date().toISOString()}`
    );
    if (verifiedAddress !== address) {
      setIsVerified(false);
      setVerifiedAddress(undefined);
    }
  }, [address, verifiedAddress]);

  const { signMessage, data } = useSignMessage({
    message: msg,
    onMutate: () => {
      setError("");
      setSigning(true);
      setVerifiedAddress(undefined);
    },
    onError: (err) => {
      setSigning(false);
      setError(`Error: ${err.message}`);
    },
    onSuccess: async (sig: string) => {
      try {
        const res = await axios.post("/api/sign", { sig, msg });

        if (res.data.verified) {
          setSigning(false);
          setIsVerified(true);
          setVerifiedAddress(res.data.address);
        } else {
          setError(res.data.error);
        }
      } catch (err: any) {
        setError(`Error: ${err.message}`);
        setSigning(false);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      title={`Exclusive link for ${moment.title}`}
      onClose={closeModal}
    >
      <div className="flex flex-col space-y-8 mt-8 text-center items-center">
        {isVerified ? (
          <>
            <div>
              Please do not share the link below with anyone. The link below can
              only be used once and is associated with your eligible wallet.
              Anyone found misusing Vaulted links may be removed from
              eligibility.
            </div>
            <button
              className={cx({
                "px-3 py-2 border border-gray-300 w-56 mt-4": true,
                ...selectedBorderClasses(true),
              })}
              onClick={() => {
                claimMoment();
                // closeModal();
              }}
            >
              Your Exclusive Link{" "}
              {loading ? <Spinner className="ml-2" /> : null}
            </button>
          </>
        ) : (
          <>
            <div>Verify your wallet.</div>
            {error ? <div className="text-red-500">{error}</div> : null}
            <button
              className={cx({
                "px-3 py-2 border border-gray-300 w-48 mt-4": true,
                ...selectedBorderClasses(true),
              })}
              onClick={() => {
                signMessage();
              }}
            >
              {signing ? (
                <>
                  Verifying...
                  <Spinner className="ml-2" />
                </>
              ) : (
                "Verify"
              )}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export { MomentClaim };
