export const dynamic = "force-dynamic";
import { auth } from "@/app/api/utils/auth";
import { db } from "@/app/api/utils/db/getDb";
import CryptoJS from "crypto-js";
import { sql } from "kysely";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Config } from "sst/node/config";
import { uuid } from "uuidv4";
import z from "zod";

const PostBody = z
  .object({
    stripeUrlIdentifier: z.string(),
  })
  .strict();

// route to create a link or retrieve an existing, unused one
// this route can then be navigated to and resolves to a stripe checkout form with
// a uuid that can be decrypted and referenced for making sure the payment was valid
// from a user that should have been allowed to make the payment, ie someone on the snapshot leaderboard
export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session");

  try {
    const session = await auth(db).loadSession(sessionId?.value);

    const data = await request.json();
    const { stripeUrlIdentifier } = PostBody.parse(data);

    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid session" });
    } else {
      const identifier = CryptoJS.AES.encrypt(
        `${session.address} - ${Date.now()}`,
        Config.PASSPHRASE
      ).toString();

      const existingLink = await db
        .selectFrom("links")
        .select(["id", "stripeUrlIdentifier", "resolved_link"])
        .where("address", "=", session.address)
        .where("stripeUrlIdentifier", "=", stripeUrlIdentifier)
        .execute();

      if (existingLink[0]) {
        return NextResponse.json({
          success: true,
          link: existingLink[0],
        });
      } else {
        const id = uuid();

        const link = await db
          .insertInto("links")
          .values({
            id: sql`${id}::uuid`,
            address: session.address,
            stripeUrlIdentifier,
            resolved_link: `https://buy.stripe.com/${stripeUrlIdentifier}?client_reference_id=${encodeURIComponent(
              identifier
            )}`,
          })
          .returning(["id", "stripeUrlIdentifier", "resolved_link"])
          .executeTakeFirstOrThrow();

        return NextResponse.json({ success: true, link });
      }
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: (err as any).message ?? "Something went wrong.",
    });
  }
}
