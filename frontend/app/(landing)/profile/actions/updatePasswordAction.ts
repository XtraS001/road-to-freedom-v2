"use server";

import "server-only";
import { z } from "zod";
import { serverRestClient as backendClient } from "@/lib/backend/serverClient";

/**
 * Backend DTO schema (NOT UI schema)
 * Mirrors Spring Boot request
 */
const dtoSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  oldPassword: z.string(),
  passwordResetToken: z.string(),
});

export type UpdatePasswordError = {
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updatePasswordAction(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: UpdatePasswordError }> {
  try {
    console.log("updatepasswordAction2");
    const dto = dtoSchema.parse(raw);

    await backendClient.updatePassword(dto); // generated client call
    console.log("After .updatePassword");
    return { ok: true };
  } catch (err: any) {
    /**
     * Normalize ALL errors here
     * Client must never inspect backend errors directly
     */
    console.log("Error in updatePasswordAction:", err);
    // Spring validation error (example shape)
    if (err?.errors) {
      return {
        ok: false,
        error: {
          message: "Validation failed",
          fieldErrors: err.errors, // { password: ["too short"] }
        },
      };
    }

    // Auth / business rule error
    if (err?.message) {
      return {
        ok: false,
        error: {
          message: err.message,
        },
      };
    }

    // Fallback
    return {
      ok: false,
      error: {
        message: "Unexpected server error",
      },
    };
  }
}
