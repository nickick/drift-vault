export function formatUsd(price: number, omitCurrency?: boolean) {
  return `${omitCurrency ? "" : "$"}${price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const formatAddress = (input?: string, chars: number = 3) => {
  if (!input) return null;
  return (
    <>
      {input.substring(0, chars + 2)}&hellip;
      {input.substring(input.length - chars)}
    </>
  );
};

const MAX_INT = BigInt(
  `0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`
);

export { MAX_INT };

export const txnLinkUrl = (txnHash: string) => {
  if (["staging", "dev"].includes(process.env.NEXT_PUBLIC_ENV ?? "")) {
    return `https://goerli.etherscan.io/tx/${txnHash}`;
  } else {
    return `https://etherscan.io/tx/${txnHash}`;
  }
};

export const addressLinkUrl = (address: string) => {
  if (["staging", "dev"].includes(process.env.NEXT_PUBLIC_ENV ?? "")) {
    return `https://goerli.etherscan.io/address/${address}`;
  } else {
    return `https://etherscan.io/address/${address}`;
  }
};

export const numberFormatter = Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatOpenseaLink = (contractAddress: string, tokenId: string) => {
  if (["staging", "dev"].includes(process.env.NEXT_PUBLIC_ENV ?? "")) {
    return `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`;
  } else {
    return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`;
  }
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
