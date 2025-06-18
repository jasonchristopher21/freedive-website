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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { SessionType, Level } from "@prisma/client";
import styles from "@/app/styles";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"




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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      date: new Date(),
      startTime: new Date("2023-01-01T08:00:00"),
      endTime: new Date("2023-01-01T08:00:00"),
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

  return (
    <AdminGuard>
      <div className="px-8 py-8 flex flex-col gap-4 max-w-screen-lg ml-0">
        <span className={styles.heading1}>ADD SESSION</span>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="p-4 md:px-8 md:py-6 border-2 border-grey-100 border-opacity-50 rounded-lg flex-col gap-4">
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
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-4">
                      <FormLabel>Session Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              // disable past dates
                              date < new Date(Date.now() - 86400000)
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-4">
                      <FormLabel>Start Time</FormLabel>
                      <Input
                        type="time"
                        id="time-picker"
                        step="1"
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        value={field.value ? field.value.toISOString().substring(11, 19) : "17:00:00"}
                        onChange={(e) => {
                          const [hours, minutes, seconds] = e.target.value.split(":").map(Number);
                          const newDate = new Date();
                          newDate.setHours(hours);
                          newDate.setMinutes(minutes);
                          newDate.setSeconds(seconds ?? 0);
                          newDate.setMilliseconds(0);
                          field.onChange(newDate);
                        }}
                        ref={field.ref}
                        name={field.name}
                      />
                    </FormItem>
                  )}
                />

              </div>
            </div>
          </form>
        </Form>
      </div>
    </AdminGuard>
  )
}