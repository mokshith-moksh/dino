import { pollCommits } from "@/lib/github";
import { createTRPCRouter, protedtedProcedure } from "../trpc";
import * as z from "zod";
export const projectRouter = createTRPCRouter({
  createProject: protedtedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.name,
          userToProject: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });
      await pollCommits(project.id);
      return project;
    }),
  getProjects: protedtedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        userToProject: {
          every: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });
    return projects;
  }),
  getCommits: protedtedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      pollCommits(input.projectId).then().catch(console.error);
      return await ctx.db.commit.findMany({
        where: { projectId: input.projectId },
      });
    }),
});
