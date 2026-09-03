import { getContactSubmissions } from "@/app/actions/admin";
import { SubmissionsManager } from "@/components/admin/submissions-manager";

export default async function SubmissionsPage() {
  const submissions = await getContactSubmissions();
  return <SubmissionsManager items={submissions} />;
}
