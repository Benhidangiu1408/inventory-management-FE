"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import toast from "react-hot-toast";
import { User } from "@/interfaces/userManagementType";

export default function UserMetaCard({
  userInfo,
  userRole,
}: {
  userInfo: User;
  userRole: string;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  // const [showPassword, setShowPassword] = useState(false);
  // const { data: user, isLoading, error } = useUserProfile(id);
  // const {
  //   data: role,
  //   isLoading: isRoleLoading,
  //   error: roleError,
  // } = useUserRole(user?.username);
  // const [currentPassword, setCurrentPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [loading, setLoading] = useState(false);

  const [currentStatus, setCurrentStatus] = useState(userInfo.status);
  // const handleSave = async () => {
  //   //   if (!currentPassword || !newPassword) {
  //   //     toast.error("Please fill in both passwords.", { duration: 5000 });
  //   //     return;
  //   //   }
  //   //   setLoading(true);
  //   //   try {
  //   //     await userManagementService.changePassword(
  //   //       user?.username!,
  //   //       currentPassword,
  //   //       newPassword,
  //   //     );
  //   //     closeModal();
  //   //     setTimeout(() => {
  //   //       toast.success("Password changed successfully!", {
  //   //         duration: 3000, // 5 giây, muốn lâu hơn thì tăng lên
  //   //       });
  //   //     }, 150);
  //   //     setCurrentPassword("");
  //   //     setNewPassword("");
  //   //   } catch (error) {
  //   //     closeModal();
  //   //     setTimeout(() => {
  //   //       if (error instanceof ApiError) {
  //   //         toast.error(error.message, {
  //   //           duration: 3000, // 3 giây, muốn lâu hơn thì tăng lên
  //   //         });
  //   //       } else {
  //   //         toast.error("An unexpected error occurred", { duration: 5000 });
  //   //       }
  //   //     }, 150);
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }
  // };

  // const handleConfirm = async () => {
  //   setLoading(true);
  //   try {
  //     // (await currentStatus) === "ACTIVE"
  //     //   ? userManagementService.deactivateAccount(user?.username)
  //     //   : userManagementService.activateAccount(user?.username);
  //     setCurrentStatus(currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE");
  //     closeModal();
  //     toast.success("User status changed successfully!");
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <div
        className={`rounded-2xl border border-gray-200 p-5 transition-all duration-300 lg:p-6 dark:border-gray-800 ${isOpen ? "blur-[2px]" : ""}`}
      >
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
                  {userRole ?? "N/A"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 xl:block dark:bg-gray-700"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentStatus}
                </p>
              </div>
            </div>
          </div>
          <button
            // onClick={openModal}
            className="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            {"Change Password"}
          </button>
        </div>
      </div>
      {/* {
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="m-4 max-w-[700px]"
          overlayClassName="bg-gray-900/10 backdrop-blur-sm"
        >
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Change Your Password
              </h4>
            </div>
            <form className="flex flex-col">
              <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <Label>New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-3 px-2 lg:justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={closeModal}
                >
                  Close
                </Button>
                <Button type="button" size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      } */}

      {/* <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="m-4 max-w-[700px]"
          overlayClassName="bg-gray-900/10 backdrop-blur-sm"
        >
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
            <div className="px-2 pr-14">
              <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {currentStatus === "ACTIVE"
                  ? "Deactivate Account"
                  : "Activate Account"}
              </h4>
              <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                {currentStatus === "ACTIVE"
                  ? "Are you sure you want to deactivate this account? The user will be unable to access the system until reactivated."
                  : "Are you sure you want to activate this account? The user will be able to access the system upon activation."}
              </p>
            </div>
            <form className="flex flex-col">
              <div className="mt-1 flex items-center gap-3 px-2 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button size="sm" onClick={handleConfirm}>
                  Confirm
                </Button>
              </div>
            </form>
          </div>
        </Modal> */}
    </>
  );
}
