"use client";

import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Button from "@/default_components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { UserLogin } from "@/interfaces/userManagementType";
import { useForm } from "react-hook-form";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>();

  const onSubmit = async (data: UserLogin) => {
    setLoading(true);
    const response = await loginAction(data);
    if (response?.error) {
      toast.error(response.error ?? "Username or password is incorrect");
      setLoading(false);
      return;
    }
    router.replace("/");
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter username"
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    error={!!errors.username}
                    hint={errors.username?.message}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      error={!!errors.password}
                      hint={errors.password?.message}
                      icon={
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
                      }
                    />
                  </div>
                </div>
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
