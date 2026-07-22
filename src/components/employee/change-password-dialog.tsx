"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ChangePasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  employeeId: string;
  authId: string;
  onSuccess?: () => void;
}

interface passwordForm {
  password: string;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  employeeName,
  employeeId,
  authId,
  onSuccess,
}: ChangePasswordProps) {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<passwordForm>({
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const getProgressColor = (value: number) => {
    if (value === 0) return "bg-red-500";
    if (value < 100) return "bg-yellow-500";
    return "bg-green-500";
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleGeneratePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const newPass = generateRandomPassword();
          setFormData({ ...formData, password: newPass });
          setPassword(generateRandomPassword());
          return 100;
        }
        return prev + 10;
      });
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    toast.custom((t) => (
      <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,._3)] text-white">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Please generate a password first
          </span>
        </div>
      </div>
    ));

    setLoading(true);

    const { error } = await supabase.rpc("update_user_credentials", {
      target_auth_id: authId,
      new_temp_password: password,
    });

    if (error) {
      toast.custom((t) => (
      <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,._3)] text-white">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Failed to update credentials
          </span>
        </div>
      </div>
    ));

      console.error("RPC Error:", error);
    } else {
      toast.custom((t) => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white transition-all">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-inner">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Credentials updated successfully!
            </span>
          </div>
        </div>
      ));
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Set a new password for {employeeName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="gap-2 flex flex-row items-center">
              <Input
                id="password"
                readOnly
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Button type="button" onClick={handleGeneratePassword}>
                Generate
              </Button>
            </div>

            <div className="w-full h-1.5 bg-muted rounded-2xl overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor(progress)}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !password}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
