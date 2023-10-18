"use client";

import { useContext, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { Tab } from "./Tab";

import { useRequestApproval } from "@/utils/useRequestApproval";
import { NamedTransaction, TransactionContext } from "../TransactionContext";
import { LoadSelectTransact, NftWithVaultedData } from "./LoadSelectTransact";
import vaultedABI from "../vaultedAbi.json";
import manifoldAbi from "../manifoldAbi.json";
import { VaultTimeSelect } from "../modals/VaultTimeSelect";
import { NftCard } from "./NftCard";

type VaultedProps = {
  active: boolean;
};

export const Vaulted = (props: VaultedProps) => {
  const { setIsTransactionWindowOpen, setWriteQueue, currentTxn } =
    useContext(TransactionContext);

  const [checkedTokenIds, setCheckedTokenIds] = useState<string[]>([]);

  const vaultTimeOptions = [
    "0 Years",
    "1 Year",
    "2 Years",
    "3 Years",
    "4 Years",
    "5 Years",
    "6 Years",
    "7 Years",
    "8 Years",
    "9 Years",
    "10 Years",
  ];

  const { data: tokenName } = useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`,
    abi: manifoldAbi,
    functionName: "name",
  });

  const [vaultTime, setVaultTime] = useState<number>(0);

  const { config } = usePrepareContractWrite({
    abi: vaultedABI,
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
    functionName: "vaultBatch",
    args: [
      Array(checkedTokenIds.length).fill(vaultTime),
      [...checkedTokenIds],
      Array(checkedTokenIds.length).fill(
        process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`
      ),
    ],
  });

  const { writeAsync } = useContractWrite({
    ...config,
    onSuccess(_) {
      setCheckedTokenIds([]);
    },
  });
  const {
    isAlreadyApproved,
    isRefetchingAlreadyLoaded,
    refetchIsAlreadyLoaded,
    writeAsync: approvalWriteAsync,
  } = useRequestApproval(true);

  const [vaultTimeSelectOpen, setVaultTimeSelectOpen] = useState(false);
  const openVaultTimeSelect = () => {
    setVaultTimeSelectOpen(true);
  };
  const closeVaultTimeSelect = () => {
    setVaultTimeSelectOpen(false);
  };

  const vaultForTime = async () => {
    setIsTransactionWindowOpen(true);

    let refetchedApprovalCheck;

    if (currentTxn) {
      refetchedApprovalCheck = await refetchIsAlreadyLoaded();
    }

    if (approvalWriteAsync && !isRefetchingAlreadyLoaded) {
      const approveContractNamedTransaction: NamedTransaction = {
        name: "Approve Vault Contract",
        fn: approvalWriteAsync,
        description: `Allows vaulting contract access to selected ${tokenName} NFT(s)`,
        status: "pending",
        processingText: "Approving",
      };

      let vaultContractNamedTransaction: NamedTransaction = {
        name: "Vault NFTs",
        fn: writeAsync,
        description: `Vaulting selected ${tokenName} NFT(s)`,
        status: "pending",
        processingText: "Vaulting",
      };

      if (isAlreadyApproved || refetchedApprovalCheck?.data) {
        setWriteQueue([vaultContractNamedTransaction]);
      } else {
        setWriteQueue([
          approveContractNamedTransaction,
          vaultContractNamedTransaction,
        ]);
      }
    }
  };

  const selectedAction = (
    <div className="flex space-x-4 absolute right-0 bottom-0">
      <div>
        <button
          className="p-2 border border-gray-200 h-12 w-48 cursor-pointer hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:hover:bg-red-900"
          disabled={checkedTokenIds.length === 0 || currentTxn !== undefined}
          onClick={openVaultTimeSelect}
        >
          Vault
        </button>
      </div>
    </div>
  );

  return (
    <Tab active={props.active}>
      <LoadSelectTransact
        title="Vaulted"
        instructions={<div></div>}
        contractAddress={
          process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`
        }
        checkedTokenIds={checkedTokenIds}
        setCheckedTokenIds={setCheckedTokenIds}
        transactNode={selectedAction}
        nftNamePrefix="FDO"
        actionPrefix="Vault"
      >
        {({
          nfts,
          checkedTokenIds,
          toggleCheckedTokenId,
          nftNamePrefix,
          actionPrefix,
        }) => {
          return (
            <>
              {nfts.length > 0 ? (
                <div
                  className={`grid grid-cols-${
                    nfts.length > 3 ? 4 : nfts.length
                  } gap-4 mx-auto my-4 mb-12`}
                >
                  {nfts.map((nft: NftWithVaultedData) => {
                    const selected = checkedTokenIds.includes(nft.tokenId);
                    return (
                      <NftCard
                        selected={selected}
                        nft={nft}
                        toggleCheckedTokenId={toggleCheckedTokenId}
                        key={nft.tokenId + nft.title}
                        nftNamePrefix={nftNamePrefix}
                        actionPrefix={actionPrefix}
                      />
                    );
                  })}
                </div>
              ) : null}
            </>
          );
        }}
      </LoadSelectTransact>
      <VaultTimeSelect
        isOpen={vaultTimeSelectOpen}
        onClose={closeVaultTimeSelect}
        setVaultTime={setVaultTime}
        selectedCount={checkedTokenIds.length}
        vault={vaultForTime}
      />
    </Tab>
  );
};
