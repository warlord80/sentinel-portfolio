import { getWriteups } from "@/app/actions/content";
import { WriteupsManager } from "@/components/admin/writeups-manager";

export default async function WriteupsPage() {
  const writeups = await getWriteups();
  return <WriteupsManager items={writeups} />;
}
