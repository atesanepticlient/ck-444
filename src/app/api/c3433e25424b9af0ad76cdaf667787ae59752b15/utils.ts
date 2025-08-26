// app/api/c3433e25424b9af0ad76cdaf667787ae59752b15/utils.ts
import { db } from "@/lib/db";

export const COMPANY_KEY = "F4D8A3106EA44C5D969D0AAE0B472762"; // from the test harness

export type HarnessStatus = "Running" | "Settled" | "Void";

export function ok<T extends Record<string, any>>(obj: T) {
  return Response.json(obj, { status: 200 });
}
export function err(code: number, message: string, extra?: Record<string, any>) {
  return Response.json({ ErrorCode: code, ErrorMessage: message, ...(extra ?? {}) }, { status: 200 });
}

export async function requireJson<T>(req: Request): Promise<T> {
  try {
    return await req.json() as T;
  } catch {
    throw new Error("Bad JSON");
  }
}

export async function validateCompanyAndUsername(
  body: any,
  opts?: { includeBalanceWhenError?: boolean }
) {
  // Username empty => ErrorCode 3
  if (!("Username" in body) || typeof body.Username !== "string" || body.Username.trim() === "") {
    const extra = opts?.includeBalanceWhenError ? { Balance: 0.0 } : {};
    return err(3, "Missing parameter", extra);
  }
  // Wrong company key => ErrorCode 4
  if (body.CompanyKey !== COMPANY_KEY) {
    const extra = opts?.includeBalanceWhenError ? { Balance: 0.0 } : {};
    return err(4, "Wrong Company Key", extra);
  }
  return null;
}

export async function findUserWithWallet(playerId: string) {
  return db.user.findUnique({
    where: { playerId },
    include: { wallet: true },
  });
}

export function ensureBalanceNumber(n?: number | null) {
  // Harness wants not-null. Default to 0.0 if unknown.
  if (typeof n === "number" && !Number.isNaN(n)) return n;
  return 0.0;
}

// Map harness ResultType -> text we store (optional) and wallet math intent
export function resultTypeToText(resultType: number) {
  return resultType === 0 ? "WON" : resultType === 1 ? "LOST" : "TIE";
}
