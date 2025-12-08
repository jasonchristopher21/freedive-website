"use client";

import AdminGuard from "@/app/common/authguard/AdminGuard";
import { Month, SessionQueryWithSignups } from "@/app/types";
import { SubmitButton } from "@/components/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SessionBox from "../SessionBox";
import { saveAs } from "file-saver";
import { exportExcel } from "@/app/actions";
import { format } from "date-fns";
import { ArrowUpRightFromSquare } from "lucide-react";

const formSchema = z.object({
	month: z.nativeEnum(Month),
	year: z.number()
})

export default function ExportExcelPage() {
	const [sessions, setSessions] = useState<SessionQueryWithSignups[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			month: Month.DECEMBER,
			year: 2025
		}
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		const data = { ...values }
		console.log("Submitting data:", data)
		fetch("/api/sessions/view", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		}).then(async res => {
			const data = await res.json()
			setSessions(data.sessions)
		}).catch(e => alert(e))
	}

	const ex = async () => {
		const monthWithYear = format(new Date(form.getValues().year + '-' + form.getValues().month), "MMMM Y")
		const buffer = await exportExcel(sessions, monthWithYear)
		saveAs(new Blob([buffer]), monthWithYear.replace(' ', '_') + "_OSA_Sports_Attendance_for_NUS_Dive_Freedive.xlsx")
	}


	return (
		<AdminGuard>
			<div className="px-8 py-8 flex flex-col gap-4 min-w-fit max-w-screen-lg ml-0">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col p-8 border-2 border-grey-100 border-opacity-50 rounded-lg gap-2 
													md:flex-row md:px-8 md:py-6 md:gap-10">
							<FormField
								control={form.control}
								name="month"
								render={({ field }) =>
									<FormItem className="flex flex-row gap-4">
										<FormLabel className="my-auto min-w-[60px]">Month</FormLabel>
										<FormControl className="w-full min-w-[120px]">
											<Select
												defaultValue={Month.DECEMBER}
												onChange={v => field.onChange(v)}
												options={[
													{ value: Month.JANUARY, label: "January" },
													{ value: Month.FEBRUARY, label: "February" },
													{ value: Month.MARCH, label: "March" },
													{ value: Month.APRIL, label: "April" },
													{ value: Month.MAY, label: "May" },
													{ value: Month.JUNE, label: "June" },
													{ value: Month.JULY, label: "July" },
													{ value: Month.AUGUST, label: "August" },
													{ value: Month.SEPTEMBER, label: "September" },
													{ value: Month.OCTOBER, label: "October" },
													{ value: Month.NOVEMBER, label: "November" },
													{ value: Month.DECEMBER, label: "December" },
												]}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>}>
							</FormField>
							<FormField control={form.control} name="year"
								render={({ field }) =>
									<FormItem className="flex flex-row w-full gap-4">
										<FormLabel className="my-auto min-w-[60px]">Year</FormLabel>
										<FormControl className="w-full md:w-auto min-w-[120px]">
											<Select
												defaultValue={2025}
												onChange={v => field.onChange(v)}
												options={[
													{ value: 2025 }
												]} />
										</FormControl>
									</FormItem>
								}>
							</FormField>
							<SubmitButton type="submit">Search</SubmitButton>
						</div>
					</form>
				</Form>
				<div className="w-full border-t border-grey-200 my-6" />
				<div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
					{sessions.map((session: SessionQueryWithSignups) => <SessionBox props={session} key={session.id} />)}
				</div>
				<button className={`mt-20 font-heading text-white 
								${sessions.length == 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-navy cursor-pointer'}
								rounded-md font-bold text-[16px] py-1.5 w-1/4 mx-auto`}
					onClick={ex} disabled={sessions.length == 0}>
					<div className="flex flex-row gap-3 justify-center"><ArrowUpRightFromSquare />EXPORT</div>
				</button>
			</div>

		</AdminGuard>
	)
}