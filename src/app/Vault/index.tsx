"use client";

import React, { useState } from "react";
import { Vaulted } from "./Vaulted";
import { YourVault } from "./YourVault";
import { Leaderboard } from "./Leaderboard";
import { TransactionContextWrapper } from "../TransactionContext";

enum TabNames {
  VAULTED = "Wallet",
  YOUR_VAULT = "Vault",
  LEADERBOARD = "Leaderboard",
}

const tabExplanations: { [key in TabNames]: React.ReactNode } = {
  [TabNames.VAULTED]: (
    <div>
      Store your First Day Out pieces in the Vaulted smart contract and build up
      vaulted points to access special experiences with Drift.
      <ul className="list-disc ml-4">
        <li>
          Use the Vaulted panel to choose which NFTs. Select longer lockup
          periods for higher point multipliers.
        </li>
        <li>
          See which NFTs you have vaulted and how many points you&apos;ve
          accumulated. This panel also lets you take NFTs out of the vault.
        </li>
      </ul>
    </div>
  ),
  [TabNames.LEADERBOARD]: `Store your First Day Out pieces in the Vaulted smart contract and build up vaulted points to access special experiences with Drift. Vault points are based on how many pieces you vault and how long they’ve been vaulting, with additional multiples for locking up your pieces for longer time periods.`,
  [TabNames.YOUR_VAULT]: (
    <div>
      See which NFTs you have vaulted and how many points you&apos;ve
      accumulated. This panel also lets you take NFTs out of the vault.
      <ul className="list-disc ml-4">
        <li>
          To unvault a piece, select it by clicking/tapping on it and then using
          the &quot;Unvault&quot; button below.
        </li>
        <li>
          You can only unvault pieces that have passed their lockup period.
        </li>
      </ul>
    </div>
  ),
};

export const Vault = () => {
  const [currentTab, setCurrentTab] = useState<TabNames>(TabNames.VAULTED);

  return (
    <TransactionContextWrapper>
      <div className="w-full">
        <div className="px-4 h-28">
          <div className="text-3xl font-serif">{currentTab}</div>
          <div className="mt-2">{tabExplanations[currentTab]}</div>
        </div>
        <div className="mt-8">
          <div className="text-gray-500">
            {Object.values(TabNames).map((tabName) => {
              return (
                <a
                  key={tabName}
                  className={` ${currentTab === tabName ? "text-white" : ""}`}
                  onClick={() => setCurrentTab(tabName)}
                >
                  <span className="text-xl px-4 pt-1 pb-1 border-t border-l border-r rounded-ss-md rounded-se-md relative bottom-[3px] cursor-pointer border-gray-500">
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
