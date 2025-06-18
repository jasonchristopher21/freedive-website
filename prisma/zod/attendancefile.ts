import * as z from "zod"
import * as imports from "../null"

export const AttendanceFileModel = z.object({
  id: z.string(),
  monthYear: z.string(),
  fileId: z.string(),
  fileUrl: z.string().nullish(),
  createdAt: z.date(),
})
