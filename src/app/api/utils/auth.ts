import { randomBytes } from "crypto";
import type { Kysely } from "kysely";
import type { Database } from "@/../types/db";

// We want to keep the structure, but replace the type of data
type DBSession = Omit<Database["sessions"], "address">;
export interface Session extends DBSession {
  address: string;
}

const isSessionExpired = (session: Database["sessions"]) =>
  !session.expires_at || session.expires_at < new Date();

export class Auth {
  db: Kysely<Database>;

  constructor(db: Kysely<Database>) {
    this.db = db;
  }

  /// Create a session in the DB, returning the sessionId
  async createSession(address: string): Promise<string> {
    const sessionId = randomBytes(8).toString("hex");
    await this.db
      .insertInto("sessions")
      .values({ id: sessionId, address })
      .execute();
    return sessionId;
  }

  /// Load a session if it exists
  async loadSession(sessionId: string | undefined): Promise<Session | null> {
    console.log(`Loading session: ${sessionId}`);
    if (!sessionId) {
      return null;
    }

    const session = await this.db
      .selectFrom("sessions")
      .select(["id", "expires_at", "address"])
      .where("id", "=", sessionId)
      .executeTakeFirst();

    console.log(`Session retrieved: ${!!session}`);
    if (!session) {
      return null;
    } else if (isSessionExpired(session)) {
      console.log(`Session expired: ${session.expires_at}`);
      return null;
    }

    return {
      ...(session as Database["sessions"]),
      address: session?.address || "",
    };
  }

  /// Remove a session from the DB
  async deleteSession(sessionId?: string): Promise<void> {
    const session = await this.loadSession(sessionId);

    if (!session) return;

    await this.db
      .deleteFrom("sessions")
      .where("id", "=", session.id)
      .executeTakeFirst();
  }

  /// Authenticate a user or throw an error
  async authorize(sessionId?: string): Promise<Database["sessions"]> {
    const session = await this.loadSession(sessionId);

    if (!session) throw new Error("Unauthorized: Not logged in");

    if (!session.address) throw new Error("Unauthorized: Invalid session");

    return session;
  }
}

export const auth = (db: Kysely<Database>) => {
  return new Auth(db);
};

export default auth;
