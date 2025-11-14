import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
const UseProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<
    string | null
  >("Dino-selectedProjectId", null);
  if (!projects) return { projects: [] };
  const project = projects.find((prj) => prj.id == selectedProjectId);
  return {
    projects,
    project,
    projectId: project!.id,
    setSelectedProjectId,
    selectedProjectId,
  };
};

export default UseProject;
