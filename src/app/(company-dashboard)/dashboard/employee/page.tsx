"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/employee/stat-card";
import { AddEmployeeDialog } from "@/components/employee/add-employee-dialog";
import { ChangePasswordDialog } from "@/components/employee/change-password-dialog";
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  MoreVertical,
  Key,
  Eye,
  Edit,
  Trash2,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface Employee {
  id: string;
  auth_id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  temp_password?: string | null;
  created_at: string;
}

export default function EmployeeTab() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [isPswOpen, setIsPswOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: "", name: "" , auth_id: ""});
  const [isCredsOpen, setIsCredsOpen] = useState(false);
  const [selectedCreds, setSelectedCreds] = useState({
    email: "",
    password: "",
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const totalUsers = employees.length;
  const activeUsers = employees.filter((e) => e.status === "active").length;
  const deactiveUsers = employees.filter((e) => e.status === "deactive").length;
  const adminCount = employees.filter((e) => e.role === "admin").length;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);

    const { data: profiles, error: profileError } = await supabase.from(
      "user_profiles",
    ).select(`
      id,
      full_name,
      tempory_psw,
      auth_id,
      email,
      status,
      role:role_id (role)
    `);

    if (profileError) {
      toast.custom((t) => (
        <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,._3)] text-white">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Failed to load employees</span>
          </div>
        </div>
      ));
      console.error(profileError);
      setLoading(false);
      return;
    }

    const formatted: Employee[] = profiles.map((e: any) => ({
      id: e.id.toString(),
      auth_id: e.auth_id,
      full_name: e.full_name || "Unknown",
      email: e.email, 
      role: (Array.isArray(e.role) ? e.role[0]?.role : e.role?.role) || "staff",
      status: e.status,
      temp_password: e.tempory_psw,
      created_at: e.created_at || new Date().toISOString(),
    }));

    console.log("data" , profiles)

    setEmployees(formatted);
    setLoading(false);
  };

  const showCredentials = (user: any) => {
    const passwordToDisplay =
      user.temp_password || user.password || "No tempory password set";
    setSelectedCreds({ email: user.email, password: passwordToDisplay });
    setIsCredsOpen(true);
  };

  // 3. Helper to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.custom((t) => (
      <div className="flex items-center gap-3 w-full max-w-sm rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-4 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white transition-all">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-inner">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">Copied to clipboard!</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Employee Directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage roles, control account status updates, and credentials.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>Add Employee</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="All Users" value={totalUsers} icon={Users} />
        <StatCard
          title="Active Employees"
          value={activeUsers}
          icon={UserCheck}
        />
        <StatCard
          title="Deactive Employees"
          value={deactiveUsers}
          icon={UserX}
        />
        <StatCard
          title="Admins / Management"
          value={adminCount}
          icon={ShieldAlert}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Credentials</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{row.full_name}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.role === "admin"
                        ? "destructive"
                        : row.role === "manager"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {row.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={row.status === "active" ? "success" : "outline"}
                    className="uppercase"
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showCredentials(row)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser({ id: row.id, name: row.full_name, auth_id: row.auth_id });
                        setIsPswOpen(true);
                      }}
                    >
                      <Key className="h-3.5 w-3.5 mr-1" /> Change Psw
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div>
                        <MoreVertical className="h-4 w-4" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* Wrap top-level items in a group to satisfy context */}
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          {row.status === "active"
                            ? "Deactivate Account"
                            : "Activate Account"}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuItem>Make Admin</DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => alert("View Profile")}>
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddEmployeeDialog open={isAddOpen} onOpenChange={setIsAddOpen} />

      <ChangePasswordDialog
        open={isPswOpen}
        onOpenChange={setIsPswOpen}
        employeeName={selectedUser.name}
        employeeId={selectedUser.id}
        authId={selectedUser.auth_id}
        onSuccess={fetchEmployees}
      />

      <Dialog open={isCredsOpen} onOpenChange={setIsCredsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <div className="flex gap-2">
                <Input value={selectedCreds.email} readOnly />
                <Button onClick={() => copyToClipboard(selectedCreds.email)}>
                  Copy
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <div className="flex gap-2">
                <Input type="text" value={selectedCreds.password} readOnly />
                <Button onClick={() => copyToClipboard(selectedCreds.password)}>
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
