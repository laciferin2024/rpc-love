import { z } from 'zod';
export const actionButtonSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50, 'Label is too long'),
  url: z.string().url('Must be a valid URL').min(1, 'URL is required'),
});
export const newProviderSchema = z.object({
  name: z.string().min(1, 'Provider name is required').max(120, 'Provider name is too long'),
  slug: z.string()
    .min(1, 'Provider slug is required')
    .max(80, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric, and contain only hyphens as separators'),
});
const step1ExistingProvider = z.object({
    providerType: z.literal('existing'),
    existingProviderSlug: z.string().min(1, "Please select a provider."),
    newProvider: newProviderSchema.partial().optional(),
});
const step1NewProvider = z.object({
    providerType: z.literal('new'),
    existingProviderSlug: z.string().nullable().optional(),
    newProvider: newProviderSchema,
});
export const step1Schema = z.discriminatedUnion('providerType', [
    step1ExistingProvider,
    step1NewProvider,
]);
export const step2Schema = z.object({
  network: z.object({
    slug: z.string().min(1, 'Offering slug is required').max(80, 'Slug is too long'),
    plan: z.string().min(1, 'Plan is required'),
    nodeType: z.string().min(1, 'Node type is required'),
    chain: z.enum(['mainnet', 'calibnet']),
    accessPrice: z.string().optional(),
    queryPrice: z.string().optional(),
    availableApis: z.array(z.string()).min(1, 'At least one API must be listed'),
    actionButtons: z.array(actionButtonSchema),
    isTrial: z.boolean(),
    isStarred: z.boolean(),
  })
});
export const rpcFormSchema = z.intersection(step1Schema, step2Schema);