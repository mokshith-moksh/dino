"use client";
import React from "react";
import { useForm } from "react-hook-form";
// import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import UseRefetch from "@/hooks/use-refetch";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};
const Create = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refresh = UseRefetch();
  const onSubmit = (data: FormInput) => {
    try {
      createProject.mutate(
        {
          githubUrl: data.repoUrl,
          name: data.projectName,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            toast("Project created successfully!");
            void refresh();
          },
          onError: (error) => {
            alert(`Error creating project: ${error.message}`);
          },
        },
      );
      reset();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
  return (
    <div className="flex h-full justify-center gap-12">
      <div>
        {/* <Image
          src={"/github-tile.svg"}
          className="hidden md:block"
          alt="Create Project Illustration"
          width={100}
          height={100}
        /> */}
        <div className="mt-32">
          <h1 className="text-2xl font-semibold">Link yout Github Repo</h1>
          <p>
            Connect your GitHub repository to quickly set up your project with
            our automated tools.
          </p>
          <div className="h-4"></div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="h-4"></div>
              <Input
                placeholder="Project Name"
                {...register("projectName", { required: true })}
                required
              />
              <div className="h-4"></div>
              <Input
                placeholder="REPO URL"
                {...register("repoUrl", { required: true })}
                required
              />
              <div className="h-4"></div>
              <Input
                placeholder="Githun token (Optional)"
                {...register("githubToken")}
              />
              <Button
                type="submit"
                disabled={createProject.isPending}
                className="mt-4 w-full"
              >
                Create Project
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
