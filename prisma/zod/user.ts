import * as z from "zod"
import * as imports from "../null"
import { YearOfStudy, Level, AccessRole } from "@prisma/client"
import { CompleteAttendance, RelatedAttendanceModel, CompleteBan, RelatedBanModel, CompleteSessionIC, RelatedSessionICModel, CompleteSignup, RelatedSignupModel, CompleteRole, RelatedRoleModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  name: z.string(),
  preferredName: z.string().nullish(),
  email: z.string(),
  nusnetEmail: z.string(),
  yearOfEntry: z.number().int(),
  yearOfStudy: z.nativeEnum(YearOfStudy),
  remarks: z.string().nullish(),
  level: z.nativeEnum(Level),
  blockedUntil: z.date().nullish(),
  accessRole: z.nativeEnum(AccessRole),
  createdAt: z.date(),
  roleId: z.string(),
  avatarUrl: z.string().nullish(),
  telegramHandle: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  attendance: CompleteAttendance[]
  bans: CompleteBan[]
  icSessions: CompleteSessionIC[]
  signups: CompleteSignup[]
  role: CompleteRole
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  attendance: RelatedAttendanceModel.array(),
  bans: RelatedBanModel.array(),
  icSessions: RelatedSessionICModel.array(),
  signups: RelatedSignupModel.array(),
  role: RelatedRoleModel,
}))
