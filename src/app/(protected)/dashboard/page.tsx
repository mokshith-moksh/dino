"use client";
import useProject from "@/hooks/use-project";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";

const Dashboard = () => {
  const { project } = useProject();

  return (
    <div className="">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-y-4">
        {/* githublink */}
        <div className="bg-primary flex w-fit items-center rounded-md px-4 py-3">
          <Github className="size-6 text-white" />
          <div className="ml-2">
            <p className="flex flex-wrap gap-2 text-sm font-medium text-white">
              This project is connected to
              <Link
                className="inline-flex items-center text-white/80 hover:underline"
                href={project?.githubUrl ?? ""}
              >
                <span>{project?.githubUrl}</span>
                <ExternalLink className="ml-1 size-4" />
              </Link>
            </p>
          </div>
        </div>
        <div className="h-4"></div>

        <div className="flex items-center gap-4">
          TeamMember InviteMember ArchiveMember
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            AskQuestions MeetingCards
          </div>
        </div>
        <div className="mt-8 w-full overscroll-x-auto">
          <CommitLog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
