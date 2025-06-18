import * as z from "zod"
import * as imports from "../null"
import { CompleteUser, RelatedUserModel } from "./index"

export const RoleModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
})

export interface CompleteRole extends z.infer<typeof RoleModel> {
  users: CompleteUser[]
}

/**
 * RelatedRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoleModel: z.ZodSchema<CompleteRole> = z.lazy(() => RoleModel.extend({
  users: RelatedUserModel.array(),
}))
