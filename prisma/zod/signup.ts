import * as z from "zod"
import * as imports from "../null"
import { CompleteSession, RelatedSessionModel, CompleteUser, RelatedUserModel } from "./index"

export const SignupModel = z.object({
  id: z.string(),
  sessionId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
})

export interface CompleteSignup extends z.infer<typeof SignupModel> {
  session: CompleteSession
  user: CompleteUser
}

/**
 * RelatedSignupModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSignupModel: z.ZodSchema<CompleteSignup> = z.lazy(() => SignupModel.extend({
  session: RelatedSessionModel,
  user: RelatedUserModel,
}))
