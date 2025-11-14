import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const AIsummerizeCommit = async (diff: string) => {
  const response = await model.generateContent([
    `
    You are an expert programmer, and your task is to **summarize a git diff** clearly and concisely.
    
    ### Git Diff Format Reminder
    Each file in a diff has metadata lines like:
    \`\`\`
    diff --git a/lib/index.js b/lib/index.js
    index aadf691..bfef603 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \`\`\`
    - A line starting with \`+\` means code was **added**.  
    - A line starting with \`-\` means code was **deleted**.  
    - Lines with neither \`+\` nor \`-\` are for **context only**.  
    
    ### Example Summary Comments
    \`\`\`
    * Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
    * Fixed a typo in the GitHub Action name [.github/workflows/gpt-commit-summarizer.yml]
    * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
    * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
    * Lowered numeric tolerance for test files
    \`\`\`
    
    ### Instructions
    - Output a **human-readable summary** of what changed in the commit.
    - Use bullet points for each significant change.
    - Mention filenames when useful.
    - Be brief but specific.
    - Do not repeat the example above — use only the real diff content provided below.
    
    Now summarize the following diff:
    \`\`\`diff
    {${diff}}
    \`\`\`
    `,
  ]);
  return response.response.text();
};
