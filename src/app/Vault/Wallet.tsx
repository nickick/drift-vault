"use client";

import { useContext, useEffect, useState } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { Tab } from "./Tab";

import { useRequestApproval } from "@/utils/useRequestApproval";
import { NamedTransaction, TransactionContext } from "../TransactionContext";
import manifoldAbi from "../manifoldAbi.json";
import { VaultTimeSelect } from "../modals/VaultTimeSelect";
import vaultedABI from "../vaultedAbi.json";
import { LoadSelectTransact, NftWithVaultedData } from "./LoadSelectTransact";
import { NftCard } from "./NftCard";

type VaultedProps = {
  active: boolean;
};

export const Wallet = (props: VaultedProps) => {
  const { setIsTransactionWindowOpen, setWriteQueue, writeQueue, currentTxn } =
    useContext(TransactionContext);

  const [checkedTokenIds, setCheckedTokenIds] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {}, [selectAllChecked]);

  const { data: tokenName } = useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`,
    abi: manifoldAbi,
    functionName: "name",
  });

  const [vaultTime, setVaultTime] = useState<number>(0);

  const {
    approved,
    isRefetching: isRefetchingApproval,
    refetch,
    writeAsync: approvalWriteAsync,
  } = useRequestApproval({ requestingApproval: true });

  const { config } = usePrepareContractWrite({
    abi: vaultedABI,
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
    functionName: "vaultBatch",
    enabled: checkedTokenIds.length > 0 && !!approved,
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
      refetchedApprovalCheck = await refetch();
    }

    if (approvalWriteAsync && !isRefetchingApproval) {
      const approveContractNamedTransaction: NamedTransaction = {
        name: "Approve Vault Contract",
        fn: approvalWriteAsync,
        onResult: async (result) => {
          await refetch();
        },
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

      if (approved || refetchedApprovalCheck?.data) {
        setWriteQueue([vaultContractNamedTransaction]);
      } else {
        setWriteQueue([
          approveContractNamedTransaction,
          vaultContractNamedTransaction,
        ]);
      }
    }
  };

  useEffect(() => {
    if (approved && writeAsync && writeQueue?.length === 2) {
      setWriteQueue([
        writeQueue[0],
        {
          name: "Vault NFTs",
          fn: writeAsync,
          description: `Vaulting selected ${tokenName} NFT(s)`,
          status: "pending",
          processingText: "Vaulting",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeQueue?.length, writeAsync?.toString(), approved]);

  return (
    <Tab active={props.active} walletRequired>
      <LoadSelectTransact
        title="Vaulted"
        instructions={<div></div>}
        contractAddress={
          process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`
        }
        checkedTokenIds={checkedTokenIds}
        setCheckedTokenIds={setCheckedTokenIds}
        selectAllChecked={selectAllChecked}
        setSelectAllChecked={setSelectAllChecked}
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
            <div className="flex flex-col">
              <div className="mx-auto my-4">
                {nfts.length > 0 ? (
                  <>
                    <div className={`grid sm:grid-cols-3 lg:grid-cols-4 gap-4`}>
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
                    <div className="flex space-x-4 w-full mt-8 mb-4 items-center justify-between">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="checkbox rounded-none border border-white"
                          value={""}
                          checked={selectAllChecked}
                          onChange={(e) => {
                            setSelectAllChecked(e.target.checked);
                          }}
                        />
                        <span className="ml-2 capitalize font-medium">
                          {selectAllChecked ? "Deselect all" : "Select all"}
                        </span>
                      </label>
                      <button
                        className="p-2 border font-medium bg-white text-black border-gray-200 h-12 w-36 cursor-pointer hover:bg-slate-200 transition-colors disabled:cursor-not-allowed disabled:hover:bg-red-900 disabled:hover:text-white"
                        disabled={
                          checkedTokenIds.length === 0 ||
                          currentTxn !== undefined
                        }
                        onClick={openVaultTimeSelect}
                      >
                        Vault
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
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
