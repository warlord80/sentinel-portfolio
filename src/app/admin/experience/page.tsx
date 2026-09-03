import { getExperience } from "@/app/actions/content";
import { ExperienceManager } from "@/components/admin/experience-manager";

export default async function ExperiencePage() {
  const experience = await getExperience();
  return <ExperienceManager items={experience} />;
}
