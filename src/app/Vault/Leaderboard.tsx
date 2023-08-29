import React from "react";
import { Tab } from "./Tab";

type LeaderboardProps = {
  active: boolean;
};

export const Leaderboard = (props: LeaderboardProps) => {
  return (
    <Tab active={props.active}>
      <div className="flex flex-col w-full p-4 border-l border-b border-r border-gray-500">
        <h2 className="text-xl">Leaderboard</h2>
      </div>
    </Tab>
  );
};
