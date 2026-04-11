import AdminProfileViewPageContent from "@/components/AdminProfileViewPageContent";
import { userManagementService } from "@/services/UserManagementService";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;
  const userInfo = await userManagementService.getById(id || "");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
        Profile
      </h3>
      <div className="space-y-6">
        <AdminProfileViewPageContent userInfo={userInfo} />
      </div>
    </div>
  );
}
