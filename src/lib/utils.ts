/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number): string {
  return amount.toLocaleString("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getCurrencySymbol(currencyCode: string): string | null {
  try {
    const formatter = new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const parts = formatter.formatToParts(1);
    const symbolPart = parts.find((part) => part.type === "currency");
    return symbolPart?.value || null;
  } catch {
    return null;
  }
}

export function generateTrxId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let trxid = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    trxid += chars[randomIndex];
  }
  return trxid;
}

export function generateSignature(
  accessKey: string,
  privateKey: string,
  transactions: any
): string {
  // Create JSON string with unescaped slashes and unicode
  const json = JSON.stringify(transactions);

  // Create MD5 hash of the JSON
  const md5Hash = crypto.createHash("md5").update(json).digest("hex");

  // Concatenate accessKey + privateKey + md5Hash
  const combined = accessKey + privateKey + md5Hash;

  // Create final SHA1 signature
  const sha1Signature = crypto
    .createHash("sha1")
    .update(combined)
    .digest("hex");

  return sha1Signature;
}
