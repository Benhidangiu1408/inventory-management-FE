import { getUserProfileAction } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";

export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await getUserProfileAction(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
// export const useUserRole = (username?: string) => {
//   return useQuery({
//     queryKey: ["username", username],
//     queryFn: () => userManagementService.getRoleByUsername(username!),
//     enabled: Boolean(username),
//   });
// };
