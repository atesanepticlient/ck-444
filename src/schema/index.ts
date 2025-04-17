import zod from "zod";

export const registerSchema = zod
  .object({
    phone: zod
      .string()
      .min(1, "Phone Number is required")
      .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, "Invalid Phone Number"),
    password: zod
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: zod.string(),
    ageCheck: zod.optional(zod.boolean()),
    bonusCheck: zod.optional(zod.boolean()),
    referralId: zod.optional(zod.string()),
  })
  .refine(
    ({ password, confirmPassword }) => {
      if (password && confirmPassword) {
        if (password !== confirmPassword) {
          return false;
        }
      }
      return true;
    },
    { path: ["confirmPassword"], message: "Confirm Password didn't match" }
  );

export const loginSchema = zod.object({
  phone: zod
    .string()
    .min(1, "Phone Number is required")
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, "Invalid Phone Number"),
  password: zod.string(),
});
