"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { updateNewPassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-[#050509]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/30 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />

        <img
          src="/logo/DevDynamo.svg"
          alt="DevDynamo"
          className="absolute inset-0 m-auto w-[500px] opacity-5 pointer-events-none"
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-800 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex justify-center mb-5">
          <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
            <Lock className="w-7 h-7 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center">Create New Password</h1>

        <p className="text-neutral-400 text-center mt-2 text-sm">
          You're using a temporary password.
          <br />
          Create a secure password to continue.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (password !== confirm) {
              setError("Passwords do not match");
              return;
            }
            setLoading(true);
            const result = await updateNewPassword(password);
            if (result.error) {
              setError(result.error);
              setLoading(false);
              return;
            }
            router.replace("/dashboard");
          }}
        >
          <div>
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}
            <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 block">
              New Password
            </label>

            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border border-neutral-800 bg-transparent p-3 pr-12 focus:outline-none focus:border-white transition"
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-neutral-400 mb-2 block">
              Confirm Password
            </label>

            <div className="relative">
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type={showConfirm ? "text" : "password"}
                className="w-full rounded-lg border border-neutral-800 bg-transparent p-3 pr-12 focus:outline-none focus:border-white transition"
                placeholder="Confirm password"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-white/[0.02] p-4">
            <p className="text-xs text-neutral-400 mb-2">
              Password Requirements
            </p>

            <ul className="space-y-1 text-sm text-neutral-500">
              <li>• Minimum 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
              <li>• One special character</li>
            </ul>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
