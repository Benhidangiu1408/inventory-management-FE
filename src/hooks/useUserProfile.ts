import { useQuery } from "@tanstack/react-query";
import { userManagementService } from "@/services/UserManagementService";

export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userManagementService.getById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
export const useUserRole = (username?: string) => {
  return useQuery({
    queryKey: ["username", username],
    queryFn: () => userManagementService.getRoleByUsername(username!),
    enabled: Boolean(username),
  });
};

