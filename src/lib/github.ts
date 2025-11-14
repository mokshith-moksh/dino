import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { AIsummerizeCommit } from "./gemini";
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
type Response = {
  commitMessage: string;
  commitHash: string;
  commitAutherName: string;
  commitAutherAvatar: string;
  commitDate: Date;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  try {
    const parts = githubUrl.split("/");
    const owner = parts[3];
    const repo = parts[4];
    if (!owner || !repo) {
      throw new Error("Invalid GitHub URL");
    }
    const { data } = await octokit.rest.repos.listCommits({
      owner: owner,
      repo: repo,
    });
    const sortedCommit = data.sort(
      (a, b) =>
        new Date(b.commit.author!.date!).getTime() -
        new Date(a.commit.author!.date!).getTime(),
    );
    return sortedCommit.slice(0, 10).map((commit) => ({
      commitMessage: commit.commit.message,
      commitHash: commit.sha,
      commitAutherName: commit.commit.author!.name!,
      commitAutherAvatar: commit.author?.avatar_url ?? "",
      commitDate: new Date(commit.commit.author!.date!),
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch commit hashes");
  }
};

export const pollCommits = async (projectId: string) => {
  const { githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unporcessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );
  const summeryResponse = await Promise.allSettled(
    unporcessedCommits.map((commit) => {
      return summerizeCommit(githubUrl, commit.commitHash);
    }),
  );
  const summaries = summeryResponse.map((response) => {
    if (response.status === "fulfilled") {
      return response.value;
    }
    return "Summary generation failed";
  });
  const commit = await db.commit.createMany({
    data: summaries.map((summery, index) => {
      return {
        projectId: projectId,
        commitHash: unporcessedCommits[index]!.commitHash,
        commitMessage: unporcessedCommits[index]!.commitMessage,
        commitAutherName: unporcessedCommits[index]!.commitAutherName,
        commitAutherAvatar: unporcessedCommits[index]!.commitAutherAvatar,
        commitDate: unporcessedCommits[index]!.commitDate,
        summary: summery,
      };
    }),
  });
  return commit;
};

async function summerizeCommit(githubUrl: string, commitHash: string) {
  const parts = githubUrl.split("/");
  const owner = parts[3];
  const repo = parts[4];

  const data = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/commits/${commitHash}`,
    {
      headers: {
        Accept: "application/vnd.github.v3.diff",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  );

  return await AIsummerizeCommit(JSON.stringify(data.data));
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project?.githubUrl) {
    throw new Error("Project or GitHub URL not found");
  }
  return { project, githubUrl: project?.githubUrl };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  const processedCommits = await db.commit.findMany({
    where: {
      projectId,
    },
  });
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processed) => processed.commitHash == commit.commitHash,
      ),
  );
  return unprocessedCommits;
}
