import { createContext, useState } from "react";
import { TransactionModal } from "./TransactionModal";

const TransactionContext = createContext<{
  isTransactionWindowOpen: boolean;
  setIsTransactionWindowOpen: (isOpen: boolean) => void;
  hash?: `0x${string}`;
  setHash: (hash: `0x${string}`) => void;
  error?: string;
  setError: (error: string) => void;
  toggleButton: React.ReactNode;
}>({
  isTransactionWindowOpen: false,
  setIsTransactionWindowOpen: (isOpen: boolean) => {},
  hash: undefined,
  setHash: (hash: `0x${string}`) => {},
  setError: (error: string) => {},
  toggleButton: <></>,
});

const TransactionContextWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTransactionWindowOpen, setIsTTransactionWindowOpen] =
    useState(false);
  const [hash, setHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();

  const setIsTransactionWindowOpen = (isOpen: boolean) => {
    console.log("here!!!!");
    setIsTTransactionWindowOpen(isOpen);
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
        hash,
        setHash,
        toggleButton,
      }}
    >
      {children}
      <TransactionModal
        isOpen={isTransactionWindowOpen}
        setIsOpen={setIsTransactionWindowOpen}
        hash={hash}
        error={error}
        setError={setError}
      />
    </TransactionContext.Provider>
  );
};

export { TransactionContextWrapper, TransactionContext };
