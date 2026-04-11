"use client";
import {
  ActivateAccountAction,
  DeactivateAccountAction,
  DeleteAccountAction,
} from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";
import Button from "@/default_components/ui/button/Button";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { User } from "@/interfaces/userManagementType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminProfileViewPageContent({
  userInfo,
}: {
  userInfo: User;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { confirm, ConfirmationModal } = useConfirmModal();
  return (
    <>
      {ConfirmationModal}
      {/* User metadata */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex w-full flex-col items-center gap-6 xl:flex-row">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
                <Image
                  width={80}
                  height={80}
                  src="/images/user/default-avatar.png"
                  alt="user"
                />
              </div>
              <div className="order-3 xl:order-2">
                <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90">
                  {userInfo.firstName ?? ""} {userInfo.lastName ?? ""}
                </h4>
                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userInfo.role}
                  </p>
                  <div className="hidden h-3.5 w-px bg-gray-300 xl:block dark:bg-gray-700"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userInfo.status}
                  </p>
                </div>
              </div>
            </div>
            {user?.permissions.includes("DELETE_USER") && (
              <Button
                variant="danger"
                className="w-full !rounded-full xl:w-60"
                onClick={async () => {
                  try {
                    const isConfirmed = await confirm({
                      title: "Delete this user?",
                      message:
                        "Are you sure you want to delete this user? This action cannot be undone!",
                    });
                    if (!isConfirmed) return;
                    await DeleteAccountAction(userInfo.username);

                    toast.success("Delete user account successfully!");
                    router.replace("/admin/user-management");
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } catch (error: any) {
                    toast.error(
                      error.message ?? "An unexpected error occurred",
                    );
                  }
                }}
              >
                Delete User
              </Button>
            )}
            {user?.permissions.includes("TOGGLE_USER_STATUS") && (
              <Button
                variant={userInfo.status === "ACTIVE" ? "warning" : "success"}
                className="w-full !rounded-full xl:w-60"
                onClick={async () => {
                  try {
                    if (userInfo.status === "ACTIVE") {
                      await DeactivateAccountAction(userInfo.username);
                    } else if (userInfo.status === "DISABLED") {
                      await ActivateAccountAction(userInfo.username);
                    }
                    toast.success("Change user account status successfully!");
                    router.replace("/admin/user-management");
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } catch (error: any) {
                    toast.error(
                      error.message ?? "An unexpected error occurred",
                    );
                  }
                }}
              >
                {userInfo.status === "ACTIVE"
                  ? "Deactivate User"
                  : "Activate User"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div
        className={`rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
              Personal Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  First Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userInfo.firstName ?? ""}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Last Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userInfo.lastName ?? ""}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Email address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userInfo.email ?? ""}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Username
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userInfo.username}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userInfo.phoneNumber ?? ""}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Role
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userInfo.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
