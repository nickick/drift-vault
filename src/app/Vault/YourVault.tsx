import React from "react";
import { Tab } from "./Tab";

type YourVaultProps = {
  active: boolean;
};

export const YourVault = (props: YourVaultProps) => {
  return <Tab active={props.active}>Your Vault</Tab>;
};
