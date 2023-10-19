"use client";

import { ReactNode, useContext, useState } from "react";
import { TransactionContextWrapper } from "../TransactionContext";
import { Leaderboard } from "./Leaderboard";
import { Wallet } from "./Wallet";
import { Vault } from "./Vault";
import { StateContext } from "../AppState";
import { Spinner } from "../Spinner";
import { numberFormatter } from "@/utils/format";
import cx from "classnames";

enum TabNames {
  VAULTED = "Wallet",
  YOUR_VAULT = "Vault",
  LEADERBOARD = "Leaderboard",
}

const tabTitles: { [key in TabNames]: string } = {
  [TabNames.VAULTED]: "Vaulted",
  [TabNames.LEADERBOARD]: "Leaderboard",
  [TabNames.YOUR_VAULT]: "Your Vault",
};

const tabExplanations: { [key in TabNames]: ReactNode } = {
  [TabNames.VAULTED]: (
    <div className="space-y-4">
      <div className="">
        Art is created as a complete expression, not as means to another end.
        Art is created to exist, not burned for value. Art is the journey we are
        all on together, and we hope to pass it on to our children.
      </div>
      <div className="text-gray-400">
        Vault your ‘First Day Out’ in the Vaulted contract. The number of pieces
        vaulted and how long they’ve been vaulted for are recorded in an
        on-chain leaderboard, which gives the most fervent collectors
        opportunities to walk alongside Drift’s journey, including special
        events, signed prints, in-person dinners and climbs, and more.
      </div>
    </div>
  ),
  [TabNames.LEADERBOARD]: `Store your First Day Out pieces in the Vaulted smart contract and build up vaulted points to access special experiences with Drift. Vault points are based on how many pieces you vault and how long they’ve been vaulting, with additional multiples for locking up your pieces for longer time periods.`,
  [TabNames.YOUR_VAULT]: (
    <div>
      See your vaulted NFTs and the points you’ve accumulated. To unvault an
      eligible piece, select it and press “Unvault”. If a piece is still in
      lockup, you’ll need to wait until that date to unvault.
    </div>
  ),
};

export const Vaulted = () => {
  const [currentTab, setCurrentTab] = useState<TabNames>(TabNames.VAULTED);
  const { state } = useContext(StateContext);

  const tabData: { [key in TabNames]: ReactNode } = {
    [TabNames.VAULTED]: null,
    [TabNames.LEADERBOARD]: (
      <div className="px-8 py-2 border border-sprite-green text-sprite-green w-48 text-center mt-2">
        {state.leaderboard?.loading ? (
          <Spinner />
        ) : (
          <>
            {state.leaderboard?.position ? (
              <>
                Position #{state.leaderboard.position}{" "}
                <span className="opacity-50">
                  / {state.leaderboard.totalPositions}
                </span>
              </>
            ) : (
              "No position"
            )}
          </>
        )}
      </div>
    ),
    [TabNames.YOUR_VAULT]: (
      <div className="px-8 py-2 border w-48 text-center border-blue-purple text-blue-purple mt-2">
        {state.vault?.loading ? (
          <Spinner />
        ) : (
          <>{numberFormatter.format(Number(state.vault?.points)) ?? 0} points</>
        )}
      </div>
    ),
  };

  return (
    <TransactionContextWrapper>
      <div className="w-full mt-16">
        <div className="sm:h-64 md:h-56">
          <div className="text-6xl text-[64px] font-serif">
            {tabTitles[currentTab]}
          </div>
          <div className="my-6">{tabData[currentTab]}</div>
          <div className="mt-2">{tabExplanations[currentTab]}</div>
        </div>
        <div className="mt-8">
          <div className="text-gray-500 border-t border-l border-r border-[#5c5c5c] flex">
            {Object.values(TabNames).map((tabName) => {
              return (
                <a
                  key={tabName}
                  className={cx({
                    "text-white bg-[#161616]": currentTab === tabName,
                    "transition-colors h-full flex py-3 w-[12rem] justify-center":
                      true,
                  })}
                  onClick={() => setCurrentTab(tabName)}
                >
                  <span className="text-2xl px-6 relative cursor-pointer">
                    {tabName}
                  </span>
                </a>
              );
            })}
          </div>
          <div className="mb-4">
            {currentTab === TabNames.VAULTED && <Wallet active />}
            {currentTab === TabNames.YOUR_VAULT && <Vault active />}
            {currentTab === TabNames.LEADERBOARD && <Leaderboard active />}
          </div>
        </div>
      </div>
    </TransactionContextWrapper>
  );
};
