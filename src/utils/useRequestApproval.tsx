import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import manifoldAbi from "../app/manifoldAbi.json";
import { useCallback, useEffect, useState } from "react";

const useRequestApproval = (approval: boolean) => {
  const { address } = useAccount();
  const { data: isAlreadyApproved } = useContractRead({
    abi: manifoldAbi,
    address: process.env.NEXT_PUBLIC_CREATOR_ADDRESS as `0x${string}`,
    functionName: "isApprovedForAll",
    args: [
      address ?? "0x0",
      process.env.NEXT_PUBLIC_VAULTED_ADDRESS as `0x${string}`,
    ],
  });

  const { config } = usePrepareContractWrite({
    abi: manifoldAbi,
    address: process.env.NEXT_PUBLIC_CREATOR_ADDRESS as `0x${string}`,
    functionName: "setApprovalForAll",
    args: [process.env.NEXT_PUBLIC_VAULTED_ADDRESS as `0x${string}`, approval],
  });

  const write = useContractWrite(config);

  return {
    isAlreadyApproved,
    ...write,
  };
};

export { useRequestApproval };
