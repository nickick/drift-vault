import { fetchNfts } from "@/utils/fetchNfts";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wallet = url.pathname.split("/")[3];
  const contract = url.pathname.split("/")[4];
  try {
    const walletString = wallet as string;

    const { nfts } = await fetchNfts(walletString, contract);

    return NextResponse.json(nfts);
  } catch (err: any) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}
