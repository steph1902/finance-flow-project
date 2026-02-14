"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, GitCommit, Plus, Tag, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

interface Version {
  id: string;
  version: string;
  changelog: string;
  deployer: string;
  environment: string;
  isCurrent: boolean;
  deployedAt: string;
}

export default function VersioningPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/versioning");
      const data = await res.json();
      setVersions(data);
    } catch (error) {
      console.error("Failed to fetch versions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await fetch("/api/versioning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setIsCreateOpen(false);
      reset();
      fetchVersions();
    } catch (error) {
      console.error("Failed to create version", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Versioning & Updates
          </h1>
          <p className="text-muted-foreground">
            Track deployment history and changelogs.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Release
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Release</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Version</label>
                <Input
                  {...register("version")}
                  placeholder="e.g. 1.2.0"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Environment</label>
                <Input
                  {...register("environment")}
                  defaultValue="production"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deployer</label>
                <Input
                  {...register("deployer")}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Changelog</label>
                <Textarea
                  {...register("changelog")}
                  placeholder="What changed?"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create Release</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative border-l border-border ml-4 space-y-8 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : versions.length === 0 ? (
          <div className="pl-8 text-muted-foreground">
            No versions deployed yet.
          </div>
        ) : (
          versions.map((version) => (
            <div key={version.id} className="relative pl-8">
              <div
                className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${version.isCurrent ? "bg-primary border-primary" : "bg-background border-muted-foreground"}`}
              />

              <Card
                className={
                  version.isCurrent ? "border-primary/50 shadow-md" : ""
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        {version.version}
                      </CardTitle>
                      {version.isCurrent && <Badge>Current</Badge>}
                      <Badge variant="outline">{version.environment}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {version.deployer}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(
                          new Date(version.deployedAt),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                    {version.changelog}
                  </pre>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
