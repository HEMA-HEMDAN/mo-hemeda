import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, newUser } from "../services/users";
import { persistAuth } from "../utils/cookies";
import { toast } from "react-toastify";
import Loading from "../components/rusable/Loading";

export default function Auth() {
  // the logic is just fine but the design can be better
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    document.title = "Auth";
  }, []);
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
    <>
      <Loading />
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8">
      <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl">
        <div className="flex mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
              mode === "login"
                ? "border-[#c5f10f] text-[#c5f10f]"
                : "border-transparent text-gray-400"
            }`}
            aria-pressed={mode === "login"}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
              mode === "register"
                ? "border-[#c5f10f] text-[#c5f10f]"
                : "border-transparent text-gray-400"
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
                  <label className="block mb-1 font-medium text-white/90">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName", {
                      required: mode === "register" && "First name is required",
                    })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] bg-[#121821] text-white border-white/10"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white/90">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName", {
                      required: mode === "register" && "Last name is required",
                    })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] bg-[#121821] text-white border-white/10"
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
                  <label className="block mb-1 font-medium text-white/90">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      required: mode === "register" && "Phone is required",
                    })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] bg-[#121821] text-white border-white/10"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white/90">
                    Parent Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("parentPhoneNumber", {
                      required:
                        mode === "register" && "Parent phone is required",
                    })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] bg-[#121821] text-white border-white/10"
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
            <label className="block mb-1 font-medium text-white/90">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] bg-[#121821] text-white border-white/10"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-white/90">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#c5f10f] pr-10 bg-[#121821] text-white border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/70 hover:text-white"
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
            className={`w-full text-[#1b232e] py-3 px-4 rounded-lg transition active:scale-95 bg-gradient-to-r from-[#c5f10f] to-[#a8d708] hover:from-[#a8d708] hover:to-[#c5f10f] font-semibold shadow-lg`}
          >
            {mode === "login" ? "Login" : "Register"}
          </button>

          {mode === "login" ? (
            <div className="text-center text-sm text-white/80">
              <span>Don\'t have an account? </span>
              <button
                type="button"
                className="text-[#c5f10f] hover:underline font-semibold"
                onClick={() => {
                  setMode("register");
                  navigate("/auth?tab=register");
                }}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="text-center text-sm text-white/80">
              <span>Already have an account? </span>
              <button
                type="button"
                className="text-[#c5f10f] hover:underline font-semibold"
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
    </>
  );
}
