import { createContext, useState } from "react";
import { TransactionModal } from "./TransactionModal";

export type WriteAsyncPromise = () => Promise<
  { hash: `0x${string}` } | undefined
>;

const TransactionContext = createContext<{
  isTransactionWindowOpen: boolean;
  setIsTransactionWindowOpen: (isOpen: boolean) => void;
  error?: string;
  setError: (error: string) => void;
  toggleButton: React.ReactNode;
  writeQueue?: WriteAsyncPromise[];
  setWriteQueue: (fn: WriteAsyncPromise[]) => void;
  appendToQueue: (fn: WriteAsyncPromise) => void;
}>({
  isTransactionWindowOpen: false,
  setIsTransactionWindowOpen: (isOpen: boolean) => {},
  setError: (error: string) => {},
  toggleButton: <></>,
  writeQueue: [],
  setWriteQueue: (fn: WriteAsyncPromise[]) => {},
  appendToQueue: (fn: WriteAsyncPromise) => {},
});

const TransactionContextWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTransactionWindowOpen, setIsTransactionWindowOpen] = useState(false);
  const [error, setError] = useState<string>();

  const [writeQueue, setWriteQueue] = useState<WriteAsyncPromise[]>([]);
  const appendToQueue = (fn: WriteAsyncPromise) => {
    setWriteQueue([...writeQueue, fn]);
  };

  const toggleButton = (
    <button
      type="button"
      onClick={() => setIsTransactionWindowOpen(!isTransactionWindowOpen)}
      className="absolute left-0 bottom-0 bg-black border-white border bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
      />
    </TransactionContext.Provider>
  );
};

export { TransactionContextWrapper, TransactionContext };
