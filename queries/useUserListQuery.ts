import { useQuery } from "@tanstack/react-query";

export const useUserListQuery = () => {
  return useQuery({
    queryKey: ["userList"],
    queryFn: async () => {
      const response = await fetch(`/api/user/list`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      console.log(data);
      return data.users;
    },
    refetchOnWindowFocus: false,
  });
};
