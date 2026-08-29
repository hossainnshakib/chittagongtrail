"use server";

import { redirect } from "next/navigation";
import {
  getAdminCredentials,
  verifyPassword,
  createSession,
  setSessionCookie,
  deleteSessionCookie,
} from "@/lib/auth";

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function login(
  _prevState: LoginResult,
  data: FormData | { email: string; password: string }
): Promise<LoginResult> {
  const email = data instanceof FormData
    ? (data.get("email") as string)
    : data.email;
  const password = data instanceof FormData
    ? (data.get("password") as string)
    : data.password;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    const credentials = getAdminCredentials();

    if (email !== credentials.email) {
      return { success: false, error: "Invalid email or password" };
    }

    const valid = await verifyPassword(password, credentials.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid email or password" };
    }

    const token = await createSession(email);
    await setSessionCookie(token);
  } catch {
    return { success: false, error: "Login failed. Please try again." };
  }

  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteSessionCookie();
}
