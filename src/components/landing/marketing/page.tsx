import { type FormEvent, type ReactNode, useMemo, useState } from "react";

import {
  Alert,
  Badge,
  Accordion,
  Button,
  ButtonGroup,
  Field,
  DatePicker,
  Input,
  TimePicker,
  Textarea,
} from "@/components/ui";
import { Banner } from "@/components/banner";

function Wrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-6 lg:px-8 ${className}`}>{children}</div>;
}

function SectionHead({
  eyebrow,
  title,
  desc,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      {eyebrow ? <p className="text-sm font-semibold text-[rgb(var(--app-accent))]">{eyebrow}</p> : null}
      <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance text-[rgb(var(--app-text))]">{title}</h2>
      {desc ? <p className="max-w-2xl text-lg text-[rgb(var(--app-muted))] text-pretty">{desc}</p> : null}
    </div>
  );
}

const NAV_ITEMS = ["Features", "Pricing", "Docs", "Contact"];

const PRODUCT_LINKS = [
  {
    title: "Analytics",
    desc: "Revenue, churn, and cohorts in real time.",
    icon: "📈",
  },
  {
    title: "Experiments",
    desc: "A/B test pricing and offers quickly.",
    icon: "⚡",
  },
  {
    title: "Segments",
    desc: "Group users by behavior and take action.",
    icon: "👥",
  },
  {
    title: "Alerts",
    desc: "Detect metric drift before it turns into churn.",
    icon: "🔔",
  },
  {
    title: "Security",
    desc: "SSO, roles, and audit trails by default.",
    icon: "🛡️",
  },
  {
    title: "Global",
    desc: "Multi-currency and regional defaults baked in.",
    icon: "🌐",
  },
];

export function LandingBanner() {
  return (
    <Banner id="boilerplate-template-release-v1" variant="brand">
      New template release: faster AI workflows, polished dark/light defaults, and shared store setup.
    </Banner>
  );
}

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))/0.85] backdrop-blur-md">
      <Wrap className="flex w-full items-center gap-4 py-3">
        <a href="#" className="font-semibold">
          Boilerplate
        </a>
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          <div className="group relative">
            <button
              type="button"
              className="rounded-app px-3 py-1.5 text-sm font-medium text-[rgb(var(--app-muted))] transition hover:bg-[rgb(var(--app-panel))] hover:text-[rgb(var(--app-text))]"
            >
              Product
            </button>
            <div className="absolute left-0 top-full z-10 mt-2 hidden w-[26rem] rounded-app border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] p-2 shadow-lg group-hover:block">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PRODUCT_LINKS.map((link) => (
                  <a
                    key={link.title}
                    href="#"
                    className="rounded-app px-3 py-2 text-sm text-[rgb(var(--app-muted))] transition hover:bg-[rgb(var(--app-bg))] hover:text-[rgb(var(--app-text))]"
                  >
                    <div className="font-medium text-[rgb(var(--app-text))]">{link.icon} {link.title}</div>
                    <p className="text-xs text-[rgb(var(--app-muted))]">{link.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-app px-3 py-1.5 text-sm font-medium text-[rgb(var(--app-muted))] transition hover:bg-[rgb(var(--app-panel))] hover:text-[rgb(var(--app-text))]"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button size="sm" variant="secondary">
            Sign in
          </Button>
          <Button size="sm">Get started</Button>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="ml-auto rounded-md p-1.5 text-[rgb(var(--app-muted))] md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </Wrap>
      {open ? (
        <div className="border-t border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] px-6 py-4 md:hidden">
          <nav className="mb-4 flex flex-col gap-1">
            <button
              type="button"
              className="rounded-app px-3 py-2 text-left text-sm font-medium text-[rgb(var(--app-text))]"
            >
              Product
            </button>
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="rounded-app px-3 py-2 text-sm font-medium text-[rgb(var(--app-text))]"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" size="md" className="w-full">
              Sign in
            </Button>
            <Button size="md" className="w-full">
              Get started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function LandingHero() {
  return (
    <section id="product" className="relative overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-44 -z-10 mx-auto h-96 max-w-4xl opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(42% 65% at 36% 40%, rgb(var(--app-accent)) 0%, transparent 70%), radial-gradient(38% 60% at 66% 30%, rgb(var(--app-accent-strong)) 0%, transparent 70%)",
        }}
      />
      <Wrap className="flex flex-col items-center gap-8 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] px-3 py-1 text-sm"
        >
          <Badge variant="info" dot>
            New
          </Badge>
          <span className="text-[rgb(var(--app-text))]">v2.0 — marketing reference structure included</span>
        </a>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[rgb(var(--app-text))] sm:text-5xl lg:text-6xl">
          Build faster with a modern React + Vite foundation.
        </h1>
        <p className="max-w-2xl text-lg text-[rgb(var(--app-muted))] text-pretty">
          A complete onboarding-ready starter with Zustand, Biome, pnpm, and practical page patterns inspired by modern SaaS marketing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">Start free</Button>
          <Button size="lg" variant="secondary">
            Open docs
          </Button>
        </div>
        <p className="text-sm text-[rgb(var(--app-muted))]">No credit card required · 14-day trial workflow</p>
        <div className="mt-6 w-full max-w-4xl overflow-hidden rounded-[0.875rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] text-left">
          <div className="flex items-center gap-1.5 border-b border-[rgb(var(--app-border))] px-4 py-3">
            <span className="size-3 rounded-full bg-[rgb(var(--app-accent))]" />
            <span className="size-3 rounded-full bg-[rgb(var(--app-accent))] opacity-80" />
            <span className="size-3 rounded-full bg-[rgb(var(--app-accent))] opacity-55" />
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <StatCard label="Revenue" value="$358.9K" change={13.6} />
            <StatCard label="Active users" value="18.2k" change={14.1} />
            <StatCard label="Active trials" value="924" change={18.6} />
          </div>
          <div className="px-5 pb-5">
            <SimpleBarChart data={[58, 72, 40, 62, 30, 70, 74, 48, 62, 42, 54, 80]} />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: number;
}) {
  return (
    <article className="rounded-[0.75rem] border border-[rgb(var(--app-border))] p-4">
      <p className="text-sm text-[rgb(var(--app-muted))]">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-green-500">+{change}%</p>
    </article>
  );
}

function SimpleBarChart({ data }: { data: number[] }) {
  return (
    <div className="grid h-28 grid-cols-12 gap-1 rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))] p-2 align-end">
      {data.map((value, index) => (
        <span
          key={`${value}-${index}`}
          style={{
            height: `${Math.max(12, (value / 100) * 100)}%`,
          }}
          className="mx-auto block w-full max-w-8 rounded-sm bg-[rgb(var(--app-accent))]"
          aria-hidden
        />
      ))}
    </div>
  );
}

export function LandingProof() {
  const stats = useMemo(
    () => [
      { title: "Events ingested / day", value: "2.4M" },
      { title: "Median query time", value: "48ms" },
      { title: "Route-to-route sync", value: "99.9%" },
      { title: "Seeded projects", value: "12k+" },
    ],
    [],
  );

  return (
    <section className="py-16">
      <Wrap>
        <div className="grid grid-cols-2 rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] lg:grid-cols-4">
          {stats.map((item, index) => (
            <article
              key={item.title}
              className={`flex flex-col items-center gap-1 px-6 py-8 text-center sm:px-8 ${
                index % 2 === 1 ? "border-l border-[rgb(var(--app-border))]" : ""
              } ${index >= 2 ? "border-t border-[rgb(var(--app-border))] lg:border-t-0" : ""}`}
            >
              <p className="text-2xl font-semibold text-[rgb(var(--app-text))]">{item.value}</p>
              <p className="text-sm text-[rgb(var(--app-muted))]">{item.title}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

export function LandingFeatures() {
  const features = [
    {
      title: "Real-time analytics",
      description: "Revenue, churn, and cohorts update live for clear, timely decisions.",
      icon: "📊",
    },
    {
      title: "Experiments",
      description: "Run pricing and feature experiments with visible outcomes quickly.",
      icon: "⚡",
    },
    {
      title: "Customer segments",
      description: "Group users by plan and behavior to drive targeted actions.",
      icon: "👥",
    },
    {
      title: "Secure by default",
      description: "Roles, audit visibility, and policy-aware operations included.",
      icon: "🛡️",
    },
    {
      title: "Global by default",
      description: "Multi-region formats and currency handling are expected from day one.",
      icon: "🌍",
    },
    {
      title: "Smart alerts",
      description: "Receive signals the moment metrics drift from expected ranges.",
      icon: "🔔",
    },
  ];

  return (
    <section id="features" className="border-y border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))] py-14">
      <Wrap className="flex flex-col gap-14">
        <SectionHead
          eyebrow="Everything you need"
          title="One starter for the whole product story"
          desc="From first trial to retention, keep your dashboard consistent and boring in the best way."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col gap-3 rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] p-5"
            >
              <p className="grid size-11 place-items-center rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] text-lg">
                {feature.icon}
              </p>
              <h3 className="text-base font-semibold text-[rgb(var(--app-text))]">{feature.title}</h3>
              <p className="text-sm text-[rgb(var(--app-muted))]">{feature.description}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

export function LandingPricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const plans = useMemo(
    () => [
      {
        name: "Starter",
        monthly: 0,
        annual: 0,
        blurb: "For early teams and prototypes.",
        highlights: ["Up to 1k events/mo", "One teammate", "7-day history", "Community support"],
        cta: "Start free",
      },
      {
        name: "Pro",
        monthly: 49,
        annual: 39,
        blurb: "For teams shipping every week.",
        highlights: [
          "Unlimited events",
          "Unlimited seats",
          "A/B test support",
          "SSO + audit logs",
          "Priority support",
        ],
        cta: "Start free trial",
      },
      {
        name: "Enterprise",
        monthly: null,
        annual: null,
        blurb: "For compliance-heavy or high scale usage.",
        highlights: [
          "Everything in Pro",
          "SAML + role policies",
          "Dedicated support",
          "99.99% SLA",
          "Custom contracts",
        ],
        cta: "Contact sales",
      },
    ],
    [],
  );

  return (
    <section className="py-20 lg:py-28" id="pricing">
      <Wrap className="flex flex-col items-center gap-8">
        <SectionHead
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          desc="Start free. Upgrade if you need it. Cancel anytime."
          center={true}
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ButtonGroup
            aria-label="Billing period"
            value={isAnnual ? "annual" : "monthly"}
            onChange={(value) => setIsAnnual(value === "annual")}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "annual", label: "Annual" },
            ]}
          />
          <Badge variant="success">Save 20%</Badge>
        </div>
        <div className="grid w-full gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const amount = isAnnual ? plan.annual : plan.monthly;

            return (
              <article
                key={plan.name}
                className={`relative flex flex-col gap-6 rounded-[0.75rem] border p-6 ${
                  plan.name === "Pro"
                    ? "border-[rgb(var(--app-accent))] bg-[rgb(var(--app-panel))] shadow-xl"
                    : "border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))]"
                }`}
              >
                {plan.name === "Pro" ? (
                  <span className="absolute -top-3 left-6">
                    <Badge
                      variant="info"
                      className="text-[11px] uppercase tracking-[0.11em] px-2.5 py-1 font-semibold"
                      dot
                    >
                      Most popular
                    </Badge>
                  </span>
                ) : null}
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-[rgb(var(--app-text))]">{plan.name}</h3>
                  <p className="text-sm text-[rgb(var(--app-muted))]">{plan.blurb}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  {amount === null ? (
                    <p className="text-3xl font-semibold text-[rgb(var(--app-text))]">Custom</p>
                  ) : (
                    <>
                      <p className="text-4xl font-semibold text-[rgb(var(--app-text))]">${amount}</p>
                      <p className="text-sm text-[rgb(var(--app-muted))]">/mo</p>
                    </>
                  )}
                </div>
                    <Button variant={plan.name === "Enterprise" ? "outline" : "primary"} className="w-full" onClick={() => undefined}>
                  {plan.cta}
                </Button>
                <ul className="space-y-2.5 text-sm text-[rgb(var(--app-text))]">
                  {plan.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="text-sm text-green-500">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

export function LandingSignup() {
  return (
    <section className="py-20" id="contact">
      <Wrap>
        <div className="relative overflow-hidden rounded-[0.75rem] bg-[rgb(var(--app-panel))] border border-[rgb(var(--app-border))] px-8 py-14 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-[rgb(var(--app-text))] sm:text-4xl">
            Ready to launch your project?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-[rgb(var(--app-muted))]">
            Choose the boilerplate path and start building your product in hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">
              Start free
            </Button>
            <Button
              variant="outline"
              size="lg"
            >
              Talk to sales
            </Button>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

export function LandingFAQ() {
  const faq = useMemo(
    () => [
      {
        question: "Can I remove sections later?",
        answer:
          "Yes — all marketing sections are isolated and safe to delete without breaking the rest of the app.",
      },
      {
        question: "Is state in global store only?",
        answer:
          "No. Local and context state remain the default. Zustand is only for cross-tree shared concerns.",
      },
      {
        question: "Can this support enterprise-ready docs and style updates?",
        answer:
          "Yes. Typography, theme tokens, and component structure are designed to scale for long-form documentation pages too.",
      },
    ],
    [],
  );

  return (
    <section className="py-20" id="docs">
      <Wrap className="flex flex-col gap-6">
        <SectionHead title="Questions, answered" />
        <div className="mx-auto w-full max-w-3xl">
          <Accordion
            type="single"
            defaultOpen={[0]}
            items={faq.map((item) => ({
              title: item.question,
              content: item.answer,
            }))}
          />
        </div>
      </Wrap>
    </section>
  );
}

export function LandingContact() {
  const [messageSent, setMessageSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [notes, setNotes] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !meetingDate || !meetingTime || !notes) {
      return;
    }

    setMessageSent(true);
  };

  return (
    <section className="py-20" id="contact">
      <Wrap>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHead
              center={false}
              eyebrow="Contact"
              title="Talk to the team"
              desc="Tell us what you want to ship and we will send recommendations by email."
            />
            <ul className="flex flex-col gap-3 text-sm text-[rgb(var(--app-text))]">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Dedicated onboarding for teams with migration plans.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Security and architecture review support.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Direct follow-up and practical next steps.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] p-6">
            {messageSent ? (
              <Alert variant="success" title="Request received" onClose={() => setMessageSent(false)}>
                <p>Your message is recorded. Replace this block with your real contact workflow when wiring backend APIs.</p>
              </Alert>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" htmlFor="landing-name">
                    <Input
                      id="landing-name"
                      value={name}
                      onChange={(event) => setName(event.currentTarget.value)}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Work email" htmlFor="landing-email">
                    <Input
                      id="landing-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.currentTarget.value)}
                      placeholder="you@company.com"
                    />
                  </Field>
                  <Field label="Meeting date" htmlFor="landing-date">
                    <DatePicker
                      id="landing-date"
                      value={meetingDate}
                      onChange={(event) => setMeetingDate(event.currentTarget.value)}
                      placeholder="Pick a date"
                      required
                    />
                  </Field>
                  <Field label="Meeting time" htmlFor="landing-time">
                    <TimePicker
                      id="landing-time"
                      value={meetingTime}
                      onChange={(event) => setMeetingTime(event.currentTarget.value)}
                      placeholder="Pick a time"
                      required
                    />
                  </Field>
                </div>
                <Field label="Project notes" htmlFor="landing-notes">
                  <Textarea
                    id="landing-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.currentTarget.value)}
                    placeholder="What would you like to build?"
                  />
                </Field>
                <Button type="submit" size="md">
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

export function LandingFooter() {
  const footerColumns = [
    { h: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
    { h: "Company", links: ["About", "Careers", "Blog", "Contact"] },
    { h: "Resources", links: ["Docs", "API", "Status", "Community"] },
    { h: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
  ];

  return (
    <footer className="border-t border-[rgb(var(--app-border))] py-14">
      <Wrap className="flex flex-col gap-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="flex flex-col gap-3 lg:col-span-2">
            <p className="text-lg font-semibold">Boilerplate</p>
            <p className="max-w-xs text-sm text-[rgb(var(--app-muted))]">
              A generic, modern application seed for modern product teams.
            </p>
            <p className="text-xs text-[rgb(var(--app-muted))]">SOC 2-friendly architecture posture.</p>
          </div>
          {footerColumns.map((group) => (
            <div key={group.h} className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-[rgb(var(--app-text))]">{group.h}</p>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[rgb(var(--app-muted))] hover:text-[rgb(var(--app-text))]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[rgb(var(--app-border))] pt-6 sm:flex-row">
          <p className="text-sm text-[rgb(var(--app-muted))]">© {new Date().getFullYear()} Boilerplate. All rights reserved.</p>
          <p className="text-sm text-[rgb(var(--app-muted))]">Built for extension in teams.</p>
        </div>
      </Wrap>
    </footer>
  );
}

function LogoCloud() {
  const logos = ["Northline", "Aven", "Orbit", "Pulse", "Quanta", "Forge"];

  return (
    <section className="py-12">
      <Wrap className="flex flex-col items-center gap-6">
        <p className="text-sm text-[rgb(var(--app-muted))]">Trusted by teams across the world</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((logo) => (
            <span
              key={logo}
              className="rounded-app border border-[rgb(var(--app-border))] px-4 py-2 text-sm font-medium text-[rgb(var(--app-muted))]"
            >
              {logo}
            </span>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      quote: "This template replaced our internal prototypes, spreadsheet ops, and random snippets with one consistent source of truth.",
      name: "Jane Cooper",
      role: "VP Growth",
    },
    {
      quote: "We launched our first feature page in half the expected time and kept shipping after that.",
      name: "Wade Warren",
      role: "PM",
    },
    {
      quote: "The architecture and setup are just right for both engineers and non-engineering stakeholders.",
      name: "Esther Howard",
      role: "Founder",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <Wrap className="flex flex-col gap-14">
        <SectionHead eyebrow="Loved by teams" title="What teams are saying" />
        <div className="grid gap-4 lg:grid-cols-3">
          {quotes.map((item) => (
            <article
              key={item.name}
              className="flex flex-col gap-4 rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] p-6"
            >
              <p className="text-sm text-yellow-500">★★★★★</p>
              <blockquote className="text-sm text-[rgb(var(--app-muted))]">“{item.quote}”</blockquote>
              <p className="text-sm font-medium text-[rgb(var(--app-text))]">{item.name}</p>
              <p className="text-xs text-[rgb(var(--app-muted))]">{item.role}</p>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

function BentoGrid() {
  const retentionTiles = Array.from({ length: 24 });

  return (
    <section className="py-20 lg:py-28">
      <Wrap className="flex flex-col gap-14">
        <SectionHead
          eyebrow="Built for depth"
          title="A closer look"
          desc="Powerful where you need it, simple where you don’t."
        />
        <div className="grid auto-rows-[13rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BentoCard className="sm:col-span-2 lg:row-span-2 lg:row-start-1" title="Live dashboard" desc="See core metrics and trends in one place.">
            <div className="mt-4 flex-1 rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))] p-3">
              <SimpleBarChart data={[40, 55, 35, 62, 48, 70, 58, 76, 52, 66]} />
            </div>
          </BentoCard>
          <BentoCard title="Retention cohorts" desc="Pinpoint where users churn and where they stick.">
            <div className="mt-4 grid flex-1 grid-cols-6 grid-rows-4 gap-1">
              {retentionTiles.map((_, index) => (
                <span
                  key={index}
                  className="min-h-0 rounded-sm"
                  style={{
                    background: `color-mix(in srgb, rgb(var(--app-accent)) ${15 + (index % 8) * 11}%, rgb(var(--app-bg)) 20%)`,
                  }}
                />
              ))}
            </div>
          </BentoCard>
          <BentoCard title="Team-ready" desc="Roles and shared workflows with audit-friendly setup.">
            <div className="mt-4 flex flex-1 items-center justify-center rounded-[0.75rem] border border-[rgb(var(--app-border))] p-4 text-sm text-[rgb(var(--app-muted))]">
              Coming soon: role matrix preview.
            </div>
          </BentoCard>
        </div>
      </Wrap>
    </section>
  );
}

function BentoCard({
  title,
  desc,
  children,
  className = "",
}: {
  title: string;
  desc: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`flex min-h-0 flex-col overflow-hidden rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))] p-5 ${className}`}
    >
      <h3 className="shrink-0 text-base font-semibold text-[rgb(var(--app-text))]">{title}</h3>
      <p className="mt-1 shrink-0 text-sm text-[rgb(var(--app-muted))]">{desc}</p>
      {children}
    </article>
  );
}

function BlogSection() {
  const posts = [
    {
      tag: "Playbook",
      title: "Pricing pages that convert: lessons in practical defaults",
      excerpt: "Common pricing mistakes and practical patterns for teams shipping early growth features.",
      date: "Jul 2, 2026",
      read: "8 min",
      author: "Product Team",
    },
    {
      tag: "Engineering",
      title: "How we made analytics fast at small team scale",
      excerpt: "A simple architecture that keeps dashboards responsive without overcomplicating your stack.",
      date: "Jun 18, 2026",
      read: "12 min",
      author: "Engineering",
    },
    {
      tag: "Product",
      title: "Experimenting on pricing without noise",
      excerpt: "How to run offers and keep your reporting coherent for stakeholders.",
      date: "Jun 5, 2026",
      read: "6 min",
      author: "Growth",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <Wrap className="flex flex-col gap-12">
        <SectionHead
          eyebrow="From the blog"
          title="Learn how teams grow confidently"
          desc="Practical notes, teardowns, and implementation essays for product teams."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="flex flex-col overflow-hidden rounded-[0.75rem] border border-[rgb(var(--app-border))] bg-[rgb(var(--app-panel))]"
            >
              <div aria-hidden className="h-36 w-full bg-gradient-to-br from-[rgb(var(--app-accent))/25] to-[rgb(var(--app-bg))]" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--app-muted))]">
                  <Badge variant="info">{post.tag}</Badge>
                  <span>{post.date}</span>
                  <span aria-hidden>·</span>
                  <span>{post.read}</span>
                </div>
                <h3 className="text-base font-semibold text-[rgb(var(--app-text))]">{post.title}</h3>
                <p className="flex-1 text-sm text-[rgb(var(--app-muted))]">{post.excerpt}</p>
                <p className="text-sm text-[rgb(var(--app-text))]">{post.author}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-center">
          <Button variant="secondary">View all posts</Button>
        </div>
      </Wrap>
    </section>
  );
}

export function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--app-bg))] text-[rgb(var(--app-text))]">
      <LandingBanner />
      <LandingHeader />
      <main>
        <LandingHero />
        <LogoCloud />
        <LandingFeatures />
        <BentoGrid />
        <LandingProof />
        <Testimonials />
        <LandingPricing />
        <LandingFAQ />
        <NewsletterSection />
        <BlogSection />
        <LandingSignup />
        <LandingContact />
        <LandingFooter />
      </main>
    </div>
  );
}

function CTASection() {
  return null;
}

export { CTASection as CTA };

function NewsletterSection() {
  const [value, setValue] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue("");
  };

  return (
    <section className="border-y border-[rgb(var(--app-border))] py-16">
      <Wrap className="flex flex-col items-center gap-5 text-center">
        <SectionHead title="Get the monthly playbook" desc="Retention ideas and architecture notes — one practical email a month." />
        <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row" onSubmit={submit}>
          <Input
            type="email"
            required
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            placeholder="you@company.com"
            className="h-11 flex-1"
          />
          <Button type="submit" size="lg">
            Subscribe
          </Button>
        </form>
      </Wrap>
    </section>
  );
}

export { NewsletterSection as Newsletter };
