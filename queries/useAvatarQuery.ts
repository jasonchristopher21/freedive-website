import { useQuery } from "@tanstack/react-query";

export const useAvatarQuery = (userId: string) => {
  return useQuery({
    queryKey: ["userAvatar", userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}/avatar`, {
        method: "GET"
      })

      if (!response.ok) {
        console.error("Failed to fetch user avatar")
      }
      const data = await response.json();
      if (data.status == 204) { return null }
      return data.data;
    },
    refetchOnWindowFocus: false,
  });
};
