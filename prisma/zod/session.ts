import * as z from "zod"
import * as imports from "../null"
import { SessionType, Level } from "@prisma/client"
import { CompleteAttendance, RelatedAttendanceModel, CompleteSessionIC, RelatedSessionICModel, CompleteSignup, RelatedSignupModel, CompleteTrainingPlan, RelatedTrainingPlanModel } from "./index"

export const SessionModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  date: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  lanes: z.number().int().array(),
  maxParticipants: z.number().int(),
  createdAt: z.date(),
  sessionType: z.nativeEnum(SessionType),
  levels: z.nativeEnum(Level).array(),
})

export interface CompleteSession extends z.infer<typeof SessionModel> {
  attendance: CompleteAttendance[]
  ics: CompleteSessionIC[]
  signups: CompleteSignup[]
  trainingPlan?: CompleteTrainingPlan | null
}

/**
 * RelatedSessionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSessionModel: z.ZodSchema<CompleteSession> = z.lazy(() => SessionModel.extend({
  attendance: RelatedAttendanceModel.array(),
  ics: RelatedSessionICModel.array(),
  signups: RelatedSignupModel.array(),
  trainingPlan: RelatedTrainingPlanModel.nullish(),
}))
