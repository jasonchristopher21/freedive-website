import { Month } from "@/app/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the monthly session details and stores it with React Query.
 * Note that React Query converts JSON Date objects to String.
 */
export const useMonthlySessionsQuery = (val: {month: Month, year: number}) => {
    return useQuery({
        queryKey: [val.month + val.year + "Sessions"],
        queryFn: async () => {
            const response = await fetch("/api/sessions/view", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(val)
            });
            if (!response.ok) {
                throw new Error("Failed to fetch upcoming sessions");
            }
            const data = await response.json();
            console.log(data)
            return data.sessions;
        },
        refetchOnWindowFocus: false,
    });
}