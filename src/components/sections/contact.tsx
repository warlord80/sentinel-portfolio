"use client";

import { useActionState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { submitContact } from "@/app/actions/content";

const socials = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/chibuike-nwozor",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/youravgtechdude",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/2348157159802",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

/**
 * Contact — form wired to Supabase via server action.
 * Social links for WhatsApp, LinkedIn, X below the form.
 */
export function Contact() {
  const [state, formAction, isPending] = useActionState(submitContact, null);

  return (
    <section id="contact" className="scroll-mt-24 pb-[96px] pt-[96px] max-md:pb-[64px] max-md:pt-[64px]">
      <Container>
        <Reveal>
          <SectionHeading index="07" eyebrow="Get in touch" title="Contact" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-prose font-sans text-base text-muted">
            For opportunities, questions about the work here, or anything else —
            the fastest route is email.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <form action={formAction} className="mt-12 max-w-[560px] space-y-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-name"
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
              >
                Name
              </label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-email"
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
              >
                Email
              </label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-message"
              className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
            >
              Message
            </label>
            <Textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="Your message"
              required
            />
          </div>

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2" role="status" aria-live="polite">
                <span className="spinner" />
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </Button>

          {state?.success && (
            <div className="flex items-center gap-2 rounded-sm border border-accent/30 bg-accent/5 px-4 py-3" role="status" aria-live="polite">
              <svg className="h-4 w-4 text-accent" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 8.5l3.5 3.5 6.5-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="font-sans text-sm text-accent">
                Message sent successfully.
              </p>
            </div>
          )}
          {state?.error && (
            <div className="flex items-center gap-2 rounded-sm border border-red-500/30 bg-red-500/5 px-4 py-3" role="alert" aria-live="assertive">
              <svg className="h-4 w-4 text-red-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5v3M8 10.5v.5" strokeLinecap="round" />
              </svg>
              <p className="font-sans text-sm text-red-400">
                {state.error}
              </p>
            </div>
          )}
        </form>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Also on
            </span>
            <div className="h-px flex-1 max-w-[60px] bg-line" />
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="group/social relative flex h-11 w-11 items-center justify-center rounded-sm border border-line text-muted transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
