"use client"

import AdminGuard from "@/app/common/authguard/AdminGuard"

import Loading from "@/app/Loading"
import styles from "@/app/styles"
import { AutosizeTextarea } from "@/components/ui/autosize-textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useIcListQuery } from "@/queries/useIcListQuery"
import { setError } from "@/redux/features/error/errorSlice"
import { useAppDispatch } from "@/redux/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker, InputNumber, Select, TimePicker } from "antd"
import dayjs from "dayjs"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Level, SessionType } from "@/app/types"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  description: z.string().optional(),
  date: z.iso.datetime({
    message: "Please enter a valid date",
  }),
  startTime: z.iso.time({
    message: "Please enter a valid start time",
  }),
  endTime: z.iso.time({
    message: "Please enter a valid end time",
  }),
  // add a field called lanes which is an array of numbers
  lanes: z.array(z.number()).min(1, { message: "At least one lane is required" }),
  maxParticipants: z.number().min(1, { message: "Max participants must be at least 1" }),
  sessionType: z.enum(SessionType),
  levels: z.array(z.enum(Level)),
  generalPlan: z.string().optional(),
  beginnerPlan: z.string().optional(),
  intermediatePlan: z.string().optional(),
  advancedPlan: z.string().optional(),
  sessionICs: z.array(z.string()).min(1, { message: "At least 1 Session IC is required" }),
})

export default function AddSessionPageAuth() {
  return (
    <AdminGuard>
      <AddSessionPage />
    </AdminGuard>
  )
}

function AddSessionPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const laneOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }))

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      date: dayjs().utc(true).toISOString(),
      startTime: "17:00:00",
      endTime: "19:00:00",
      lanes: [],
      maxParticipants: 12,
      sessionType: SessionType.TRAINING,
      levels: [Level.BEGINNER, Level.INTERMEDIATE, Level.ADVANCED],
      generalPlan: "",
      beginnerPlan: "",
      intermediatePlan: "",
      advancedPlan: "",
      sessionICs: [],
    },
  })

  function transformFormValuesToBodySchema(values: z.infer<typeof formSchema>) {
    return {
      sessionData: {
        name: values.name,
        description: values.description ?? "",
        date: values.date,
        startTime: dayjs.utc(values.startTime, "HH:mm:ss").toISOString(),
        endTime: dayjs.utc(values.endTime, "HH:mm:ss").toISOString(),
        lanes: values.lanes,
        maxParticipants: values.maxParticipants,
        sessionType: values.sessionType,
        levels: values.levels ?? [],
      },
      trainingPlanData: {
        generalPlan: values.generalPlan,
        beginnerPlan: values.beginnerPlan,
        intermediatePlan: values.intermediatePlan,
        advancedPlan: values.advancedPlan,
      },
      sessionICs: values.sessionICs,
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.date)
    const data = transformFormValuesToBodySchema(values)
    console.log("Submitting data:", data)
    fetch("/api/sessions/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          router.push("/sessions")
        } else {
          return response.json().then((data) => {
            throw new Error(data.error || "Something went wrong")
          })
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error)
        dispatch(setError("Error during signup: " + error.message))
      })
  }

  const { data: icList, isLoading: isIcListLoading, error: isError } = useIcListQuery()

  if (isIcListLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col px-8 py-8 min-w-full justify-center gap-4 max-w-screen-lg ml-0">
      <span className={styles.heading1}>ADD SESSIONS</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="p-4 md:px-8 md:py-6 border-2 border-grey-100 border-opacity-50 rounded-lg flex flex-col gap-2 md:gap-0">
            <span className={`${styles.heading2} text-grey-500`}>SESSION DETAILS</span>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-2 flex flex-col md:flex-row md:gap-10">
                  <FormLabel className="my-auto md:w-[150px]">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter session name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4 md:mt-2 flex flex-col md:flex-row md:gap-10">
                  <FormLabel className="my-auto md:w-[150px] flex md:flex-col gap-2">
                    <span>Description</span>
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <AutosizeTextarea placeholder="Enter session description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full border-t border-grey-200 mt-6 mb-2" />

            {/* Date and Time Picker */}
            <div className="flex flex-col md:flex-row md:gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-4 md:min-w-[270px]">
                    <FormLabel>Session Date</FormLabel>
                    <DatePicker
                      className="w-full"
                      format="dddd, D MMMM YYYY"
                      value={field.value ? dayjs(field.value).utc(true) : null}
                      onChange={(date, dateString) => {
                        console.log(date.utc(true).toISOString())
                        field.onChange(date.utc(true).toISOString())
                      }}
                      placeholder="Select date"
                      suffixIcon={<CalendarIcon />}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-4">
                    <FormLabel>Start Time</FormLabel>
                    <TimePicker
                      format="HH:mm"
                      value={field.value ? dayjs(field.value, "HH:mm:ss") : null}
                      onChange={(time) => {
                        time && field.onChange(time.utc(true).toDate().toISOString())
                      }}
                      minuteStep={5}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-4">
                    <FormLabel>End Time</FormLabel>
                    <TimePicker
                      format="HH:mm"
                      value={field.value ? dayjs(field.value, "HH:mm:ss") : null}
                      onChange={(time) => {
                        time && field.onChange(time.utc(true).toDate().toISOString())
                      }}
                      minuteStep={5}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Training Config */}
            <div className="w-full border-t border-grey-200 my-6" />
            <FormField
              control={form.control}
              name="sessionType"
              render={({ field }) => (
                <FormItem className="mt-2 flex flex-col md:flex-row md:gap-10">
                  <FormLabel className="my-auto md:w-[155px]">Select session type</FormLabel>
                  <FormControl className="w-full md:w-auto md:min-w-[200px]">
                    <Select
                      showSearch
                      placeholder="Select session type"
                      filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                      defaultValue={SessionType.TRAINING}
                      options={[
                        { value: SessionType.TRAINING, label: "Training" },
                        { value: SessionType.SAFETY_REFRESHER, label: "Safety Refresher" },
                        { value: SessionType.EVENT, label: "Event" },
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col md:flex-row md:gap-10">
                    <FormLabel className="my-auto md:w-[155px]">Max Participants</FormLabel>
                    <FormControl className="w-full md:w-auto md:min-w-[200px]">
                      <InputNumber
                        min={1}
                        placeholder="Enter max participants"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                        }}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full border-t border-grey-200 mt-6 mb-2" />
            <div>
              <FormField
                control={form.control}
                name="lanes"
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col md:flex-row md:gap-10">
                    <FormLabel className="my-auto md:w-[200px]">Select lanes</FormLabel>
                    <FormControl className="w-full md:w-auto md:min-w-[200px]">
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        options={laneOptions}
                        value={field.value.sort((a, b) => a - b)}
                        onChange={(value) => {
                          field.onChange(value.map(Number))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="levels"
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col md:flex-row md:gap-10">
                    <FormLabel className="my-auto md:w-[200px]">Select levels</FormLabel>
                    <FormControl className="w-full md:w-auto md:min-w-[200px]">
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        options={[
                          { value: Level.BEGINNER, label: "Beginner" },
                          { value: Level.INTERMEDIATE, label: "Intermediate" },
                          { value: Level.ADVANCED, label: "Advanced" },
                        ]}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="p-4 md:px-8 md:py-6 border-2 border-grey-100 border-opacity-50 rounded-lg flex flex-col gap-2 md:gap-0">
            <span className={`${styles.heading2} text-grey-500`}>SESSION IC</span>
            <span className="text-sm text-grey-500 md:mt-2 mt-1">Select the ICs for this session. You can select multiple ICs.</span>
            <span className="text-xs text-grey-500 md:mt-1 mb-2">
              <i>Note: Only users with the IC or Admin role can be selected as ICs.</i>
            </span>
            <FormField
              control={form.control}
              name="sessionICs"
              render={({ field }) => (
                <FormItem className="mt-2 flex flex-col md:flex-row md:gap-10">
                  <FormControl className="w-full md:w-auto md:min-w-[200px]">
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      options={icList?.map((ic: any) => ({
                        value: ic.id,
                        label: `${ic.name} (${ic.Role.name})`,
                      }))}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Training Plan Input */}
          <div className="p-4 md:px-8 md:py-6 border-2 border-grey-100 border-opacity-50 rounded-lg flex flex-col gap-2 md:gap-0">
            <span className={`${styles.heading2} text-grey-500`}>TRAINING PLAN</span>
            <FormField
              control={form.control}
              name="generalPlan"
              render={({ field }) => (
                <FormItem className="mt-4 md:mt-2 flex flex-col md:flex-row md:gap-10">
                  <FormLabel className="my-auto md:w-[150px] flex md:flex-col gap-2">
                    <span>General Plan</span>
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <AutosizeTextarea placeholder="Enter general training plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beginnerPlan"
              render={({ field }) => (
                <FormItem className="mt-4 md:mt-2 flex flex-col md:flex-row md:gap-10">
                  <FormLabel className="my-auto md:w-[150px] flex md:flex-col gap-2">
                    <span>Beginner Plan</span>
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <AutosizeTextarea placeholder="Enter training plan for beginner level members" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intermediatePlan"
              render={({ field }) => (
                <FormItem className="mt-4 md:mt-2 flex flex-col md:flex-row md:gap-10">
                  <FormLabel className="my-auto md:w-[150px] flex md:flex-col gap-2">
                    <span>Intermediate Plan</span>
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <AutosizeTextarea placeholder="Enter training plan for intermediate level members" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="advancedPlan"
              render={({ field }) => (
                <FormItem className="mt-4 md:mt-2 flex flex-col md:flex-row md:gap-10">
                  <FormLabel className="my-auto md:w-[150px] flex md:flex-col gap-2">
                    <span>Advanced Plan</span>
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <AutosizeTextarea placeholder="Enter training plan for advanced level members" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white">
              Add Session
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
