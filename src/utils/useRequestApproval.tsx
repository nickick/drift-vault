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
  const { data: isAlreadyApproved, isSuccess: isExistingApprovalLoaded } =
    useContractRead({
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
  const [triggered, setTriggered] = useState<boolean>(false);

  useEffect(() => {
    function approveContract() {
      setTriggered(false);
      write.write?.();
    }

    if (triggered && isExistingApprovalLoaded && !isAlreadyApproved) {
      approveContract();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggered, isExistingApprovalLoaded, isAlreadyApproved]);

  function trigger() {
    setTriggered(true);
  }

  return {
    trigger,
    ...write,
  };
};

export { useRequestApproval };
