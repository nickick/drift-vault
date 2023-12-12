export const dynamic = "force-dynamic";

import { recoverAddress } from "@/app/api/utils/recoverAddress";
import { db } from "@/app/api/utils/db/getDb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";
import { auth } from "@/app/api/utils/auth";

const PostBody = z
  .object({
    msg: z.string(),
    sig: z.string(),
  })
  .strict();

export async function POST(request: Request) {
  const data = await request.json();
  const { msg, sig } = PostBody.parse(data);
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session");

  try {
    let address: string | undefined | null;

    address = await recoverAddress({
      msg,
      sig,
    });

    if (!address) {
      return NextResponse.json({ success: false, error: "Invalid signature" });
    }

    // Delete old Session if exists
    if (sessionId) await auth(db).deleteSession(sessionId.value);

    // Create Session
    const newSessionId = await auth(db).createSession(address!);

    return new Response(JSON.stringify({ address, verified: true }), {
      status: 200,
      headers: {
        "Set-Cookie": `session=${newSessionId}; HttpOnly; Secure; Path=/; Max-Age=31536000; SameSite=Strict`,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: (err as any).message ?? "Something went wrong.",
    });
  }
}
