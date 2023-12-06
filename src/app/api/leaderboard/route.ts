import { NextResponse } from "next/server";
import { createPublicClient, fallback, http } from "viem";
import { goerli, mainnet } from "viem/chains";
import { getPointsForVaulted } from "../utils/leaderboard";

const isProd = process.env.NEXT_PUBLIC_CHAIN_NAME != goerli.name.toLowerCase();

export async function GET(request: Request) {
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

  const addressToTokenIds = await getPointsForVaulted(publicClient);

  try {
    return NextResponse.json({
      transferMap: addressToTokenIds,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}
