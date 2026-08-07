"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";

interface Project {
  id: string;
  project_name: string;
  budget: number | null;
  assigned_developers: string[] | null;
  requirements: string | null;
  live_link: string | null;
  created_at: string;
}

interface Developer {
  id: string;
  full_name: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [developersList, setDevelopersList] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedDevelopers, setSelectedDevelopers] = useState<string[]>([]);
  const [requirements, setRequirements] = useState("");
  const [liveLink, setLiveLink] = useState("");

  const supabase = createClient();

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const fetchDevelopers = async () => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, full_name");

    if (!error && data) {
      setDevelopersList(data);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedBudget = budget ? parseFloat(budget) : null;

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update({
          project_name: projectName,
          budget: formattedBudget,
          assigned_developers: selectedDevelopers,
          requirements,
          live_link: liveLink,
        })
        .eq("id", editingProject.id);

      if (!error) {
        fetchProjects();
        handleCloseModal();
      }
    } else {
      const { error } = await supabase.from("projects").insert([
        {
          project_name: projectName,
          budget: formattedBudget,
          assigned_developers: selectedDevelopers,
          requirements,
          live_link: liveLink,
        },
      ]);

      if (!error) {
        fetchProjects();
        handleCloseModal();
      }
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.project_name || "");
    setBudget(project.budget ? project.budget.toString() : "");
    setSelectedDevelopers(project.assigned_developers || []);
    setRequirements(project.requirements || "");
    setLiveLink(project.live_link || "");
    setIsOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingProject(null);
    setProjectName("");
    setBudget("");
    setSelectedDevelopers([]);
    setRequirements("");
    setLiveLink("");
  };

  const toggleDeveloperSelection = (name: string) => {
    if (selectedDevelopers.includes(name)) {
      setSelectedDevelopers(selectedDevelopers.filter((d) => d !== name));
    } else {
      setSelectedDevelopers([...selectedDevelopers, name]);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Projects Management
          </h1>
          <p className="text-muted-foreground">
            Manage company projects, budgets, and links seamlessly.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add New Project
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveProject} className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  placeholder="e.g. E-Commerce Platform"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Budget ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="5000"
                />
              </div>

              {/* Developer Multi-Select Dropdown */}
              <div>
                <label className="text-sm font-medium">
                  Assigned Developers
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <span className="truncate">
                      {selectedDevelopers.length > 0
                        ? selectedDevelopers.join(", ")
                        : "Select developers..."}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto">
                    {developersList.map((dev) => {
                      const name = dev.full_name || "Unnamed Developer";
                      const isSelected = selectedDevelopers.includes(name);
                      return (
                        <DropdownMenuCheckboxItem
                          key={dev.id}
                          checked={isSelected}
                          onCheckedChange={() => toggleDeveloperSelection(name)}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {name}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Requirements Summary
                </label>
                <Input
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Next.js, Tailwind, Supabase"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Live Link</label>
                <Input
                  type="url"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProject ? "Update Project" : "Save Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Assigned Devs</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Live Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  Loading projects...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="cursor-pointer">
                  <TableCell colSpan={6} className="p-0">
                    <ContextMenu>
                      <ContextMenuTrigger className="contents">
                        <div className="flex w-full items-center">
                          <div className="p-4 font-medium flex-1">
                            {project.project_name}
                          </div>
                          <div className="p-4 flex-1">
                            {project.budget
                              ? `$${Number(project.budget).toLocaleString()}`
                              : "-"}
                          </div>
                          <div className="p-4 flex-1">
                            {project.assigned_developers?.length
                              ? project.assigned_developers.join(", ")
                              : "None"}
                          </div>
                          <div className="p-4 flex-1 max-w-[200px] truncate">
                            {project.requirements || "-"}
                          </div>
                          <div className="p-4 flex-1">
                            {project.live_link ? (
                              <a
                                href={project.live_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center text-primary hover:underline gap-1"
                              >
                                Visit <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              "-"
                            )}
                          </div>
                          <div
                            className="p-4 text-right flex-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 p-0 rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(project)}
                                >
                                  <Pencil className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteClick(project.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => handleEditClick(project)}
                        >
                          <Pencil className="w-4 h-4 mr-2" /> Edit Project
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteClick(project.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Project
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}