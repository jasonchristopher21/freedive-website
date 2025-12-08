import { useQuery } from "@tanstack/react-query";

export const useAllSessionsQuery = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await fetch("/api/sessions/view");
      if (!response.ok) {
        throw new Error("Failed to fetch all sessions");
      }
      const data = await response.json();
      return data.sessions;
    },
    refetchOnWindowFocus: false,
  });
}