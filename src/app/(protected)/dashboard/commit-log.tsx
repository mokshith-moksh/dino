"use client";
import UseProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
const CommitLog = () => {
  const { projectId, project } = UseProject();
  const { data: commits } = api.project.getCommits.useQuery({
    projectId: projectId!,
  });
  return (
    <>
      <ul className="w-full space-y-6">
        {commits?.map((commit, commitIdx) => (
          <li key={commit.id} className="relative flex gap-x-4">
            <div
              className={cn(
                commitIdx === commits.length - 1 ? "h-6" : "-bottom-6",
                "absolute top-0 left-0 flex w-6 justify-center",
              )}
            >
              <div className="w-0.5 translate-x-1 bg-gray-200" />
            </div>
            <>
              <img
                src={commit.commitAutherAvatar}
                alt="commit avatar"
                className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
              />
              <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-gray-200 ring-inset">
                <div className="flex justify-between gap-x-5">
                  <Link
                    target="_blank"
                    href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                    className="flex gap-10 py-0.5 text-xs leading-5 text-gray-500 hover:underline"
                  >
                    <span className="font-medium text-gray-900">
                      {commit.commitMessage}
                    </span>
                    <span className="inline-flex items-center">
                      commited
                      <ExternalLink className="ml-2 size-4" />
                    </span>
                  </Link>
                </div>
                <span className="font-semibold">{commit.commitMessage}</span>
                <pre className="mt-1 max-w-full overflow-x-auto rounded-md bg-gray-100 p-3 text-sm text-wrap text-gray-700">
                  {commit.summary}
                </pre>
              </div>
            </>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CommitLog;
