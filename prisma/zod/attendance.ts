import * as z from "zod"
import * as imports from "../null"
import { CompleteSession, RelatedSessionModel, CompleteUser, RelatedUserModel } from "./index"

export const AttendanceModel = z.object({
  id: z.string(),
  sessionId: z.string(),
  userId: z.string(),
  isPresent: z.boolean(),
  checkedInAt: z.date(),
})

export interface CompleteAttendance extends z.infer<typeof AttendanceModel> {
  session: CompleteSession
  user: CompleteUser
}

/**
 * RelatedAttendanceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAttendanceModel: z.ZodSchema<CompleteAttendance> = z.lazy(() => AttendanceModel.extend({
  session: RelatedSessionModel,
  user: RelatedUserModel,
}))
