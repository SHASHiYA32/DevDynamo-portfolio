"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/login";
import { Button } from "@/components/ui/button";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white font-sans">
      <div className="fixed inset-0 z-0 bg-[#050509]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <img
          src="/logo/DevDynamo.svg"
          itemType="svg"
          alt="DevDynamo"
          className="opacity-5 logosvg "
        />
      </div>
      <div className=" z-10 w-full max-w-md backdrop-blur-sm border border-neutral-800 p-8 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">DevDynamo</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Employee Access Portal
          </p>
        </div>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();

            setLoading(true);

            const form = new FormData(e.currentTarget);

            const email = form.get("email") as string;
            const password = form.get("password") as string;

            const result = await loginUser(email, password);

            if (result.error) {
              setError(result.error);
              setLoading(false);
              return;
            }

            if (result.temporary) {
              router.push("/new-password");
            } else {
              router.push("/dashboard");
            }
          }}
        >
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
              Work Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors"
              placeholder="name@devdynamo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button className="w-full h-10" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-xs text-neutral-500 hover:text-white transition-colors"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
