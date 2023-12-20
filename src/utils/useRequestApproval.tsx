import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import manifoldAbi from "../app/manifoldAbi.json";

const useRequestApproval = ({
  requestingApproval,
}: {
  requestingApproval: boolean;
}) => {
  const { address } = useAccount();
  const {
    data: approved,
    isRefetching,
    refetch,
  } = useContractRead({
    abi: manifoldAbi,
    address: process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`,
    functionName: "isApprovedForAll",
    args: [
      address ?? "0x0",
      process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
    ],
  });

  const { config } = usePrepareContractWrite({
    abi: manifoldAbi,
    address: process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS as `0x${string}`,
    functionName: "setApprovalForAll",
    args: [
      process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
      requestingApproval,
    ],
  });

  const write = useContractWrite(config);

  return {
    approved,
    isRefetching,
    refetch,
    ...write,
  };
};

export { useRequestApproval };
