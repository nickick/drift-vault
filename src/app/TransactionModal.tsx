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
  const [currentSessionTransactions, setCurrentSessionTransactions] =
    useState<NamedTransaction[]>();
  const [recordedTotalTransactions, setRecordedTotalTransactions] =
    useState<boolean>();
  const [processingIndexNumber, setProcessingIndexNumber] = useState<number>(0);
  const [isFinishedTransacting, setIsFinishedTransacting] =
    useState<boolean>(false);

  function closeModal() {
    props.setIsOpen(false);
    if (error) {
      setHash(undefined);
    }
    setError("");

    if (isFinishedTransacting) resetTransactionStatus();
  }

  function openModal() {
    props.setIsOpen(true);
  }

  function resetTransactionStatus() {
    props.setWriteQueue([]);

    setCurrentSessionTransactions([]);
    setRecordedTotalTransactions(false);
    setProcessingIndexNumber(0);

    props.setCurrentTxn(undefined);
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
    if (!props.currentTxn && props.writeQueue && props.writeQueue[0]) {
      props.writeQueue[0].status = "in progress";

      if (!recordedTotalTransactions) {
        setCurrentSessionTransactions(props.writeQueue);
        setRecordedTotalTransactions(true);
      } else {
        const updatedTransactions = [...currentSessionTransactions!];
        updatedTransactions[processingIndexNumber] = {
          ...props.writeQueue[0],
        };
        setCurrentSessionTransactions(updatedTransactions);
      }

      props.setCurrentTxn(props.writeQueue[0]);
      props.setWriteQueue(props.writeQueue.slice(1));
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
              props.currentTxn!.status = "succeeded";
              const updatedTransactions = [...currentSessionTransactions!];
              updatedTransactions[processingIndexNumber] = {
                ...props.currentTxn!,
              };
              setCurrentSessionTransactions(updatedTransactions);

              processingIndexNumber < currentSessionTransactions!.length - 1
                ? setProcessingIndexNumber(processingIndexNumber + 1)
                : setIsFinishedTransacting(true);
            }

            // move on to next txn if there's one in the queue after 2 seconds
            if (result && props.writeQueue.length > 0) {
              setTimeout(() => {
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
                      {isLoading && <p>{props.currentTxn?.hashingTitle}...</p>}
                      {isSuccess &&
                        props.currentTxn?.status === "succeeded" &&
                        !isError && <p>Success!</p>}
                      <p>
                        Step {processingIndexNumber + 1} of{" "}
                        {currentSessionTransactions?.length}
                      </p>
                    </div>
                  )}
                  {!error && currentSessionTransactions && (
                    <div
                      className={cx(
                        "flex space-x-2 mt-2",
                        currentSessionTransactions?.length === 1 &&
                          "justify-center"
                      )}
                    >
                      {currentSessionTransactions.map((txn, i) => (
                        <progress
                          key={txn.name}
                          className={cx(
                            "progress w-48",
                            txn.status === "succeeded" && "progress-success",
                            txn.status === "in progress" && "progress-info",
                            isLoading &&
                              i === processingIndexNumber &&
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
                      {isLoading && (
                        <div className="flex justify-center">
                          <Spinner className="mt-4 h-48 w-48 " />
                        </div>
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
