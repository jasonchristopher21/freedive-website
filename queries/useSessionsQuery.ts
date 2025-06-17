import { useQuery } from "@tanstack/react-query";

export const useSessionsQuery = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await fetch("/api/sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      const data = await response.json();
      return data.sessions;
    },
    refetchOnWindowFocus: false,
  });
}