import { getCertifications } from "@/app/actions/content";
import { CertificationsManager } from "@/components/admin/certifications-manager";

export default async function CertificationsPage() {
  const certs = await getCertifications();
  return <CertificationsManager items={certs} />;
}
