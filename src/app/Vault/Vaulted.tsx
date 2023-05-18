import React from "react";
import { Tab } from "./Tab";

type VaultedProps = {
  active: boolean;
};

export const Vaulted = (props: VaultedProps) => {
  return <Tab active={props.active}>Vaulted</Tab>;
};
