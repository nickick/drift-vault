import { db, handleError } from "@/app/api/utils";

import { Session } from "@/../types/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import auth from "../utils/auth";

export async function GET() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session");

  try {
    let user: Session | undefined;

    try {
      user = await auth(db).authorize(sessionId?.value);
      if (user) {
        return NextResponse.json({
          success: true,
          address: user.address,
        });
      }
    } catch (err) {
      return NextResponse.json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.log("ERROR:", err);
    return handleError((err as any).message);
  }
}
