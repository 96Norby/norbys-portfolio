import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Norbert Reyes — Operations Leader · Data & Analytics Portfolio",
      },
      {
        name: "description",
        content:
          "Norbert Reyes is a Vancouver-based operations leader at Vancouver International Airport (YVR) transitioning into data analytics. Projects, experience, certifications and contact.",
      },
      {
        property: "og:title",
        content: "Norbert Reyes — Operations Leader · Data & Analytics Portfolio",
      },
      {
        property: "og:description",
        content:
          "Bridging frontline service delivery with operational execution and real-time data problem solving in Vancouver, BC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Norbert Reyes — Operations Leader · Data & Analytics Portfolio",
      },
      {
        name: "twitter:description",
        content:
          "Bridging frontline service delivery with operational execution and real-time data problem solving in Vancouver, BC.",
      },
    ],
  }),
  component: Portfolio,
});

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-5">
        <a href="#top" className="font-mono text-sm font-medium tracking-tight">
          norby<span className="text-primary">.ca</span>
        </a>
        <nav className="flex items-center gap-4 text-[13px] text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

const HERO_BARS = [30, 44, 38, 56, 48, 66, 58, 76, 68, 86, 78, 100];

function Sparkline() {
  return (
    <div aria-hidden="true" className="mt-12 w-full max-w-sm">
      <div className="flex h-16 items-end gap-1">
        {HERO_BARS.map((height, i) => (
          <span
            key={i}
            style={{ height: `${height}%` }}
            className={
              i === HERO_BARS.length - 1
                ? "flex-1 rounded-t-sm bg-primary"
                : "flex-1 rounded-t-sm bg-border"
            }
          />
        ))}
      </div>
      <div className="mt-2 h-px w-full bg-border" />
      <div className="mt-1.5 flex justify-between font-mono text-[9px] text-muted-foreground/70">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-2xl flex-col justify-center px-5 py-16">
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
          Norbert Reyes
        </h1>
        <p className="mt-5 font-display text-lg font-medium leading-snug text-foreground/90">
          Operations Leader · Guest Experience Specialist · Data &amp; AI Enthusiast
        </p>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Bridging frontline service delivery with operational execution and
          real-time data problem solving in Vancouver, BC.
        </p>
        <p className="mt-5 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          Vancouver / Richmond, BC
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Get in touch
          </a>
        </div>
        <Sparkline />
      </div>
    </section>
  );
}

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-primary">{index}</span>
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}

const FOCUS_CARDS = [
  {
    title: "Operational Focus",
    body: "Real-time resource coordination, SOP development, and shift leadership.",
  },
  {
    title: "Guest Relations",
    body: "High-stakes de-escalation, conflict resolution, and candidate experience.",
  },
  {
    title: "Continuous Learning",
    body: "Applied AI fundamentals, relational database study, and modern data analytics.",
  },
];

function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-2xl px-5 py-16">
        <SectionHeading index="01" title="About Me" />
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          I focus on connecting complex operational logistics with high-empathy
          guest relations. Having led shift operations and guest recovery across
          terminal sectors at Vancouver International Airport (YVR), I bring a
          continuous curiosity for asking "why" and translating operational
          metrics into practical solutions.
        </p>
        <div className="mt-8 grid gap-3">
          {FOCUS_CARDS.map((card, i) => (
            <div
              key={card.title}
              className="rounded-xl border border-border bg-card/60 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[15px] font-semibold">{card.title}</h3>
                <span className="font-mono text-[10px] text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    id: "P·01",
    title: "Airport Terminal Flow & Readiness Analysis",
    body: "Auditing passenger movement bottlenecks across terminal gates to synthesize actionable shift readiness guidelines.",
    tags: ["Operations Analysis", "Process Improvement"],
  },
  {
    id: "P·02",
    title: "Live Flight Operations Analytics Concept",
    body: "Exploring real-time flight telemetry datasets to build shift-performance tracking dashboards using Power BI & SQL.",
    tags: ["Power BI", "SQL", "Dashboards"],
  },
  {
    id: "P·03",
    title: "App Architectures & Product Specs",
    body: "Functional requirements and milestone tracking designs for mobile health and habit-accountability tools.",
    tags: ["Product Specs", "UX Planning"],
  },
];

function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-2xl px-5 py-16">
        <SectionHeading index="02" title="Projects" />
        <div className="mt-8 grid gap-3">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className="rounded-xl border border-border bg-card/60 p-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
                  {project.title}
                </h3>
                <span className="ml-3 shrink-0 font-mono text-[10px] text-muted-foreground">
                  {project.id}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {project.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const ROLES = [
  {
    org: "Vancouver Airport Authority",
    period: "2024 — Present",
    title:
      "Guest Experience Representative (2024–Present) & Operations Zone Lead (2025–2026)",
    current: true,
  },
  {
    org: "Alliance Ground International",
    period: "2022 — 2024",
    title: "Lead Baggage Relief Agent / Baggage Agent (2022–2024)",
    current: false,
  },
  {
    org: "Amazon",
    period: "2021 — 2022",
    title: "Fulfillment Associate (2021–2022)",
    current: false,
  },
];

const CERTIFICATIONS = [
  "Google AI Professional",
  "Google Data Analytics (Foundations)",
  "TESOL",
];

function Resume() {
  return (
    <section id="resume" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-2xl px-5 py-16">
        <SectionHeading index="03" title="Resume & Experience" />
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          A track record in fast-paced terminal, ramp logistics, and fulfillment
          environments:
        </p>

        <ol className="mt-8 space-y-8 border-l border-border pl-6">
          {ROLES.map((role) => (
            <li key={role.org} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[27px] top-1.5 size-2.5 rounded-full ${
                  role.current
                    ? "bg-primary ring-4 ring-primary/20"
                    : "bg-muted-foreground/50"
                }`}
              />
              <p
                className={`font-mono text-[11px] uppercase tracking-[0.15em] ${
                  role.current ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {role.period}
              </p>
              <h3 className="mt-1.5 font-display text-base font-semibold tracking-tight">
                {role.org}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {role.title}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Certifications
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CERTIFICATIONS.map((cert) => (
              <span
                key={cert}
                className="rounded-md border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-foreground/90"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-2xl px-5 py-16">
        <SectionHeading index="04" title="Get in touch" />
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Open to data analyst roles and analytics conversations in the
          Vancouver area.
        </p>
        <div className="mt-7 grid gap-3">
          <a
            href="mailto:norbertreyes96@gmail.com"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
          >
            norbertreyes96@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/norbertreyes1996/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card/60 px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            LinkedIn · norbertreyes1996
          </a>
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <div id="top" className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-6">
          <p className="font-mono text-[11px] text-muted-foreground">
            © 2026 Norbert Reyes · norby.ca
          </p>
          <a
            href="#top"
            className="font-mono text-[11px] text-primary transition-colors hover:text-foreground"
          >
            TOP ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
