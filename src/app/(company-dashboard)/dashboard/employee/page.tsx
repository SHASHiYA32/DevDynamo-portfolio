"use client";

import { useState } from "react";
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

const initialEmployees = [
  {
    id: "1",
    full_name: "Admin User",
    email: "admin@devdynamo.com",
    role: "admin",
    status: "active",
    created_at: "2026-01-10",
  },
  {
    id: "2",
    full_name: "Kasun Perera",
    email: "kasun@devdynamo.com",
    role: "manager",
    status: "active",
    created_at: "2026-02-15",
  },
  {
    id: "3",
    full_name: "Nimmi Silva",
    email: "nimmi@devdynamo.com",
    role: "staff",
    status: "deactive",
    created_at: "2026-03-01",
  },
];

export default function EmployeeTab() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [isPswOpen, setIsPswOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: "", name: "" });

  const totalUsers = employees.length;
  const activeUsers = employees.filter((e) => e.status === "active").length;
  const deactiveUsers = employees.filter((e) => e.status === "deactive").length;
  const adminCount = employees.filter((e) => e.role === "admin").length;

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "deactive" : "active";
    setEmployees(
      employees.map((e) => (e.id === id ? { ...e, status: nextStatus } : e)),
    );
    toast.success(`User status changed to ${nextStatus}.`);
  };

  const changeRole = (id: string, newRole: string) => {
    setEmployees(
      employees.map((e) => (e.id === id ? { ...e, role: newRole } : e)),
    );
    toast.success(`User role changed to ${newRole}.`);
  };

  const deleteUser = (id: string, name: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
    toast.error(`${name} has been removed.`);
  };

  const showCredentials = (email: string) => {
    alert(`Account Email: ${email}\nPassword: [Encrypted in Auth Database]`);
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
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showCredentials(row.email)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser({ id: row.id, name: row.full_name });
                        setIsPswOpen(true);
                      }}
                    >
                      <Key className="h-3.5 w-3.5 mr-1" /> Change Psw
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger >
                      <div>
                        <MoreVertical className="h-4 w-4" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* Wrap top-level items in a group to satisfy context */}
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => toggleStatus(row.id, row.status)}
                        >
                          {row.status === "active"
                            ? "Deactivate Account"
                            : "Activate Account"}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => changeRole(row.id, "admin")}
                        >
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => changeRole(row.id, "manager")}
                        >
                          Make Manager
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => changeRole(row.id, "staff")}
                        >
                          Make Staff
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => alert("View Profile")}>
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteUser(row.id, row.full_name)}
                      >
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
      />
    </div>
  );
}
