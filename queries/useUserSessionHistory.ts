import { MonthlySessionsMapped } from "@/app/api/sessions/view/route";
import { Month } from "@/app/types";
import { Session } from "@prisma/client"
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the user's session history.
 * Note that React Query converts JSON Date objects to String.
 */
export const useUserSessionHistoryQuery = (userId: string) => {
    return useQuery({
        queryKey: [userId, "SessionHistory"],
        queryFn: async () => {
            const response = await fetch(`/api/user/${userId}/history`, {
                method: "GET"
            });
            if (!response.ok) {
                console.error("Failed to fetch session history")
                return {sessions: []}
            }
            const data = await response.json();
            console.log(data)
            return (data.sessions as Session[]).sort((a, b) => a.date < b.date ? -1 : a.date == b.date ? 0 : 1);
        },
    });
}