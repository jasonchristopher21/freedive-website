import { SessionResponseMapped } from "@/app/api/sessions/route";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the upcoming session details and stores it with React Query.
 * Note that React Query converts JSON Date objects to String.
 */
export const useUpcomingSessionsQuery = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await fetch("/api/sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming sessions");
      }
      const data = await response.json();
      console.log(data)
      return data.sessions as SessionResponseMapped;
    },
    refetchOnMount: 'always'
  });
}