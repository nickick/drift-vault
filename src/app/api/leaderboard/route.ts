import { Alchemy, Network } from "alchemy-sdk";
import { NextResponse } from "next/server";
import { goerli } from "viem/chains";

export async function GET(request: Request) {
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network:
      process.env.NEXT_PUBLIC_CHAIN_NAME === goerli.name
        ? Network.ETH_GOERLI
        : Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(settings);

  const transfersRes = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest",
    contractAddresses: [process.env.NEXT_PUBLIC_VAULT_ADDRESS!],
    excludeZeroValue: false,
    category: ["external"] as any,
    withMetadata: true,
  });

  const vaultTransfers = transfersRes.transfers.filter(
    (transfer) => transfer
    // transfer.to?.toLowerCase() ===
    // process.env.NEXT_PUBLIC_VAULT_ADDRESS?.toLowerCase()
  );

  try {
    return NextResponse.json({
      transfers: vaultTransfers,
      settings,
      to: process.env.NEXT_PUBLIC_VAULT_ADDRESS,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}
