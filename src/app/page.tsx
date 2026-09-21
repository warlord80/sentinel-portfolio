import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Certifications } from "@/components/sections/certifications";
import { Writeups } from "@/components/sections/writeups";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";
import { Ticker } from "@/components/ui/ticker";
import { getEnabledSocialLinks, getResumeUrl } from "@/app/actions/admin";
import { getProjects, getWriteups, getCertifications } from "@/app/actions/content";

export default async function Home() {
  let socialLinks: Awaited<ReturnType<typeof getEnabledSocialLinks>> = [];
  let resumeUrl = "";
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let writeups: Awaited<ReturnType<typeof getWriteups>> = [];
  let certifications: Awaited<ReturnType<typeof getCertifications>> = [];

  try {
    [socialLinks, resumeUrl, projects, writeups, certifications] = await Promise.all([
      getEnabledSocialLinks(),
      getResumeUrl(),
      getProjects(),
      getWriteups(),
      getCertifications(),
    ]);
  } catch {
    // Gracefully fall back to defaults if Supabase queries fail
  }

  return (
    <>
      <Hero resumeUrl={resumeUrl || "/resume.pdf"} />
      <About />
      <Ticker />
      <Skills />
      <Projects initialProjects={projects} />
      <Experience />
      <Certifications initialCertifications={certifications} />
      <Writeups initialWriteups={writeups} />
      <Contact socialLinks={socialLinks} />
      <Footer />
    </>
  );
}
