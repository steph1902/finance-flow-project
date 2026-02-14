"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitCommit,
  Tag,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  Rocket,
  CheckCircle2,
} from "lucide-react";

interface Version {
  id: string;
  version: string;
  changelog: string;
  deployer: string;
  environment: string;
  isCurrent: boolean;
  deployedAt: string;
}

export default function WhatsNewPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await fetch("/api/versioning");
        const data = await res.json();
        setVersions(data);
        // Expand the latest version by default
        if (data.length > 0) {
          setExpandedVersion(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch versions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedVersion(expandedVersion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            <span>Release Notes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4 font-serif">
            What's New in FinanceFlow
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and bug
            fixes.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-neutral-200 hidden md:block"></div>

          <div className="space-y-12">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                No release notes found.
              </div>
            ) : (
              versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-0 md:pl-24"
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-[31px] top-6 w-4 h-4 rounded-full border-4 border-white shadow-sm hidden md:block ${
                      version.isCurrent
                        ? "bg-green-500 ring-4 ring-green-100"
                        : "bg-neutral-300"
                    }`}
                  ></div>

                  {/* Date Label (Desktop) */}
                  <div className="absolute left-0 top-5 w-24 text-right pr-8 text-sm text-neutral-500 font-medium hidden md:block">
                    {format(new Date(version.deployedAt), "MMM d")}
                  </div>

                  <Card
                    className={`border-none shadow-soft overflow-hidden transition-all duration-200 ${
                      expandedVersion === version.id
                        ? "ring-1 ring-neutral-200"
                        : "hover:shadow-md"
                    }`}
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => toggleExpand(version.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-neutral-400" />
                            <h3 className="text-xl font-bold text-neutral-900">
                              v{version.version}
                            </h3>
                          </div>
                          {version.isCurrent && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                              Current Version
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="text-neutral-500 font-normal"
                          >
                            {version.environment}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          <div className="flex items-center gap-1 md:hidden">
                            <Calendar className="w-4 h-4" />
                            {format(
                              new Date(version.deployedAt),
                              "MMM d, yyyy",
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {version.deployer}
                          </div>
                          {expandedVersion === version.id ? (
                            <ChevronDown className="w-5 h-5 text-neutral-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedVersion === version.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-neutral-100 bg-neutral-50/50"
                      >
                        <div className="p-6 md:p-8">
                          <div className="prose prose-neutral max-w-none">
                            <pre className="font-sans text-neutral-600 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                              {version.changelog}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
