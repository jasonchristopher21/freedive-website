import * as z from "zod"
import * as imports from "../null"
import { CompleteSession, RelatedSessionModel, CompleteUser, RelatedUserModel } from "./index"

export const SessionICModel = z.object({
  id: z.string(),
  sessionId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
})

export interface CompleteSessionIC extends z.infer<typeof SessionICModel> {
  session: CompleteSession
  user: CompleteUser
}

/**
 * RelatedSessionICModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSessionICModel: z.ZodSchema<CompleteSessionIC> = z.lazy(() => SessionICModel.extend({
  session: RelatedSessionModel,
  user: RelatedUserModel,
}))
