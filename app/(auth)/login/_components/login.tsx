"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { BiShow, BiHide } from "react-icons/bi";
import { FiMail, FiLock } from "react-icons/fi";
import Image from "next/image";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { googleAuthSignIn, loginpageapi } from "@/app/(auth)/api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useTranslations } from "next-intl";

const Login = () => {
  const tLogin = useTranslations("login");
  const tVal = useTranslations("validation");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleBtnWrapRef = useRef<HTMLDivElement>(null);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(320);

  useLayoutEffect(() => {
    const el = googleBtnWrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const apply = (w: number) => {
      if (w > 0) setGoogleBtnWidth(Math.min(400, Math.floor(w)));
    };
    apply(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      apply(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Open redirect only for same-app paths (avoid open redirects). */
  const postLoginPath = useMemo(() => {
    const raw = searchParams.get("redirect");
    if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
    return "/search";
  }, [searchParams]);

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.string().email({ message: tVal("email") }),
        password: z
          .string()
          .min(8, { message: tVal("passwordMin") }),
      }),
    [tVal]
  );

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const tokenId = credentialResponse.credential;
    if (!tokenId) {
      toast.error(tLogin("toastGeneric"));
      return;
    }
    try {
      await googleAuthSignIn(tokenId);
      toast.success(tLogin("toastSuccess"));
      router.push(postLoginPath);
    } catch (error: any) {
      console.error("Google login error:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        tLogin("toastGeneric");
      toast.error(message);
    }
  };

  const logedin = useCallback(async () => {
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(formattedErrors).map(([key, value]) => [
            key,
            value?.[0] || "",
          ])
        )
      );
      return;
    }

    setLoggingIn(true);
    setErrors({});

    try {
      const response = await loginpageapi(formData);

      if (response?.data?.status === "Success" || response?.status === 200) {
        toast.success(tLogin("toastSuccess"));
        router.push(postLoginPath);
      } else {
        toast.error(tLogin("toastInvalid"));
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        tLogin("toastGeneric");
      toast.error(message);
    } finally {
      setLoggingIn(false);
    }
  }, [formData, router, formSchema, tLogin, postLoginPath]);

  return (
    <div className="min-h-screen flex bg-[#FFF8F5]">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[url('/assets/ThemeImage2.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <div className="max-w-lg m-auto">
            <h1 className="font-playfair text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
              {tLogin("heroTitle")}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              {tLogin("heroSub")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=120&h=120&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=faces",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Tamil bride profile"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover bg-white/20 backdrop-blur-sm"
                  loading="lazy"
                />
              ))}
            </div>
            <p className="text-white/90 text-sm font-medium">
              {tLogin("heroStat")}
            </p>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex min-w-0 w-full flex-col lg:w-[45%]">
        <div className="flex justify-between items-center px-8 py-5">
          <Link href="/" className="lg:hidden">
            <Image
              src="/assets/mmtlogo.png"
              alt="logo"
              width={100}
              height={15}
            />
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center px-8 sm:px-12 lg:px-16">
          <div className="w-full min-w-0 max-w-[440px] rounded-2xl border border-border-soft/90 bg-white/95 p-6 shadow-card backdrop-blur-sm transition-shadow duration-300 ease-out hover:shadow-card-hover sm:p-8">
            <h2 className="mb-1 font-playfair text-3xl font-bold tracking-tight text-[#2C2C2C]">
              {tLogin("welcome")}
            </h2>
            <p className="mb-8 text-[15px] leading-relaxed text-[#6B6B6B]">
              {tLogin("signInHint")}
            </p>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#2C2C2C] mb-1.5"
                >
                  {tLogin("email")}
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] group-focus-within:text-[#8D1B3D] transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder={tLogin("phEmail")}
                    className="w-full rounded-xl border border-border-soft bg-white py-3.5 pl-11 pr-4 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:outline-none focus:border-maroon/45 focus:ring-2 focus:ring-maroon/12 hover:border-maroon/25"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-[#2C2C2C]"
                >
                  {tLogin("password")}
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] group-focus-within:text-[#8D1B3D] transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder={tLogin("phPassword")}
                    className="w-full rounded-xl border border-border-soft bg-white py-3.5 pl-11 pr-12 text-sm text-[#2C2C2C] shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-[#6B6B6B]/75 focus:outline-none focus:border-maroon/45 focus:ring-2 focus:ring-maroon/12 hover:border-maroon/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md text-[#6B6B6B] transition-colors duration-200 hover:text-maroon focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon/30 focus-visible:ring-offset-2"
                  >
                    {showPassword ? (
                      <BiShow size={20} />
                    ) : (
                      <BiHide size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1.5">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="text-right">
                <Link
                  href="/forget_password"
                  className="text-sm text-[#8D1B3D] font-medium hover:text-[#6B1530] hover:underline transition-all duration-200"
                >
                  {tLogin("forgot")}
                </Link>
              </div>

              <Button
                onClick={logedin}
                disabled={loggingIn}
                className={`w-full rounded-xl border-0 bg-maroon py-6 text-[15px] font-semibold !text-white shadow-md transition-all duration-200 ease-out hover:bg-[#6B1530] hover:shadow-lg hover:shadow-maroon/15 focus-visible:ring-2 focus-visible:ring-maroon/45 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 ${
                  loggingIn && "cursor-not-allowed opacity-50"
                }`}
              >
                {loggingIn ? tLogin("loggingIn") : tLogin("logIn")}
              </Button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#EADDDD]" />
                <span className="text-xs text-[#6B6B6B] font-medium uppercase tracking-wider">
                  {tLogin("orContinue")}
                </span>
                <div className="flex-1 h-px bg-[#EADDDD]" />
              </div>

              <div
                ref={googleBtnWrapRef}
                className="flex w-full min-w-0 max-w-full justify-center overflow-hidden"
              >
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error(tLogin("toastGeneric"))}
                  size="large"
                  width={googleBtnWidth}
                  theme="outline"
                  shape="pill"
                  text="signin_with"
                />
              </div>

              <p className="text-sm text-[#6B6B6B] text-center mt-4">
                {tLogin("noAccount")}{" "}
                <Link
                  href="/loginstep"
                  className="text-[#8D1B3D] font-semibold hover:text-[#6B1530] hover:underline transition-all duration-200"
                >
                  {tLogin("registerNow")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
