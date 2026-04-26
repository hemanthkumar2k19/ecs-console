"use client";

import { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { saveSession } from "@/lib/session";

interface FormState {
  userId: string;
  password: string;
}

interface FormErrors {
  userId?: string;
  password?: string;
  general?: string;
}

export default function LoginCard() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ userId: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.userId.trim()) {
      newErrors.userId = "User ID is required.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const user = await login(form.userId, form.password);
      saveSession(user);
      router.push("/dashboard");
    } catch {
      setErrors({ general: "Invalid credentials. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
      <div className="w-full max-w-sm space-y-8">
        {/* Mobile-only logo */}
        <div className="lg:hidden flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900">ECS Console</p>
            <p className="text-xs text-slate-500">Evidence Collection System</p>
          </div>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to your ECS Console account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* General error banner */}
          {errors.general && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 px-4 py-3"
            >
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* User ID */}
          <div className="space-y-1.5">
            <label
              htmlFor="userId"
              className="text-sm font-medium text-slate-700"
            >
              User ID
            </label>
            <Input
              id="userId"
              type="text"
              placeholder="e.g. analyst01"
              value={form.userId}
              onChange={handleChange("userId")}
              autoComplete="username"
              aria-describedby={errors.userId ? "userId-error" : undefined}
              className={
                errors.userId ? "border-red-400 focus-visible:ring-red-400" : ""
              }
            />
            {errors.userId && (
              <p id="userId-error" role="alert" className="text-xs text-red-500">
                {errors.userId}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange("password")}
                autoComplete="current-password"
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`pr-10 ${
                  errors.password
                    ? "border-red-400 focus-visible:ring-red-400"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-xs text-red-500"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400">
          Need access?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline transition-colors"
          >
            Contact your administrator
          </button>
        </p>
      </div>
    </div>
  );
}
