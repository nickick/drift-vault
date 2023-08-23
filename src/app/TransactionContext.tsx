import { createContext, useState } from "react";
import { TransactionModal } from "./TransactionModal";

type WriteAsyncPromise = () => Promise<{ hash: `0x${string}` } | undefined>;

export type NamedTransactionStatus =
  | "pending"
  | "in progress"
  | "failed"
  | "succeeded";

export type NamedTransaction = {
  name: string;
  description: string;
  fn?: WriteAsyncPromise;
  status: NamedTransactionStatus;
  processingText: string;
};

const TransactionContext = createContext<{
  isTransactionWindowOpen: boolean;
  setIsTransactionWindowOpen: (isOpen: boolean) => void;
  error?: string;
  setError: (error: string) => void;
  toggleButton: React.ReactNode;
  writeQueue?: NamedTransaction[];
  setWriteQueue: (namedTransaction: NamedTransaction[]) => void;
  appendToQueue: (namedTransaction: NamedTransaction) => void;
  currentTxn?: NamedTransaction | undefined;
  setCurrentTxn: (namedTransaction: NamedTransaction | undefined) => void;
}>({
  isTransactionWindowOpen: false,
  setIsTransactionWindowOpen: (isOpen: boolean) => {},
  setError: (error: string) => {},
  toggleButton: <></>,
  writeQueue: [],
  setWriteQueue: (namedTransaction: NamedTransaction[]) => {},
  appendToQueue: (namedTransaction: NamedTransaction) => {},
  setCurrentTxn: (namedTransaction: NamedTransaction | undefined) => {},
});

const TransactionContextWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTransactionWindowOpen, setIsTransactionWindowOpen] = useState(false);
  const [error, setError] = useState<string>();

  const [writeQueue, setWriteQueue] = useState<NamedTransaction[]>([]);
  const appendToQueue = (fn: NamedTransaction) => {
    setWriteQueue([...writeQueue, fn]);
  };

  const [currentTxn, setCurrentTxn] = useState<NamedTransaction>();

  const toggleButton = (
    <button
      type="button"
      onClick={() => {
        setIsTransactionWindowOpen(!isTransactionWindowOpen);
      }}
      className="absolute left-0 bottom-0 bg-black border-white border bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 h-12"
    >
      Open transaction window
    </button>
  );

  return (
    <TransactionContext.Provider
      value={{
        isTransactionWindowOpen,
        setIsTransactionWindowOpen,
        error,
        setError,
        toggleButton,
        writeQueue,
        setWriteQueue,
        appendToQueue,
        currentTxn,
        setCurrentTxn,
      }}
    >
      {children}
      <TransactionModal
        isOpen={isTransactionWindowOpen}
        setIsOpen={setIsTransactionWindowOpen}
        error={error}
        setError={setError}
        writeQueue={writeQueue}
        setWriteQueue={setWriteQueue}
        currentTxn={currentTxn}
        setCurrentTxn={setCurrentTxn}
      />
    </TransactionContext.Provider>
  );
};

export { TransactionContextWrapper, TransactionContext };
