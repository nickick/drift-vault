import React from "react";
import { Tab } from "./Tab";

type LeaderboardProps = {
  active: boolean;
};

export const Leaderboard = (props: LeaderboardProps) => {
  return <Tab active={props.active}>Leaderboard</Tab>;
};
