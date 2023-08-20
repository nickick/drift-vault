"use client";

import React, { useState } from "react";
import { Vaulted } from "./Vaulted";
import { YourVault } from "./YourVault";
import { Leaderboard } from "./Leaderboard";
import { TransactionContextWrapper } from "../TransactionContext";

enum TabNames {
  VAULTED = "Vaulted",
  YOUR_VAULT = "Your Vault",
  LEADERBOARD = "Leaderboard",
}

export const Vault = () => {
  const [currentTab, setCurrentTab] = useState<TabNames>(TabNames.VAULTED);

  const tabExplanations: { [key in TabNames]: React.ReactNode } = {
    [TabNames.VAULTED]:
      "[vaulted] Store your First Day Out pieces in the Vaulted smart contract and build up vaulted points to access special experiences with Drift. Vault points are based on how many pieces you vault and how long they’ve been vaulting, with additional multiples for locking up your pieces for longer time periods.",
    [TabNames.LEADERBOARD]: `[leaderboard] Store your First Day Out pieces in the Vaulted smart contract and build up vaulted points to access special experiences with Drift. Vault points are based on how many pieces you vault and how long they’ve been vaulting, with additional multiples for locking up your pieces for longer time periods.`,
    [TabNames.YOUR_VAULT]:
      "[your vault] Store your First Day Out pieces in the Vaulted smart contract and build up vaulted points to access special experiences with Drift. Vault points are based on how many pieces you vault and how long they’ve been vaulting, with additional multiples for locking up your pieces for longer time periods.",
  };

  return (
    <TransactionContextWrapper>
      <div className="w-full space-y-4">
        <div className="text-3xl font-serif">{currentTab}</div>
        <div className="h-16">{tabExplanations[currentTab]}</div>
        <div className="">
          <div className="tabs">
            {Object.values(TabNames).map((tabName) => {
              return (
                <a
                  key={tabName}
                  className={`tab tab-bordered ${
                    currentTab === tabName ? "tab-active" : ""
                  }`}
                  onClick={() => setCurrentTab(tabName)}
                >
                  {tabName}
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
