import { useQuery } from "@tanstack/react-query";

export const useAvatarQuery = (avatarUrl: string | null) => {
  return useQuery({
    queryKey: ["userAvatar", avatarUrl],
    queryFn: async () => {
      // If avatarUrl is already a public url
      if (!avatarUrl || !["png","jpg","jpeg"].includes(avatarUrl.split('.').pop()!)) {
        return avatarUrl
      }
      // Else it is the filename located in supabase Storage
      const response = await fetch(`/api/user/avatar?url=${avatarUrl}`, {
        method: "GET"
      })

      if (!response.ok) {
        console.error("Failed to fetch user avatar")
      }
      const data = await response.json();
      console.log(data);
      return data.data;
    },
    enabled: !!avatarUrl,
    refetchOnWindowFocus: false,
  });
};
