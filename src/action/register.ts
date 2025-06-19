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

    let invitedBy = {};
    const referralUser = await findUserByReferId(referralId || "");
    if (referralId && referralUser) {
      if (referralUser) {
        await db.invitationBonus.update({
          where: { userId: referralUser!.id },
          data: { totalRegisters: { increment: 1 } },
        });

        isReferralBonusActive = !!referralUser;
        invitedBy = {
          create: {
            user: {
              connect: {
                id: referralUser.id,
              },
            },
          },
        };
      }
    }
    console.log({ invitedBy });
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
        invitedBy: {
          ...invitedBy,
        },
        bettingRecord: { create: {} },
        wallet: {
          create: {
            balance: 0,
            signinBonus: bonusCheck,
            referralBonus: isReferralBonusActive,
          },
        },
        inviationBonus: {
          create: {},
        },
      },
    });

    if (referralId && referralUser) {
      await db.invitation.update({
        where: {
          userId: referralUser.id,
        },
        data: {
          referredUsers: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });
    }
    try {
      await signIn("credentials", {
        phone: newUser.phone,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== "AccessDenied") {
          const credentialsError = error as CredentialsSignin;
          return { error: credentialsError?.cause?.err?.message };
        }
      }
    }

    return { success: LOGIN_SUCCESS };
  } catch (error) {
    console.log({ error });
    return { error: INTERNAL_SERVER_ERROR };
  }
};
