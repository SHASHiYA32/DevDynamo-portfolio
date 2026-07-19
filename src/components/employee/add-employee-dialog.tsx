"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmployee } from "@/app/actions/auth";
import { getRoles } from "@/app/actions/roles";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmployeeForm {
  full_name: string;
  email: string;
  role_id: number | null;
  password: string;
}

export function AddEmployeeDialog({ open, onOpenChange }: Props) {
  const [formData, setFormData] = useState<EmployeeForm>({
    full_name: "",
    email: "",
    role_id: null,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [roles, setRoles] = useState<{ id: number; role: string }[]>([]);

  useEffect(() => {
    if (open) {
      getRoles().then(setRoles);
    }
  }, [open]);

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
          return 100;
        }
        return prev + 10;
      });
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createEmployee(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Employee added successfully!");
      onOpenChange(false);
      setFormData({ full_name: "", email: "", role_id: null, password: "" });
      setProgress(0);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>User Role</Label>
            <Select
              value={formData.role_id !== null ? formData.role_id.toString() : ""}
              onValueChange={(val) =>
                setFormData({ ...formData, role_id: val ? parseInt(val, 10) : null })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Initial Password</Label>
            <div className="gap-2 flex flex-row items-center">
              <Input
                id="password"
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

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Saving..." : "Save Employee"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
