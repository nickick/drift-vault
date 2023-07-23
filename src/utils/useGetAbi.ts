/**
 * Use this hook to get the ABI of a contract
 */

import { useCallback, useEffect, useState } from "react";

const useGetAbi: (
  address: `0x${string}`,
  chainId: number
) => {
  data: { status: string; message: string; result: string } | null;
  isLoading: boolean;
  error: string | null;
} = (address, chainId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAbi = useCallback(() => {
    if (address && chainId) {
      setIsLoading(true);
      const url =
        chainId === 1
          ? "https://api.etherscan.io"
          : "https://api-goerli.etherscan.io";

      fetch(
        `${url}/api?module=contract&action=getabi&address=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      )
        .then((res) => res.json())
        .then((res) => {
          setData(res);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setError(err);
        });
    }
  }, [address, chainId]);

  useEffect(() => {
    getAbi();
  }, [getAbi]);

  return { data, isLoading, error };
};

export { useGetAbi };
