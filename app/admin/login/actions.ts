"use server";

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
  formData: FormData
): Promise<LoginResult> {
  const email = formData.get("email");
  const password = formData.get("password");

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

    return { success: true };
  } catch {
    return { success: false, error: "Login failed. Please try again." };
  }
}

export async function logout(): Promise<void> {
  await deleteSessionCookie();
}
