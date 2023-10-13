"use client";

import { ReactNode, useState } from "react";
import { TransactionContextWrapper } from "../TransactionContext";
import { Leaderboard } from "./Leaderboard";
import { Vaulted } from "./Vaulted";
import { YourVault } from "./YourVault";

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

const tabData: { [key in TabNames]: ReactNode } = {
  [TabNames.VAULTED]: null,
  [TabNames.LEADERBOARD]: (
    <div className="px-8 py-2 rounded-full border w-48 text-center mt-2">
      No ranking
    </div>
  ),
  [TabNames.YOUR_VAULT]: (
    <div className="px-8 py-2 rounded-full border w-48 text-center mt-2">
      0 points
    </div>
  ),
};

const tabExplanations: { [key in TabNames]: ReactNode } = {
  [TabNames.VAULTED]: (
    <div className="space-y-4">
      <div className="font-bold">
        Art is created as a complete expression, not as means to another end.
        Art is created to exist, not burned for value. Art is the journey we are
        all on together, and we hope to pass it on to our children.
      </div>
      <div>
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

export const Vault = () => {
  const [currentTab, setCurrentTab] = useState<TabNames>(TabNames.VAULTED);

  return (
    <TransactionContextWrapper>
      <div className="w-full">
        <div className="px-4 h-48">
          <div className="text-3xl font-serif">{tabTitles[currentTab]}</div>
          <div>{tabData[currentTab]}</div>
          <div className="mt-2">{tabExplanations[currentTab]}</div>
        </div>
        <div className="mt-8">
          <div className="text-gray-500">
            {Object.values(TabNames).map((tabName) => {
              return (
                <a
                  key={tabName}
                  className={`${
                    currentTab === tabName ? "text-white" : ""
                  } transition-colors`}
                  onClick={() => setCurrentTab(tabName)}
                >
                  <span className="text-xl px-6 pt-2 pb-2 border-t border-l border-r rounded-ss-md rounded-se-md relative bottom-[5px] cursor-pointer border-gray-500">
                    {tabName}
                  </span>
                </a>
              );
            })}
          </div>
          <div className="mb-4">
            {currentTab === TabNames.VAULTED && <Vaulted active />}
            {currentTab === TabNames.YOUR_VAULT && <YourVault active />}
            {currentTab === TabNames.LEADERBOARD && <Leaderboard active />}
          </div>
        </div>
      </div>
    </TransactionContextWrapper>
  );
};
