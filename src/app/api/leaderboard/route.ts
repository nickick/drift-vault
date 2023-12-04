import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { NextResponse } from "next/server";
import { createPublicClient, fallback, http } from "viem";
import { goerli, mainnet } from "viem/chains";
import vaultedABI from "@/app/vaultedAbi.json";
import PromisePool from "@supercharge/promise-pool";

const isProd = process.env.NEXT_PUBLIC_CHAIN_NAME != goerli.name.toLowerCase();

type Vaulted = [bigint, string, bigint, bigint, bigint, bigint];

function getPoints(
  tokenId: number,
  publicClient: ReturnType<typeof createPublicClient>
) {
  return publicClient.readContract({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
    abi: vaultedABI,
    functionName: "calculatePoints",
    args: [tokenId, process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS!],
  }) as Promise<bigint>;
}

async function getVaulted(
  tokenId: number,
  publicClient: ReturnType<typeof createPublicClient>
) {
  return publicClient.readContract({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
    abi: vaultedABI,
    functionName: "contractTokenIdToVaulting",
    args: [process.env.NEXT_PUBLIC_VAULT_FROM_ADDRESS!, tokenId],
  }) as Promise<Vaulted>;
}

export async function GET(request: Request) {
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network:
      process.env.NEXT_PUBLIC_CHAIN_NAME === goerli.name.toLowerCase()
        ? Network.ETH_GOERLI
        : Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(settings);

  const transfersRes = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest",
    toAddress: process.env.NEXT_PUBLIC_VAULT_ADDRESS,
    excludeZeroValue: true,
    category: [AssetTransfersCategory.ERC721] as any,
  });

  const addressToTokenIds: {
    [key: `0x${string}`]: {
      tokenIds: number[];
      points: number;
      numPieces: number;
      cumulativeMultiplier: number;
    };
  } = {};

  for (const transfer of transfersRes.transfers) {
    const from = transfer.from as `0x${string}`;
    const tokenId = transfer.tokenId
      ? parseInt(transfer.tokenId ?? "", 16)
      : -1;
    if (!addressToTokenIds[from]) {
      addressToTokenIds[from] = {
        tokenIds: [],
        points: 0,
        numPieces: 0,
        cumulativeMultiplier: 0,
      };
    }
    if (!addressToTokenIds[from].tokenIds.includes(tokenId)) {
      addressToTokenIds[from].tokenIds.push(tokenId);
    }
  }

  const addressTokenIds = Object.keys(addressToTokenIds)
    .map((address) => {
      return addressToTokenIds[address as `0x${string}`].tokenIds.map(
        (tokenId) => [address, tokenId]
      );
    })
    .flat();

  const publicClient = createPublicClient({
    chain: isProd ? mainnet : goerli,
    transport: fallback([
      http(
        `https://eth-${isProd ? "mainnet" : "goerli"}.g.alchemy.com/v2/${
          process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
        }`
      ),
    ]),
  });

  await PromisePool.withConcurrency(2)
    .for(addressTokenIds)
    .process(async (data) => {
      const tokenId = data[1] as number;
      const points = await getPoints(tokenId, publicClient);
      const vaulted = await getVaulted(tokenId, publicClient);
      const address = data[0] as `0x${string}`;

      addressToTokenIds[address].points += Number(points);
      addressToTokenIds[address].cumulativeMultiplier += Number(vaulted[3]);
      if (Number(points) > 0) {
        addressToTokenIds[address].numPieces++;
      }
    });

  try {
    return NextResponse.json({
      transferMap: addressToTokenIds,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}
