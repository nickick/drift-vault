import { Nft } from "alchemy-sdk";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
} from "wagmi";
import { StateContext } from "../AppState";
import { NamedTransaction, TransactionContext } from "../TransactionContext";
import manifoldAbi from "../manifoldAbi.json";
import { UnvaultConvirmation } from "../modals/UnvaultConfirmation";
import vaultedAbi from "../vaultedAbi.json";
import { LoadSelectTransact, NftWithVaultedData } from "./LoadSelectTransact";
import { PointsTable } from "./PointsTable";
import { Tab } from "./Tab";

type YourVaultProps = {
  active: boolean;
};

type TokenIdAndAddress = [string, bigint];

export const Vault = (props: YourVaultProps) => {
  const [vaultHash, setVaultHash] = useState<`0x${string}`>();
  const { address } = useAccount();

  const [checkedTokenIds, setCheckedTokenIds] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const publicClient = usePublicClient();

  const nftsLoadTransform = async () => {
    // Recursively go through vaultedTokens until we get an error
    const getData = async (
      tokenId: number,
      data: TokenIdAndAddress[]
    ): Promise<TokenIdAndAddress[]> => {
      try {
        const nextTokenData = (await publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "vaultedTokens",
          args: [address as `0x${string}`, tokenId],
        })) as TokenIdAndAddress;

        return await getData(tokenId + 1, [...data, nextTokenData]);
      } catch (err) {
        // We get a revert error when we've reached the end of the vaultedTokens array
        // so we return the data we've collected
        return data;
      }
    };

    const nftsData = await getData(0, []);

    // convert tokenIds from bigint into strings
    const tokenIds = nftsData.map((nftData) => nftData[1].toString());

    // get NFTs from the Vaulting FDO contract owned by the Vault contract
    const nftsTransformedRes = await fetch(
      `/api/nfts/${process.env.NEXT_PUBLIC_VAULT_ADDRESS}/${process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const nftsTransformed = await nftsTransformedRes.json();
    const filteredNfts: NftWithVaultedData[] = nftsTransformed.filter(
      (nft: Nft) => tokenIds.includes(nft.tokenId)
    );

    const vaultedData = (await Promise.all(
      filteredNfts.map((nft: Nft) => {
        const data = nftsData.find(
          (datum) => datum[1].toString() === nft.tokenId
        ) as string[];

        return publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "contractTokenIdToVaulting",
          args: [data[0], data[1]],
        });
      })
    )) as string[][];

    vaultedData.forEach((data, i) => {
      filteredNfts[i].vaultedData = data;
    });

    const pointsData = (await Promise.all(
      filteredNfts.map(async (nft: Nft) => {
        const points = await publicClient.readContract({
          address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
          abi: vaultedAbi,
          functionName: "calculatePoints",
          args: [nft.tokenId, nft.contract.address],
        });
        return {
          tokenId: nft.tokenId,
          points,
        };
      })
    )) as { tokenId: string; points: bigint }[];

    pointsData.forEach((data, i) => {
      const nft = filteredNfts.find((nft) => nft.tokenId === data.tokenId);
      if (nft) {
        nft.points = data.points;
      }
    });

    return filteredNfts;
  };

  const [unvaultConfirmationOpen, setUnvaultConfirmationOpen] = useState(false);

  const toggleUnvaultOpen = () => {
    setUnvaultConfirmationOpen(!unvaultConfirmationOpen);
  };

  const { data: tokenName } = useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`,
    abi: manifoldAbi,
    functionName: "name",
  });

  const { config } = usePrepareContractWrite({
    abi: vaultedAbi,
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
    functionName: "unvaultBatch",
    enabled: checkedTokenIds.length > 0,
    args: [
      [...checkedTokenIds],
      Array(checkedTokenIds.length).fill(
        process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`
      ),
    ],
  });

  const { writeAsync } = useContractWrite({
    ...config,
    onSuccess: () => {
      setCheckedTokenIds([]);
    },
  });

  const { setIsTransactionWindowOpen, setWriteQueue, currentTxn } =
    useContext(TransactionContext);

  const unvault = useCallback(async () => {
    setIsTransactionWindowOpen(true);

    let vaultContractNamedTransaction: NamedTransaction = {
      name: "Unvault NFTs",
      fn: writeAsync,
      description: `Unvault selected ${tokenName} NFT(s)`,
      status: "pending",
      processingText: "Unvaulting",
    };

    setWriteQueue([vaultContractNamedTransaction]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeAsync]);

  const [vaulted, setVaulted] = useState<NftWithVaultedData[]>([]);
  const [loading, setLoading] = useState(false);

  const { setState } = useContext(StateContext);

  useEffect(() => {
    if (loading) {
      setState({
        vault: {
          points: 0,
          loading: true,
        },
      });
    } else {
      const points = vaulted.reduce(
        (acc, nft) => (nft.points ?? BigInt(0)) + acc,
        BigInt(0)
      );
      setState({
        vault: {
          points: Number(points),
          loading: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    setError(undefined);
  }, [checkedTokenIds]);

  return (
    <Tab active={props.active} walletRequired>
      <div className="w-full max-h-screen overflow-y-auto overflow-x-hidden">
        <LoadSelectTransact
          contractAddress={process.env.NEXT_PUBLIC_SBT_ADDRESS as `0x${string}`}
          title="Your Vault"
          checkedTokenIds={checkedTokenIds}
          setCheckedTokenIds={setCheckedTokenIds}
          nftsLoadTransform={nftsLoadTransform}
          hash={vaultHash}
          noNftsMessage="You have no NFTs in your vault."
          actionPrefix="Unvault"
          setLoading={setLoading}
          setAssets={setVaulted}
          selectAllChecked={selectAllChecked}
          setSelectAllChecked={setSelectAllChecked}
        >
          {(props) => {
            return (
              <div className="p-8">
                <PointsTable {...props} />
                {props.nfts.length > 0 ? (
                  <div className="mt-4">
                    {error && (
                      <div className="text-red-600 font-medium w-full mb-4">
                        Error: {error}
                      </div>
                    )}
                    <div className="flex space-x-4">
                      <div className="flex items-center justify-between w-full">
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
                            currentTxn?.fn !== undefined
                          }
                          onClick={() => {
                            const isFullyUnlocked = props.nfts.reduce(
                              (acc, nft) => {
                                return (
                                  (!checkedTokenIds.includes(nft.tokenId) ||
                                    Number(nft.vaultedData?.[2] || 0) <
                                      Date.now() / 1000) &&
                                  acc
                                );
                              },
                              true
                            );

                            if (isFullyUnlocked) {
                              toggleUnvaultOpen();
                            } else {
                              setError(
                                "One or more of the selected NFTs are still locked. Wait until they are unlocked before unvaulting."
                              );
                            }
                          }}
                        >
                          Unvault
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          }}
        </LoadSelectTransact>
      </div>

      <UnvaultConvirmation
        isOpen={unvaultConfirmationOpen}
        onClose={toggleUnvaultOpen}
        selectedCount={checkedTokenIds.length}
        unvault={unvault}
      />
    </Tab>
  );
};
