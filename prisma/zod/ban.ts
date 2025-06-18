import * as z from "zod"
import * as imports from "../null"
import { CompleteUser, RelatedUserModel } from "./index"

export const BanModel = z.object({
  id: z.string(),
  userId: z.string(),
  reason: z.string(),
  startDate: z.date(),
  endDate: z.date(),
})

export interface CompleteBan extends z.infer<typeof BanModel> {
  user: CompleteUser
}

/**
 * RelatedBanModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBanModel: z.ZodSchema<CompleteBan> = z.lazy(() => BanModel.extend({
  user: RelatedUserModel,
}))
