import { z } from "zod"
import {
  ADAPTIVE_CAPABILITIES,
  ROLE_FAMILIES,
  SENIORITY_LEVELS,
} from "../../../packages/adaptive-focus-core/src"

export const AdaptiveCapabilitySchema = z.enum(ADAPTIVE_CAPABILITIES)
export const RoleFamilySchema = z.enum(ROLE_FAMILIES)
export const SenioritySchema = z.enum(SENIORITY_LEVELS)

export const RoleRequirementSchema = z.object({
  capability: AdaptiveCapabilitySchema,
  importance: z.enum(["required", "preferred", "context"]),
  basis: z.enum(["explicit", "inferred"]),
})

export const ModelRoleInterpretationSchema = z.object({
  roleTitle: z.string().max(120).nullable(),
  roleFamily: RoleFamilySchema,
  seniority: SenioritySchema,
  companyContext: z.string().max(100).nullable(),
  requirements: z.array(RoleRequirementSchema).max(12),
  responsibilities: z.array(z.string().max(180)).max(8),
  desiredOutcomes: z.array(z.string().max(180)).max(6),
  confidence: z.number().min(0).max(1),
  clarificationNeeded: z.boolean(),
  clarificationQuestion: z.string().max(240).nullable(),
})

export const RoleInterpretationSchema = ModelRoleInterpretationSchema.extend({
  normalizedInput: z.string().max(12_000),
})

export const AnalyzeRoleRequestSchema = z
  .object({
    input: z.string().trim().min(1).max(12_000),
  })
  .strict()

export type ModelRoleInterpretation = z.infer<typeof ModelRoleInterpretationSchema>
