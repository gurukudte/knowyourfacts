"use server";

import { SignupSchema } from "@/schemas";

const signup = async (values: any) => {
  const validatedFields = SignupSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  return { success: "Email sent!" };
};

export default signup;
