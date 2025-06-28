import * as z from "zod"
import * as imports from "../null"
import { CompleteSession, RelatedSessionModel } from "./index"

export const TrainingPlanModel = z.object({
  id: z.string(),
  generalPlan: z.string().nullish(),
  beginnerPlan: z.string().nullish(),
  intermediatePlan: z.string().nullish(),
  advancedPlan: z.string().nullish(),
  createdAt: z.date(),
  sessionId: z.string().nullish(),
})

export interface CompleteTrainingPlan extends z.infer<typeof TrainingPlanModel> {
  session?: CompleteSession | null
}

/**
 * RelatedTrainingPlanModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTrainingPlanModel: z.ZodSchema<CompleteTrainingPlan> = z.lazy(() => TrainingPlanModel.extend({
  session: RelatedSessionModel.nullish(),
}))
