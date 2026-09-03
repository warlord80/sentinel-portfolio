import { getAllProjects } from "@/app/actions/content";
import { ProjectsManager } from "@/components/admin/projects-manager";

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectsManager projects={projects} />;
}
