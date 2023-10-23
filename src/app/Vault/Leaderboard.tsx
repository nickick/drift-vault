import { useAccount, useEnsName } from "wagmi";
import { Tab } from "./Tab";
import { formatAddress, numberFormatter } from "@/utils/format";
import cx from "classnames";
import { InView, useInView } from "react-intersection-observer";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Spinner } from "../Spinner";
import { StateContext } from "../AppState";

const famousWallets: `0x${string}`[] = [
  "0xce90a7949bb78892f159f428d0dc23a8e3584d75",
  "0xa679c6154b8d4619af9f83f0bf9a13a680e01ecf",
  "0xd6a984153acb6c9e2d788f08c2465a1358bb89a7",
  "0xff0bd4aa3496739d5667adc10e2b843dfab5712b",
  "0xc6b0562605d35ee710138402b878ffe6f2e23807",
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "0xf0D6999725115E3EAd3D927Eb3329D63AFAEC09b",
];

const otherTestWallets: `0x${string}`[] = [
  "0x46058c855474a11eeb24ea0c3c0dd0a5f04b15d7", // axj
  "yourWallet" as `0x${string}`,
];

const rowCreator = (
  wallet: `0x${string}`,
  numPieces: number,
  numPointsDaily: number,
  pointsTotal: number
) => {
  return [wallet, numPieces, numPointsDaily, pointsTotal];
};

const randomRowCreator = (wallet: `0x${string}`) => {
  const numPieces = Math.floor(Math.random() * 100);
  const numPointsDaily = Math.floor(numPieces * Math.random() * 10);
  const pointsTotal = Math.floor(numPointsDaily * Math.random() * 100);
  return rowCreator(wallet, numPieces, numPointsDaily, pointsTotal);
};

const InViewWrapper = (props: {
  inView: boolean;
  onChangeInView: ({ id, inView }: { id: number; inView: boolean }) => void;
  id: number;
  children: ReactNode;
}) => {
  const { inView, onChangeInView, id, children } = props;
  useEffect(() => {
    onChangeInView({ id, inView });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return <>{children}</>;
};

type LeaderboardRowProps = {
  rank: number;
  wallet?: `0x${string}`;
  address?: `0x${string}`;
  pieces: number;
  pointsDaily: number;
  pointsTotal: number;
  highlightCurrentWallet?: boolean;
  onChangeInView?: ({ id, inView }: { id: number; inView: boolean }) => void;
};

const LeaderboardRow = (props: LeaderboardRowProps) => {
  const {
    wallet,
    address,
    pieces,
    pointsDaily,
    pointsTotal,
    rank,
    highlightCurrentWallet,
    onChangeInView,
  } = props;
  const { data, isLoading } = useEnsName({ address: wallet, chainId: 1 });
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  return (
    <div ref={ref}>
      <InViewWrapper
        inView={inView}
        onChangeInView={onChangeInView || (() => {})}
        id={rank}
      >
        <div
          className={cx({
            flex: true,
            "border border-white":
              wallet === address && !highlightCurrentWallet,
          })}
        >
          <div
            className={cx({
              "p-4 grid grid-cols-4 w-12": true,
              "bg-[#303030]": rank % 2 === 1 && !highlightCurrentWallet,
            })}
          >
            #{rank}
          </div>
          <div
            className={cx({
              "w-full p-4 grid grid-cols-3 sm:grid-cols-5 transition-opacity":
                true,
              "bg-[#303030]": rank % 2 === 1 && !highlightCurrentWallet,
              "text-2xl": highlightCurrentWallet,
            })}
            ref={ref}
          >
            <div className="text-center col-span-2">
              {isLoading
                ? wallet
                : data ??
                  formatAddress(wallet, wallet === address ? 3 : 6)}{" "}
              {wallet === address ? "- You!" : ""}
            </div>
            <div className="text-center hidden sm:flex">{pieces}</div>
            <div className="text-center hidden sm:flex">
              {numberFormatter.format(pointsDaily)}
            </div>
            <div className="text-center">
              {numberFormatter.format(pointsTotal)}
            </div>
          </div>
        </div>
      </InViewWrapper>
    </div>
  );
};

const randomRows = Array(3)
  .fill(famousWallets)
  .flat()
  .concat(otherTestWallets)
  .map(randomRowCreator)
  .sort((a, b) => (b[3] as number) - (a[3] as number));

const fakeLoader = async (address?: string) => {
  return new Promise((resolve) => {
    let finalRandomRows = randomRows;
    const yourRowToReplace = randomRows.find(
      (row: (string | number)[]) => row[0] === "yourWallet"
    );
    if (address) {
      if (yourRowToReplace) {
        yourRowToReplace[0] = address as `0x${string}`;
      }
    } else {
      const row = randomRows.indexOf(yourRowToReplace!);
      finalRandomRows = randomRows.filter((_, index) => index !== row);
    }

    setTimeout(() => {
      resolve(finalRandomRows);
    }, 2000);
  });
};

type LeaderboardProps = {
  active: boolean;
};

export const Leaderboard = (props: LeaderboardProps) => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<(string | number)[][]>([]);
  const { state, setState } = useContext(StateContext);

  const setIsLoading = (isLoading: boolean) => {
    setLoading(isLoading);
    if (isLoading) {
      setState({
        leaderboard: {
          position: 0,
          totalPositions: 0,
          loading: true,
        },
      });
    } else {
      setState({
        leaderboard: {
          position: 0,
          totalPositions: 0,
          loading: false,
        },
      });
    }
  };

  const yourRow = rows.find(
    (row: (string | number)[]) =>
      row[0].toString().toLowerCase() === address?.toLowerCase()
  );
  const yourRank = rows.indexOf(yourRow!) + 1;

  useEffect(() => {
    if (yourRow) {
      setState({
        leaderboard: {
          position: yourRank,
          totalPositions: rows.length,
          loading: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yourRow, yourRank]);

  const [currentRankInView, setCurrentRankInView] = useState<
    Record<number, boolean>
  >({});

  const getRows = useCallback(async () => {
    setIsLoading(true);

    if (state.demoMode) {
      const rows = (await fakeLoader(address)) as (string | number)[][];
      setRows(rows);
    } else {
      setRows([]);
      const leaderboardRes = await fetch("/api/leaderboard");
      const res = (await leaderboardRes.json()) as {
        transferMap: {
          [key: `0x${string}`]: {
            numPieces: number;
            cumulativeMultiplier: number;
            points: number;
          };
        };
      };

      const realRows = Object.keys(res.transferMap).map((wallet) => {
        const walletString = wallet as `0x${string}`;
        const row = res.transferMap[walletString];
        return rowCreator(
          walletString,
          row.numPieces,
          // points are in 100s representing per second accumulation, so 86400 seconds in a day / 100 * point multiplier for cumulative daily score
          row.cumulativeMultiplier * 864,
          row.points
        );
      });

      setRows(realRows);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, state.demoMode]);

  useEffect(() => {
    getRows();
  }, [address, getRows, state.demoMode]);

  return (
    <Tab active={props.active} walletRequired={false}>
      <div className="w-full relative">
        {yourRow && !loading ? (
          <div className="absolute left-0 right-0 bottom-0 px-8 bg-blue-purple transition-opacity">
            <LeaderboardRow
              rank={yourRank}
              wallet={address}
              pieces={yourRow[1] as number}
              pointsDaily={yourRow[2] as number}
              pointsTotal={yourRow[3] as number}
              address={address}
              highlightCurrentWallet
            />
          </div>
        ) : null}
        <div className="flex flex-col w-full p-4 max-h-[calc(100vh-15rem)] overflow-auto bg-[#161616]">
          <div className="p-8">
            <div className="flex text-slate-gray">
              <div className="w-12" />
              <div className="w-full grid grid-cols-3 sm:grid-cols-5 pb-4 px-4">
                <div className="text-center col-span-2">Wallet</div>
                <div className="text-center hidden sm:flex">Pieces vaulted</div>
                <div className="text-center hidden sm:flex">
                  Daily Accumulation
                </div>

                <div className="text-center">Points total</div>
              </div>
            </div>
            <div className="">
              {loading ? (
                <div className="flex p-16 items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  {rows
                    .sort((a, b) => (b[3] as number) - (a[3] as number))
                    .map((row, index) => {
                      const [wallet, pieces, pointsDaily, pointsTotal] = row;
                      return (
                        <LeaderboardRow
                          key={index}
                          {...{
                            rank: index + 1,
                            wallet: wallet as `0x${string}`,
                            pieces: pieces as number,
                            pointsDaily: pointsDaily as number,
                            pointsTotal: pointsTotal as number,
                            address,
                            onChangeInView: ({
                              id,
                              inView,
                            }: {
                              id: number;
                              inView: boolean;
                            }) => {
                              const newRankInView = { ...currentRankInView };
                              newRankInView[id] = inView;
                              setCurrentRankInView(newRankInView);
                            },
                          }}
                        />
                      );
                    })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Tab>
  );
};
