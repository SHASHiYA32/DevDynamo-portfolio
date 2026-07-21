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
    if (!password) return toast.error("Please generate a password first");

    setLoading(true);

    const { error } = await supabase.rpc("update_user_credentials", {
      target_auth_id: authId,
      new_temp_password: password,
    });

    if (error) {
      toast.error("Failed to update credentials");
      console.error("RPC Error:", error);
    } else {
      toast.success("Credentials updated successfully!");
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
