import { shortenAddress } from "@/utils/shortenAddress";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { usePublicClient, useWaitForTransaction } from "wagmi";
import { Spinner } from "./Spinner";
import { NamedTransaction } from "./TransactionContext";
import cx from "classnames";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  error?: string;
  setError: (error: string) => void;
  writeQueue: NamedTransaction[];
  setWriteQueue: (fn: NamedTransaction[]) => void;
  currentTxn?: NamedTransaction;
  setCurrentTxn: (fn: NamedTransaction | undefined) => void;
};

function TransactionModal(props: Props) {
  const [hadHash, setHadHash] = useState(false);
  const [hash, setHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();
  const publicClient = usePublicClient();
  const [processingIndexNumber, setProcessingIndexNumber] = useState<number>(0);
  useState<boolean>(false);

  function closeModal() {
    props.setIsOpen(false);
    if (error) {
      setHash(undefined);
    }
    setError("");

    if (props.writeQueue[props.writeQueue.length - 1]?.status === "succeeded")
      resetTransactionStatus();
  }

  function openModal() {
    props.setIsOpen(true);
  }

  function resetTransactionStatus() {
    props.setWriteQueue([]);
    props.setCurrentTxn(undefined);

    setProcessingIndexNumber(0);
  }

  useEffect(() => {
    if (!props.isOpen && !hadHash && hash) {
      setHadHash(true);
      openModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, hadHash, props.isOpen]);

  const etherscanUrl =
    process.env.NEXT_PUBLIC_CHAIN_NAME === "goerli"
      ? "https://goerli.etherscan.io/tx"
      : "https://etherscan.io/tx";

  const { data, isError, isLoading, isSuccess } = useWaitForTransaction({
    hash,
    confirmations: 3,
  });

  // if no currentTxn, set currentTxn to first item in queue
  useEffect(() => {
    if (
      !props.currentTxn &&
      props.writeQueue &&
      processingIndexNumber < props.writeQueue.length
    ) {
      props.writeQueue[processingIndexNumber].status = "in progress";

      props.setCurrentTxn(props.writeQueue[processingIndexNumber]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.writeQueue, props.currentTxn]);

  // if currentTxn, run it
  useEffect(() => {
    if (props.currentTxn) {
      const runTxn = async () => {
        try {
          const txn = await props.currentTxn!.fn!();
          if (txn) {
            setHash(txn.hash);
            const result = await publicClient.waitForTransactionReceipt({
              hash: txn.hash,
              confirmations: 1,
            });

            if (result) {
              props.writeQueue[processingIndexNumber].status = "succeeded";
            }

            // move on to next txn if there's one in the queue after 2 seconds
            if (result && processingIndexNumber < props.writeQueue.length - 1) {
              setTimeout(() => {
                setProcessingIndexNumber(processingIndexNumber + 1);
                props.setCurrentTxn(undefined);
              }, 2000);
            }
          }
        } catch (e: any) {
          setError(e.shortMessage ?? e.message ?? e);

          resetTransactionStatus();

          return;
        }
      };

      runTxn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentTxn]);

  return (
    <Transition
      appear
      show={props.isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-black border border-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-100"
                >
                  Transaction status
                </Dialog.Title>
                <div className="mt-2">
                  {error && (
                    <p className="text-sm text-red-700">Error: {error}</p>
                  )}
                  {!error && (
                    <div className="flex justify-between">
                      {!isLoading &&
                        props.currentTxn?.status === "in progress" && (
                          <p>{props.currentTxn?.name}</p>
                        )}
                      {isLoading && (
                        <div className="flex items-center">
                          <p>{props.currentTxn?.processingText}...</p>
                          <Spinner className="ml-2" />
                        </div>
                      )}
                      {isSuccess &&
                        props.currentTxn?.status === "succeeded" &&
                        !isError && <p>Success!</p>}
                      {props.writeQueue.length > 1 && (
                        <p>
                          Step {processingIndexNumber + 1} of{" "}
                          {props.writeQueue.length}
                        </p>
                      )}
                    </div>
                  )}
                  {!error && props.writeQueue.length > 1 && (
                    <div className="flex space-x-2 mt-2">
                      {props.writeQueue.map((txn, i) => (
                        <progress
                          key={txn.name}
                          className={cx(
                            "progress w-full",
                            txn.status === "succeeded" && "progress-success",
                            txn.status === "in progress" && "progress-info",
                            txn.status === "in progress" &&
                              isLoading &&
                              "animate-pulse"
                          )}
                          value="100"
                          max="100"
                        ></progress>
                      ))}
                    </div>
                  )}
                  {props.currentTxn && (
                    <div className="flex flex-col my-2">
                      <p className="mt-2 text-sm">
                        {isLoading
                          ? "Please stand by, this could take a few seconds..."
                          : props.currentTxn.description}
                      </p>
                      {hash ? (
                        <p className="text-sm text-gray-300">
                          Transaction:{" "}
                          <a
                            href={`${etherscanUrl}/${hash}`}
                            className="underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {shortenAddress(hash, 14)}
                          </a>
                          {isError && <div>Error!</div>}
                          {data &&
                            JSON.stringify(data, (k, v) => {
                              typeof v === "bigint" ? v.toString() : v;
                            })}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-300">
                          Waiting for transaction...
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
  );
}

export { TransactionModal };
