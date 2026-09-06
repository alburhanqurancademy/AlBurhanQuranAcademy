import { z } from "zod";

const trialSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("A valid email is required"),
  phone: z.string().trim().min(5, "Phone is required"),
  course: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(3, "Message is required").optional().or(z.literal("")),
});

export type TrialInput = {
  name: string;
  email: string;
  phone: string;
  course?: string;
  message?: string;
};

export function sanitizeTrialInput(input: Record<string, unknown>): TrialInput {
  const normalized = { ...input } as Record<string, string | undefined>;

  return {
    name: normalized.name?.trim() ?? "",
    email: (normalized.email ?? "").trim().toLowerCase(),
    phone: normalized.phone?.trim() ?? "",
    course: normalized.course?.trim() || undefined,
    message: normalized.message?.trim() || undefined,
  };
}

export function validateTrialInput(input: Record<string, unknown>) {
  const sanitized = sanitizeTrialInput(input);
  const result = trialSchema.safeParse(sanitized);

  if (!result.success) {
    return {
      ok: false as const,
      message: result.error.issues[0]?.message ?? "Invalid trial booking request",
    };
  }

  return { ok: true as const, data: result.data };
}
