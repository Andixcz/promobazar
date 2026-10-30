import { z } from "zod";

import { ORDER_BRIEF_ATTACHMENT_MAX } from "@/lib/orders/brief-attachments";

export const ORDER_BRIEF_MIN_LENGTH = 64;
export const ORDER_BRIEF_MAX_LENGTH = 8192;

export const orderBriefTextSchema = z.string().trim().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: "custom",
      message: "Vyplň brief pro tvůrce.",
    });
    return;
  }
  if (value.length < ORDER_BRIEF_MIN_LENGTH) {
    ctx.addIssue({
      code: "custom",
      message: `Brief musí mít aspoň ${ORDER_BRIEF_MIN_LENGTH} znaků (teď ${value.length}).`,
    });
  }
  if (value.length > ORDER_BRIEF_MAX_LENGTH) {
    ctx.addIssue({
      code: "custom",
      message: `Brief může mít nejvýš ${ORDER_BRIEF_MAX_LENGTH} znaků.`,
    });
  }
});

export const orderBriefAttachmentSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1),
  contentType: z.string().min(1),
});

const consentField = (message: string) =>
  z.boolean().refine((value) => value, { message });

export const orderCheckoutFormSchema = z.object({
  brief: orderBriefTextSchema,
  consentTerms: consentField(
    "Potvrď souhlas s obchodními podmínkami promobazar.cz.",
  ),
  consentMarketplace: consentField("Potvrď, že berete na vědomí pravidla objednávky."),
  consentPrivacy: consentField(
    "Potvrď souhlas se zpracováním osobních údajů.",
  ),
});

export const packageCheckoutPayloadSchema = z.object({
  packageId: z.string().min(1),
  brief: orderBriefTextSchema,
  briefAttachments: z
    .array(orderBriefAttachmentSchema)
    .max(ORDER_BRIEF_ATTACHMENT_MAX)
    .optional()
    .default([]),
});

export function firstZodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Neplatná data formuláře.";
}

export function zodFieldError(
  error: z.ZodError,
  field: string,
): string | null {
  const issue = error.issues.find((item) => item.path[0] === field);
  return issue?.message ?? null;
}
