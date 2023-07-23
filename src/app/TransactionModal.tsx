import { shortenAddress } from "@/utils/shortenAddress";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";
import { Spinner } from "./Spinner";

type Props = {
  hash?: `0x${string}`;
};

function TransactionModal(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hadHash, setHadHash] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen && !hadHash && props.hash) {
      setHadHash(true);
      openModal();
    }
  }, [props.hash, hadHash, isOpen]);

  const etherscanUrl =
    process.env.NEXT_PUBLIC_CHAIN_NAME === "goerli"
      ? "https://goerli.etherscan.io/tx"
      : "https://etherscan.io/tx";

  const { data, isError, isLoading } = useWaitForTransaction({
    hash: props.hash,
  });

  return (
    <>
      {props.hash && (
        <button
          type="button"
          onClick={openModal}
          className="absolute left-0 bottom-0 bg-black border-white border rounded bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open transaction window
        </button>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-black border border-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-100"
                  >
                    Transaction status
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Transaction:{" "}
                      <a
                        href={`${etherscanUrl}/${props.hash}`}
                        className="underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {shortenAddress(props.hash, 14)}
                      </a>
                      {isLoading && <Spinner className="ml-2" />}
                      {isError && <div>Error!</div>}
                      {data &&
                        JSON.stringify(data, (k, v) => {
                          typeof v === "bigint" ? v.toString() : v;
                        })}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export { TransactionModal };
