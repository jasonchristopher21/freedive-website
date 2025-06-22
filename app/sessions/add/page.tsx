"use client";

import React from "react";
import AdminGuard from "@/app/common/authguard/AdminGuard";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { SessionType, Level } from "@prisma/client";
import styles from "@/app/styles";
import { CalendarIcon } from "lucide-react"
import { DatePicker, TimePicker, Divider, Select, Space } from "antd";
import dayjs from "dayjs";
import { useIcListQuery } from "@/queries/useIcListQuery";


const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  description: z.string().min(1, { message: "Description cannot be empty" }),
  date: z.coerce.date({
    message: "Please enter a valid date",
  }),
  startTime: z.coerce.date({
    message: "Please enter a valid start time",
  }),
  endTime: z.coerce.date({
    message: "Please enter a valid end time",
  }),
  // add a field called lanes which is an array of numbers
  lanes: z.array(z.coerce.number()).min(1, { message: "At least one lane is required" }),
  maxParticipants: z.coerce.number().min(1, { message: "Max participants must be at least 1" }),
  sessionType: z.nativeEnum(SessionType),
  levels: z.array(z.nativeEnum(Level)),
  generalPlan: z.string().optional(),
  beginnerPlan: z.string().optional(),
  intermediatePlan: z.string().optional(),
  advancedPlan: z.string().optional(),
  sessionICs: z.array(z.object({
    userId: z.string().uuid(),
  })),
});

export default function AddSessionPage() {

  const laneOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      date: new Date(),
      startTime: new Date("2023-01-01T00:00:00"),
      endTime: new Date("2023-01-01T00:00:00"),
      lanes: [],
      maxParticipants: 1,
      sessionType: SessionType.TRAINING,
      levels: [],
      generalPlan: "",
      beginnerPlan: "",
      intermediatePlan: "",
      advancedPlan: "",
      sessionICs: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form submitted with data:", data);
  }
  
  const { data: icList, isLoading: isIcListLoading, error: isError } = useIcListQuery();

  if (isIcListLoading) {
    return <div className="flex justify-center items-center h-screen">Loading ICs...</div>;
  }

  console.log("IC List:", icList);

  return (
    <AdminGuard>
      <div className="px-8 py-8 flex flex-col gap-4 max-w-screen-lg ml-0">
        <span className={styles.heading1}>ADD SESSION</span>
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
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
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
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date, dateString) => {
                          field.onChange(date);
                        }}
                        placeholder="Select date"
                        suffixIcon={<CalendarIcon />}
                      />
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
                        defaultOpenValue={dayjs("00:00", "HH:mm")}
                        format="HH:mm"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(time) => {
                          field.onChange(new Date(time.toDate()));
                        }}
                        minuteStep={5} />
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
                        defaultOpenValue={dayjs("00:00", "HH:mm")}
                        format="HH:mm"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(time) => {
                          field.onChange(new Date(time.toDate()));
                        }}
                        minuteStep={5} />
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
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
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
                  name="lanes"
                  render={({ field }) => (
                    <FormItem className="mt-2 flex flex-col md:flex-row md:gap-10">
                      <FormLabel className="my-auto md:w-[200px]">Select lanes</FormLabel>
                      <FormControl className="w-full md:w-auto md:min-w-[200px]">
                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: '100%' }}
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

              </div>
            </div>
            <div className="p-4 md:px-8 md:py-6 border-2 border-grey-100 border-opacity-50 rounded-lg flex flex-col gap-2 md:gap-0">
              <span className={`${styles.heading2} text-grey-500`}>SESSION IC</span>
              <span className="text-sm text-grey-500 md:mt-2 mt-1">
                Select the ICs for this session. You can select multiple ICs.
              </span>
              <span className="text-xs text-grey-500 md:mt-1">
                <i>Note: Only users with the IC or Admin role can be selected as ICs.</i>
              </span>
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
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
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
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
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
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
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
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <AutosizeTextarea placeholder="Enter training plan for advanced level members" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white">
                Add Session
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminGuard>
  )
}