"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
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

const yearOfStudyChoices = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "Graduate",
  "Alumni",
  "Others",
] as const;

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  email: z
    .string()
    .min(1, { message: "Email cannot be empty" })
    .email("Please enter a valid email"),
  preferredName: z.string().optional(),
  yearOfEntry: z.coerce
    .number({
      message: "Please enter a valid year",
    })
    .min(2019)
    .max(9999),
  yearOfStudy: z.enum(yearOfStudyChoices),
  nusnetEmail: z
    .string()
    .email()
    .min(1, { message: "NUSNET Email cannot be empty" })
    .regex(/^[\w.-]+@(u\.nus\.edu|nus\.edu\.sg)$/, {
      message: "Please enter a valid NUSNET email",
    }),
  accessCode: z.string().optional(),
});

export default function ProfileForm() {
  const searchParams = useSearchParams();
  const accessCode = searchParams.get("accessCode");
  const supabase = createClient();
  const authUser = useAppSelector((state) => state.auth.authUser);
  const state = useAppSelector((state) => state.auth);

  console.log(authUser);
  console.log("accessCode from searchParams:", accessCode);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: authUser?.email || "",
      preferredName: "",
      yearOfEntry: currentYear,
      yearOfStudy: undefined,
      nusnetEmail: "",
      accessCode: accessCode || "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    fetch("/api/signup/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/auth/redirect";
        } else {
          return response.json().then((data) => {
            throw new Error(data.error || "Something went wrong");
          });
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        alert(error.message);
      });
  }
  return (
    <div className="py-10">
      <h1 className="text-2xl font-heading font-bold mb-4">
        CREATE AN ACCOUNT
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Preferred Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your Email" {...field} disabled={true} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nusnetEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NUSNET Email</FormLabel>
                <FormControl>
                  <Input placeholder="xyz@u.nus.edu" {...field} />
                </FormControl>
                <FormDescription>
                  Email assigned by NUS, ends with either @u.nus.edu or
                  @nus.edu.sg
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearOfEntry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Entry</FormLabel>
                <FormControl>
                  <Input placeholder={currentYear.toString()} {...field} />
                </FormControl>
                <FormDescription>
                  Enter the year when you started joining NUS Freedive
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Study in NUS</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year of Study in NUS" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearOfStudyChoices.map((choice) => (
                      <SelectItem value={choice} key={choice}>
                        {choice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accessCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Access Code" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the access code provided by NUS Freedive
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Account</Button>
        </form>
      </Form>
    </div>
  );
}
