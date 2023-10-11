import { useAccount, useEnsName } from "wagmi";
import { Tab } from "./Tab";
import { formatAddress } from "@/utils/format";
import cx from "classnames";
import { InView } from "react-intersection-observer";
import { ReactNode, useEffect } from "react";

type LeaderboardProps = {
  active: boolean;
};

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
];

const randomRowCreator = (wallet: `0x${string}`) => {
  const numPieces = Math.floor(Math.random() * 100);
  const numPointsDaily = Math.floor(numPieces * Math.random() * 10);
  const pointsTotal = Math.floor(numPointsDaily * Math.random() * 100);
  return [wallet, numPieces, numPointsDaily, pointsTotal];
};

type LeaderboardRowProps = {
  rank: number;
  wallet: `0x${string}`;
  pieces: number;
  pointsDaily: number;
  pointsTotal: number;
  highlightCurrentWallet?: boolean;
  onChangeInView?: (inView: boolean) => void;
};

const InViewWrapper = (props: {
  inView: boolean;
  onChangeInView: (inView: boolean) => void;
  children: ReactNode;
}) => {
  const { inView, onChangeInView, children } = props;
  useEffect(() => {
    onChangeInView(inView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return <>{children}</>;
};
const LeaderboardRow = (props: LeaderboardRowProps) => {
  const {
    wallet,
    pieces,
    pointsDaily,
    pointsTotal,
    rank,
    highlightCurrentWallet,
    onChangeInView,
  } = props;
  const { address } = useAccount();
  const { data, isLoading } = useEnsName({ address: wallet, chainId: 1 });
  return (
    <InView>
      {({ inView, ref }) => (
        <InViewWrapper
          inView={inView}
          onChangeInView={onChangeInView || (() => {})}
        >
          <div
            className={cx({
              "p-4 grid grid-cols-6": true,
              "bg-gray-900": rank % 2 === 0,
              "text-2xl": highlightCurrentWallet,
              "border border-white":
                wallet === address && !highlightCurrentWallet,
            })}
          >
            <div>#{rank}</div>
            <div className="col-span-2 text-center">
              {isLoading
                ? wallet
                : data ??
                  formatAddress(wallet, wallet === address ? 3 : 10)}{" "}
              {wallet === address ? "- You!" : ""}
            </div>
            <div className="text-center">{pieces}</div>
            <div className="text-center">{pointsDaily}</div>
            <div className="text-center">{pointsTotal}</div>
          </div>
        </InViewWrapper>
      )}
    </InView>
  );
};

export const Leaderboard = (props: LeaderboardProps) => {
  const { address } = useAccount();
  const randomRows = Array(20)
    .fill(famousWallets)
    .flat()
    .concat(otherTestWallets)
    .concat([address])
    .map(randomRowCreator)
    .sort((a, b) => (b[3] as number) - (a[3] as number));

  const yourRow = randomRows.find(
    (row: (string | number)[]) => row[0] === address
  );
  const yourRank = randomRows.indexOf(yourRow!) + 1;
  const currentRankInView: { [key: number]: boolean } = {};
  console.log(currentRankInView);

  return (
    <Tab active={props.active}>
      <div className="w-full relative">
        {yourRow ? (
          <div className="absolute left-0 right-0 bottom-0 px-8 bg-gray-900 border-r border-b border-l border-gray-500">
            <LeaderboardRow
              rank={yourRank}
              wallet={address!}
              pieces={yourRow[1] as number}
              pointsDaily={yourRow[2] as number}
              pointsTotal={yourRow[3] as number}
              highlightCurrentWallet
            />
          </div>
        ) : null}
        <div className="flex flex-col w-full p-4 border-l border-b border-r border-gray-500 max-h-[calc(100vh-30rem)] overflow-auto">
          <div className="p-8">
            <div className="grid grid-cols-6 pb-4 px-4">
              <div></div>
              <div className="col-span-2 text-center">Wallet</div>
              <div className="text-center">Pieces vaulted</div>
              <div className="text-center">Daily Accumulation</div>
              <div className="text-center">Points total</div>
            </div>
            <div className="border border-gray-500">
              {randomRows.map((row, index) => {
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
                      onChangeInView: (inView: boolean) => {
                        currentRankInView[index] = inView;
                      },
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Tab>
  );
};
