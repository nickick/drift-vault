import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, fallback, http } from "viem";
import { goerli, mainnet } from "viem/chains";
import { getPointsForVaulted } from "../utils/leaderboard";
import fs from "fs";
import { Config } from "sst/node/config";

const isProd = process.env.NEXT_PUBLIC_CHAIN_NAME != goerli.name.toLowerCase();

// This is similar to the leaderboard route, except that this requires a password to run
// and saves a CSV locally. This is meant to be run on locally and then have the saved
// snapshot CSV uploaded to Github to allow for inspection of the snapshot data.
export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== Config.SNAPSHOT_PASSWORD) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

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

  const addressMapping = Object.keys(addressToTokenIds).map((address) => {
    const addressString = address as `0x${string}`;
    const addressInfo = addressToTokenIds[addressString];
    return {
      address,
      ...addressInfo,
      dailyPoints: addressInfo.cumulativeMultiplier * 864,
    };
  });

  const date = new Date();

  fs.writeFileSync(
    `./snapshots/${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}.json`,
    JSON.stringify(addressMapping)
  );

  try {
    return NextResponse.json({
      addressMapping,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}
