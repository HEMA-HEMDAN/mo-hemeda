import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, newUser } from "../services/users";
import { persistAuth } from "../utils/cookies";
import { toast } from "react-toastify";

export default function Auth() {
  // the logic is just fine but the design can be better
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register" || tab === "login") setMode(tab);
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const response = await login(data);
      const token = response?.data?.token || "";
      const role = response?.data?.user?.role || "";
      persistAuth(token, role, response?.data?.user || []);
      if (response?.status === "ok") toast.success("Login successful!");

      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Login failed!");
    }
  };

  const handleRegister = async (data) => {
    try {
      const response = await newUser(data);
      const token = response?.data?.token || "";
      const role = response?.data?.user?.role || "";
      persistAuth(token, role, response?.data?.user || []);
      toast.success("Register successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Register failed!");
    }
  };

  const onSubmit = (data) => {
    if (mode === "login") return handleLogin(data);
    return handleRegister(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4 sm:px-6 md:px-8">
      <div className="bg-white dark:bg-[#1b232e] border border-black/5 dark:border-white/10 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg sm:max-w-xl md:max-w-2xl">
        <div className="flex mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
              mode === "login"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
            aria-pressed={mode === "login"}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
              mode === "register"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500"
            }`}
            aria-pressed={mode === "register"}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-800 dark:text-white/80">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName", {
                      required: mode === "register" && "First name is required",
                    })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] dark:bg-[#121821] dark:text-white dark:border-white/10"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-800 dark:text-white/80">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName", {
                      required: mode === "register" && "Last name is required",
                    })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] dark:bg-[#121821] dark:text-white dark:border-white/10"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-800 dark:text-white/80">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      required: mode === "register" && "Phone is required",
                    })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] dark:bg-[#121821] dark:text-white dark:border-white/10"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-800 dark:text-white/80">
                    Parent Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("parentPhoneNumber", {
                      required:
                        mode === "register" && "Parent phone is required",
                    })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] dark:bg-[#121821] dark:text-white dark:border-white/10"
                  />
                  {errors.parentPhoneNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.parentPhoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-white/80">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] dark:bg-[#121821] dark:text-white dark:border-white/10"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-white/80">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] pr-10 dark:bg-[#121821] dark:text-white dark:border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-white/70"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "⌣" : "👁"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full text-white py-2 px-4 rounded transition active:scale-95 ${
              mode === "login"
                ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                : "bg-green-500 hover:bg-green-600 active:bg-green-700"
            }`}
          >
            {mode === "login" ? "Login" : "Register"}
          </button>

          {mode === "login" ? (
            <div className="text-center text-sm text-gray-600 dark:text-white/80">
              <span>Don\'t have an account? </span>
              <button
                type="button"
                className="text-blue-600 hover:underline font-semibold"
                onClick={() => {
                  setMode("register");
                  navigate("/auth?tab=register");
                }}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-600 dark:text-white/80">
              <span>Already have an account? </span>
              <button
                type="button"
                className="text-blue-600 hover:underline font-semibold"
                onClick={() => {
                  setMode("login");
                  navigate("/auth?tab=login");
                }}
              >
                Login
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
