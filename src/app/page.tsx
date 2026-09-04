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

export default async function Home() {
  let socialLinks: Awaited<ReturnType<typeof getEnabledSocialLinks>> = [];
  let resumeUrl = "";

  try {
    [socialLinks, resumeUrl] = await Promise.all([
      getEnabledSocialLinks(),
      getResumeUrl(),
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
      <Projects />
      <Experience />
      <Certifications />
      <Writeups />
      <Contact socialLinks={socialLinks} />
      <Footer />
    </>
  );
}
