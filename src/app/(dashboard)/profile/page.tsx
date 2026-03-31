import UserInfoCard from "@/default_components/user-profile/UserInfoCard";
import UserMetaCard from "@/default_components/user-profile/UserMetaCard";
import { userManagementService } from "@/services/UserManagementService";
import { cookies } from "next/headers";

export default async function Profile() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value || null;
  const userInfo = await userManagementService.getById(userId || "");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
        Profile
      </h3>
      <div className="space-y-6">
        <UserMetaCard userInfo={userInfo} />
        <UserInfoCard initialUserInfo={userInfo} />
        {/* <UserAddressCard /> */}
      </div>
    </div>
  );
}
