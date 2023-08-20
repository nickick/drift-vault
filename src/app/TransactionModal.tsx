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
};

function TransactionModal(props: Props) {
  const [hadHash, setHadHash] = useState(false);
  const [hash, setHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();
  const publicClient = usePublicClient();
  const [currentTxn, setCurrentTxn] = useState<NamedTransaction>();
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [completedTransactions, setCompletedTransactions] = useState<
    NamedTransaction[]
  >([]);

  function closeModal() {
    props.setIsOpen(false);
    if (error) {
      setHash(undefined);
    }
    setError("");
  }

  function openModal() {
    props.setIsOpen(true);
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
    if (!currentTxn && props.writeQueue && props.writeQueue[0]) {
      setTotalTransactions(props.writeQueue.length);

      setCurrentTxn(() => props.writeQueue[0]);
      props.setWriteQueue(props.writeQueue.slice(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.writeQueue, currentTxn]);

  // if currentTxn, run it
  useEffect(() => {
    if (currentTxn) {
      const runTxn = async () => {
        try {
          const txn = await currentTxn.fn();
          if (txn) {
            setHash(txn.hash);
            const result = await publicClient.waitForTransactionReceipt({
              hash: txn.hash,
              confirmations: 1,
            });

            // move on to next txn if there's one in the queue after 2 seconds
            if (result && props.writeQueue.length > 0) {
              setTimeout(() => {
                setCompletedTransactions((prev) => [
                  ...prev,
                  { ...currentTxn, status: "succeeded" },
                ]);
                setCurrentTxn(undefined);
              }, 2000);
            }
          }
        } catch (e: any) {
          setError(e.shortMessage ?? e.message ?? e);

          props.setWriteQueue([]);

          setCompletedTransactions([]);

          // clear entire queue on error
          setCurrentTxn(undefined);

          return;
        }
      };

      runTxn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTxn]);

  return (
    <Transition
      appear
      show={props.isOpen}
      as={Fragment}
    >
      <Dialog
        as='div'
        className='relative z-10'
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-75' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden bg-black border border-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-100'
                >
                  Transaction status
                </Dialog.Title>
                <div className='mt-2'>
                  {error && (
                    <p className='text-sm text-red-700'>Error: {error}</p>
                  )}
                  {hash && (
                    <p className='text-sm text-gray-300'>
                      Transaction:{" "}
                      <a
                        href={`${etherscanUrl}/${hash}`}
                        className='underline'
                        target='_blank'
                        rel='noreferrer'
                      >
                        {shortenAddress(hash, 14)}
                      </a>
                      {isLoading && <Spinner className='ml-2' />}
                      {isError && <div>Error!</div>}
                      {data &&
                        JSON.stringify(data, (k, v) => {
                          typeof v === "bigint" ? v.toString() : v;
                        })}
                      {isSuccess && !isLoading && !error && <div>Success!</div>}
                    </p>
                  )}
                  {!hash && !error && (
                    <div>
                      Waiting for transaction {completedTransactions.length + 1}{" "}
                      / {totalTransactions}
                    </div>
                  )}
                  {!error && (
                    <div
                      className={cx(
                        "flex space-x-2 mt-2",
                        totalTransactions === 1 && "justify-center",
                      )}
                    >
                      {completedTransactions.map((completedTxn) => (
                        <progress
                          key={completedTxn.name}
                          className='progress progress-info w-48'
                          value='100'
                          max='100'
                        ></progress>
                      ))}
                      {currentTxn && (
                        <progress
                          key={currentTxn.name}
                          className='progress progress-info w-48 animate-pulse'
                          value='100'
                          max='100'
                        ></progress>
                      )}
                      {props.writeQueue.map((pendingTxn) => (
                        <progress
                          key={pendingTxn.name}
                          className='progress w-48'
                          value='100'
                          max='100'
                        ></progress>
                      ))}
                    </div>
                  )}
                  {currentTxn && (
                    <div className='flex flex-col items-center mt-2'>
                      <p className='text-xl'>{currentTxn.name}</p>
                      <p className='mt-2 text-sm'>{currentTxn.description}</p>
                    </div>
                  )}
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
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
