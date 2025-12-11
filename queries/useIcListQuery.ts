import { useQuery } from "@tanstack/react-query";

export const useIcListQuery = () => {
  return useQuery({
    queryKey: ["icList"],
    queryFn: async () => {
        const response = await fetch(`/api/user/ic-list`)
        if (!response.ok) {
            console.error("Failed to fetch session details")
        }
        const data = await response.json();
        console.log(data);
        return data.users;
        }
    ,
    refetchOnWindowFocus: false,
  });
}