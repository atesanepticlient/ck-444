import { auth } from "@/auth";
import { db } from "@/lib/db";

export const findUserById = async (id: string) => {
  return await db.user.findUnique({ where: { id } });
};

export const findUserByPhone = async (phone: string) => {
  return await db.user.findUnique({ where: { phone } });
};

export const findUserByPlayerId = async (playerId: string) => {
  return await db.user.findUnique({ where: { playerId } });
};

export const findUserByReferId = async (referId: string) => {
  return await db.user.findUnique({ where: { referId } });
};

export const findCurrentUser = async () => {
  const session = await auth();
  console.log("session ", session);
  return session?.user;
};
