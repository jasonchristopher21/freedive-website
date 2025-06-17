import { useQuery } from "@tanstack/react-query";

export const useSessionDetailQuery = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessionDetail", sessionId],
    queryFn: async () => {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch session details");
        }
        const data = await response.json();
        return data.session;
        }
    ,
    refetchOnWindowFocus: false,
    enabled: !!sessionId, // Only run the query if sessionId is provided
  });
}