"use server";
import zod from "zod";
import { registerSchema } from "@/schema";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { findUserByPhone, findUserByReferId } from "@/data/user";
import { playerIdGenerate, referIdGenerate } from "@/lib/helpers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LOGIN_SUCCESS } from "@/success";
import { CredentialsSignin } from "next-auth";
export const register = async (data: zod.infer<typeof registerSchema>) => {
  try {
    const {
      password,
      confirmPassword,
      phone,
      ageCheck,
      bonusCheck,
      referralId,
    } = data;

    if (password !== confirmPassword) {
      return { error: "Confirm Password Did not match" };
    }
    if (!ageCheck) {
      return { error: "Read Out age Restrictions" };
    }

    const existingUserWithPhone = await findUserByPhone(phone);

    if (existingUserWithPhone) {
      return { error: "Number is already registered" };
    }

    let isReferralBonusActive = false;

    if (referralId) {
      const referralUser = await findUserByReferId(referralId);
      // TODO : update referral user
      isReferralBonusActive = !!referralUser;
    }

    const playerId = await playerIdGenerate();
    const referId = await referIdGenerate();
    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        phone,
        password: hasedPassword,
        playerId: playerId!,
        referId,
        isBanned: false,
        wallet: {
          create: {
            balance: 0,
            signinBonus: bonusCheck,
            referralBonus: isReferralBonusActive,
          },
        },
      },
    });

    try {
      await signIn("credentials", {
        phone: newUser.phone,
        password,
        redirect: false,
      });
    } catch (error) {
      const credentialsError = error as CredentialsSignin;
      return { error: credentialsError?.cause?.err?.message };
    }

    return { success: LOGIN_SUCCESS };
  } catch (error) {
    console.log({ error });
    return { error: INTERNAL_SERVER_ERROR };
  }
};
