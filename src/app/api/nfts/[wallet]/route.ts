import { fetchNfts } from "@/utils/fetchNfts";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wallet = url.pathname.split("/")[3];
  try {
    console.log("wallet", wallet);
    const walletString = wallet as string;

    const { nfts } = await fetchNfts(walletString);

    return NextResponse.json(nfts);
  } catch (err: any) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}
