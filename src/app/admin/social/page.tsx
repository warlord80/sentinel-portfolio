import { getSocialLinks } from "@/app/actions/admin";
import { SocialLinksManager } from "@/components/admin/social-links-manager";

export default async function SocialLinksPage() {
  const links = await getSocialLinks();
  return <SocialLinksManager links={links} />;
}
