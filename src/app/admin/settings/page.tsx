import { getSiteSettings } from "@/app/actions/admin";
import { SettingsManager } from "@/components/admin/settings-manager";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsManager settings={settings} />;
}
