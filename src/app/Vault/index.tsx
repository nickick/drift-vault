"use client";

import { ReactNode, useContext, useState, useEffect } from "react";
import { TransactionContextWrapper } from "../TransactionContext";
import { Leaderboard } from "./Leaderboard";
import { Wallet } from "./Wallet";
import { Vault } from "./Vault";
import { StateContext } from "../AppState";
import { Spinner } from "../Spinner";
import { numberFormatter } from "@/utils/format";
import cx from "classnames";
import { useIsMobile } from "@/utils/useIsMobile";
import { Moments } from "./Moments";

enum TabNames {
  VAULTED = "Wallet",
  YOUR_VAULT = "Vault",
  LEADERBOARD = "Leaderboard",
  MOMENTS = "Moments",
}

const tabTitles: { [key in TabNames]: ReactNode } = {
  [TabNames.VAULTED]: "Vaulted",
  [TabNames.LEADERBOARD]: "Leaderboard",
  [TabNames.YOUR_VAULT]: "Your Vault",
  [TabNames.MOMENTS]: "Moments",
};

const tabExplanations: { [key in TabNames]: ReactNode } = {
  [TabNames.VAULTED]: (
    <div className="space-y-4 font-sans">
      <div className="text-sm leading-6 sm:text-lg sm:leading-1 text-center sm:text-left">
        Art is created as a complete expression, not as means to another end.
        Art is created to exist, not burned for value. Art is the journey we are
        all on together, and we hope to pass it on to our children.
      </div>
      <div className="text-slate-gray hidden sm:block">
        Vault your ‘First Day Out’ in the Vaulted contract. The number of pieces
        vaulted and how long they’ve been vaulted for are recorded in an
        on-chain leaderboard, which gives the most fervent collectors
        opportunities to walk alongside Drift’s journey, including special
        events, signed prints, in-person dinners and climbs, and more.
      </div>
    </div>
  ),
  [TabNames.LEADERBOARD]: (
    <div className="font-sans">
      <div className="hidden sm:block">
        Store your First Day Out pieces in the Vaulted smart contract and build
        up vaulted points to access special experiences with Drift. Vault points
        are based on how many pieces you vault and how long they’ve been
        vaulting, with additional multiples for locking up your pieces for
        longer time periods.
      </div>
      <div className="block sm:hidden text-center text-sm leading-6">
        See your on-chain Vaulted ranking alongside your fellow collectors.
        Vaulted points provide you with opportunities to walk alongside Drift on
        the journey of a lifetime.
      </div>
    </div>
  ),
  [TabNames.YOUR_VAULT]: (
    <div className="font-sans">
      See your vaulted NFTs and the points you’ve accumulated. To unvault an
      eligible piece, select it and press “Unvault”. If a piece is still in
      lockup, you’ll need to wait until that date to unvault.
    </div>
  ),
  [TabNames.MOMENTS]: (
    <div className="space-y-4 font-sans">
      <div className="text-sm leading-6 sm:text-lg sm:leading-1 text-center sm:text-left">
        Art is created as a complete expression, not as means to another end.
        Art is created to exist, not burned for value. Art is the journey we are
        all on together, and we hope to pass it on to our children.
      </div>
      <div className="text-slate-gray hidden sm:block">
        Vault your ‘First Day Out’ in the Vaulted contract. The number of pieces
        vaulted and how long they’ve been vaulted for are recorded in an
        on-chain leaderboard, which gives the most fervent collectors
        opportunities to walk alongside Drift’s journey, including special
        events, signed prints, in-person dinners and climbs, and more.
      </div>
    </div>
  ),
};

export const Vaulted = () => {
  const [currentTab, setCurrentTab] = useState<TabNames>(TabNames.VAULTED);
  const { state, setState } = useContext(StateContext);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && currentTab === TabNames.YOUR_VAULT) {
      setCurrentTab(TabNames.VAULTED);
    }
  }, [isMobile, currentTab]);

  const tabData: { [key in TabNames]: ReactNode } = {
    [TabNames.VAULTED]: null,
    [TabNames.LEADERBOARD]: (
      <div className="px-12 py-2 border max-w-fit text-center border-sprite-green text-sprite-green mt-2 font-medium font-sans">
        {state.leaderboard?.loading ? (
          <div className="px-8">
            <Spinner />
          </div>
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
      <div className="px-12 py-2 border max-w-fit text-center border-blue-purple text-blue-purple mt-2 font-medium font-sans">
        {state.vault?.loading ? (
          <div className="px-8">
            <Spinner />
          </div>
        ) : (
          <>{numberFormatter.format(Number(state.vault?.points)) ?? 0} points</>
        )}
      </div>
    ),
    [TabNames.MOMENTS]: null,
  };

  return (
    <TransactionContextWrapper>
      <div className="w-full mt-4 sm:mt-16">
        <div className="sm:h-64 md:h-56">
          <div className="text-5xl sm:text-6xl text-[64px] font-serif text-center sm:text-left">
            {tabTitles[currentTab]}
          </div>
          <div className="my-6 hidden sm:block">{tabData[currentTab]}</div>
          <div className="px-4 sm:px-0 mt-2">{tabExplanations[currentTab]}</div>
        </div>
        <div className="mt-8">
          <div className="text-slate-gray border-t border-l border-r border-black sm:border-border-gray flex">
            {Object.values(TabNames).map((tabName) => {
              return (
                <a
                  key={tabName}
                  className={cx({
                    "text-white bg-[#161616]": currentTab === tabName,
                    "text-white text-opacity-30": currentTab !== tabName,
                    "transition-colors h-full flex py-3 w-[12rem] justify-center font-sans":
                      true,
                    "hidden sm:flex": tabName === TabNames.YOUR_VAULT,
                  })}
                  onClick={() => setCurrentTab(tabName)}
                >
                  <span className="text-2xl px-6 relative cursor-pointer">
                    {tabName}
                  </span>
                </a>
              );
            })}
            {currentTab === TabNames.LEADERBOARD ? (
              <div className="form-control absolute top-2 right-2 hidden sm:block">
                <label className="label cursor-pointer">
                  <span
                    className={cx({
                      "label-text mr-2 transition-opacity": true,
                      "opacity-20": !state.demoMode,
                    })}
                  >
                    Demo mode
                  </span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={state.demoMode}
                    onChange={(e) => setState({ demoMode: !state.demoMode })}
                  />
                </label>
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            {currentTab === TabNames.VAULTED && <Wallet active />}
            <div className="hidden sm:flex">
              {currentTab === TabNames.YOUR_VAULT && <Vault active />}
            </div>
            {currentTab === TabNames.LEADERBOARD && <Leaderboard active />}
            {currentTab === TabNames.MOMENTS && <Moments active />}
          </div>
        </div>
      </div>
    </TransactionContextWrapper>
  );
};
