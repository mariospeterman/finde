import {
  ArrowRight,
  Briefcase,
  Building2,
  Clock,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { publicEnv } from "@/lib/env";

export type NavLink = {
  label: string;
  ariaLabel: string;
  href: string;
};

export type NavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: NavLink[];
};

export const navItems: NavItem[] = [
  {
    label: "Product",
    bgColor: "#10131c",
    textColor: "#ffffff",
    links: [
      { label: "Benefits", ariaLabel: "Jump to benefits", href: "#benefits" },
      { label: "Pilot journey", ariaLabel: "Jump to pilot journey", href: "#workflow" },
    ],
  },
  {
    label: "Plans",
    bgColor: "#182131",
    textColor: "#ffffff",
    links: [
      { label: "Pricing", ariaLabel: "Jump to pricing", href: "#pricing" },
      { label: "ROI", ariaLabel: "Jump to ROI calculator", href: "#roi" },
    ],
  },
  {
    label: "Company",
    bgColor: "#212d41",
    textColor: "#ffffff",
    links: [
      { label: "Testimonials", ariaLabel: "Jump to testimonials", href: "#testimonials" },
      { label: "FAQ", ariaLabel: "Jump to frequently asked questions", href: "#faq" },
      { label: "Contact", ariaLabel: "Jump to contact details", href: "#contact" },
    ],
  },
];

export const focusTransitions = [
  { from: "chaos", to: "focus" },
  { from: "confusion", to: "discovery" },
  { from: "search", to: "clarity" },
];

export const heroStats = [
  { label: "Time saved monthly / team-member", value: "24 hrs" },
  { label: "Precision@5 across pilots", value: "0.68" },
  { label: "Breakeven", value: "≤ 14 days" },
];

type BenefitCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const benefitCards: BenefitCard[] = [
  {
    icon: Search,
    title: "Find within seconds",
    description: "Ask in plain language and Finde navigates drives, wikis, and chats with elastic recall. Citations keep everyone aligned.",
  },
  {
    icon: ShieldCheck,
    title: "Trust every answer",
    description: "Permissions mirror your identity provider. Audit trails, confidence scores, and source previews remove guesswork.",
  },
  {
    icon: Workflow,
    title: "Flow across teams",
    description: "Share results to Slack, Teams, or email instantly. Suggested next steps keep consultants, HR, and ops moving fast.",
  },
];

type PersonaPain = {
  icon: LucideIcon;
  persona: string;
  frustration: string;
  hiddenCost: string;
};

export const painPoints: PersonaPain[] = [
  {
    icon: Briefcase,
    persona: "Consultant / Lawyer",
    frustration: "Can’t surface clauses or precedent decks in time",
    hiddenCost: "Lost billables, delayed advice",
  },
  {
    icon: Users,
    persona: "HR Manager",
    frustration: "200 PDFs for policy answers, no single source",
    hiddenCost: "Compliance risk, miscommunication",
  },
  {
    icon: Workflow,
    persona: "Engineer / R&D Lead",
    frustration: "Specs buried in folders, teams rebuild work",
    hiddenCost: "Missed deadlines, rework",
  },
  {
    icon: Building2,
    persona: "Founder / Ops Lead",
    frustration: "Knowledge trapped in subject matter experts",
    hiddenCost: "Lost continuity, stress, burnout",
  },
];

type WorkflowStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const workflowSteps: WorkflowStep[] = [
  {
    icon: FileText,
    title: "1. Map the search pain",
    description: "We catalogue breakpoints in your workflows — contracts, onboarding, project delivery, customer success.",
  },
  {
    icon: Clock,
    title: "2. Launch a guided experience",
    description: "Within 24 hours we index a secure dataset, tune relevance with your team, and benchmark Precision@10.",
  },
  {
    icon: ShieldCheck,
    title: "3. Operationalise clarity",
    description: "Roll out playbooks, governance, and dashboards. Self-hosted, hybrid GPU or fully managed options available.",
  },
];

const formatEuro = (value: number, options?: Pick<Intl.NumberFormatOptions, "maximumFractionDigits">) => {
  const maximumFractionDigits = options?.maximumFractionDigits ?? (Number.isInteger(value) ? 0 : 2);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

const managedSeatMonthly = publicEnv.pricing.managed.seatMonthly;
const managedSeatFormatted = managedSeatMonthly > 0 ? formatEuro(managedSeatMonthly) : "Custom";
const selfHostedSeatAnnual = publicEnv.pricing.selfHosted.seatAnnual;
const selfHostedSeatMonthly = selfHostedSeatAnnual > 0 ? selfHostedSeatAnnual / 12 : managedSeatMonthly;
const selfHostedSeatFormatted = selfHostedSeatMonthly ? formatEuro(Math.max(selfHostedSeatMonthly, managedSeatMonthly)) : "Custom";
const selfHostedSetupFee = publicEnv.pricing.selfHosted.setupFee;
const selfHostedSetupFormatted = selfHostedSetupFee > 0 ? formatEuro(selfHostedSetupFee) : "Custom pricing";
const hybridSeatMonthly = publicEnv.pricing.hybrid.seatMonthly;
const hybridSeatFormatted = hybridSeatMonthly > 0 ? formatEuro(hybridSeatMonthly) : "Custom";
const hybridGpuHourly = publicEnv.pricing.hybrid.gpuHourly;
const hybridGpuFormatted =
  hybridGpuHourly > 0 ? formatEuro(hybridGpuHourly, { maximumFractionDigits: hybridGpuHourly < 1 ? 2 : 0 }) : "Usage based";
const hybridSetupEstimate =
  selfHostedSetupFee > 0 ? Math.max(selfHostedSetupFee * 2, 5000) : hybridSeatMonthly > 0 ? hybridSeatMonthly * 6 : 5000;
const hybridSetupFormatted = formatEuro(Math.round(hybridSetupEstimate / 50) * 50);

export type PricingPlan = {
  name: string;
  badge?: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
  ctaHref?: string;
  intent: string;
  highlight?: boolean;
  comingSoon?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Pilot Program",
    badge: "Active now",
    description: "Free guided onboarding (3–6 weeks) with KPI tracking and conversion credit.",
    price: publicEnv.pricing.pilotLabel,
    features: [
      "Secure ingest + relevance workshop",
      "Precision@5 & CSAT dashboard",
      "Dedicated pilot success lead",
      "Licence credit if you convert within 60 days",
    ],
    cta: "Apply for the pilot",
    intent: "pilot-program",
    highlight: true,
  },
  {
    name: "Self-Hosted Licence",
    badge: "Coming soon",
    description: "Deploy on your infrastructure with dedicated enablement and maintenance.",
    price: `From ${selfHostedSeatFormatted} / seat annually`,
    features: [
      `Setup from ${selfHostedSetupFormatted} with guided rollout`,
      "Annual maintenance & relevance reviews",
      "Email support and compliance packs",
      "Ideal for legal, compliance, and finance",
    ],
    cta: "Join waitlist",
    ctaHref: "#apply",
    intent: "self-hosted-licence",
    comingSoon: true,
  },
  {
    name: "Hybrid GPU (Hetzner)",
    badge: "Coming soon",
    description: "On-prem governance with elastic GPU capacity managed by Finde.",
    price: `Licence from ${hybridSeatFormatted} / seat + ${hybridGpuFormatted}/hr GPU`,
    features: [
      `Setup from ${hybridSetupFormatted} with precision tuning`,
      "Transparent GPU dashboards & alerts",
      "Priority SLA and dedicated success",
      "Best for consulting & analytics teams",
    ],
    cta: "Join waitlist",
    ctaHref: "#apply",
    intent: "hybrid-gpu",
    comingSoon: true,
  },
  {
    name: "Managed Cloud",
    badge: "Scale ready",
    description: "Fully hosted SaaS with per-seat pricing and token cost control.",
    price: `From ${managedSeatFormatted} / seat / month`,
    features: [
      "Pilot credit applied to first licence",
      "100k–500k tokens included per seat",
      "Private VPC & 24/7 support options",
      "Usage visibility for FinOps teams",
    ],
    cta: "Book a demo",
    ctaHref: "#apply",
    intent: "managed-cloud",
    comingSoon: false,
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  linkedin: {
    url: string;
    name: string;
    avatar: string;
  };
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "“We were drowning in precedent decks. Finde surfaces the exact clause, context, and owner in seconds. Our clients feel the difference.”",
    name: "Hanna Meier",
    role: "Partner, Chronos Consulting",
    linkedin: {
      url: "https://www.linkedin.com/in/hanna-meier/",
      name: "Hanna Meier",
      avatar: "/image/testimonials/hanna.svg",
    },
  },
  {
    quote:
      "“HR now answers policy questions before they escalate. Compliance loves the audit log and confidence scores.”",
    name: "Sofia Klein",
    role: "Head of People, Northwind Collective",
    linkedin: {
      url: "https://www.linkedin.com/in/sofia-klein/",
      name: "Sofia Klein",
      avatar: "/image/testimonials/sofia.svg",
    },
  },
  {
    quote:
      "“Piloting took 12 days. We scaled to 4 departments without extra headcount. Clarity is now measurable.”",
    name: "Daniel Cho",
    role: "COO, Assembly Labs",
    linkedin: {
      url: "https://www.linkedin.com/in/daniel-cho/",
      name: "Daniel Cho",
      avatar: "/image/testimonials/daniel.svg",
    },
  },
];

export type FaqEntry = {
  question: string;
  answer: string;
};

export const faqs: FaqEntry[] = [
  {
    question: "How quickly can we launch the pilot?",
    answer:
      "Most pilots go live within 10–14 days. We support secure data ingest, relevance workshops, and baseline metrics before expansion.",
  },
  {
    question: "Can we self-host entirely on-prem?",
    answer:
      "Yes. Finde mirrors your identity provider, supports air-gapped updates, and offers on-site enablement for regulated industries.",
  },
  {
    question: "How do permissions and compliance work?",
    answer:
      "We honour existing ACLs, log every search, and ship compliance packs (GDPR/DPA, SOC2) plus optional private VPC deployment.",
  },
  {
    question: "What happens after the pilot?",
    answer:
      "You receive rollout playbooks, governance templates, ROI tracking dashboards, and continued relevance tuning support.",
  },
];

export const heroPills = [
  {
    icon: Sparkles,
    label: "We all search. The difference is how quickly you find.",
  },
  {
    icon: ArrowRight,
    label: "Search · Decide · Deliver",
  },
];

export type RoiMetricPreset = {
  id: string;
  label: string;
  hourlyRate: number;
  hoursSaved: number;
};

export const roiPresets: RoiMetricPreset[] = [
  { id: "legal", label: "Legal & Compliance", hourlyRate: 140, hoursSaved: 6 },
  { id: "hr", label: "HR & People Ops", hourlyRate: 75, hoursSaved: 5 },
  { id: "consulting", label: "Consulting & Advisory", hourlyRate: 180, hoursSaved: 7 },
  { id: "product", label: "Product & Engineering", hourlyRate: 95, hoursSaved: 6 },
];

export const roiPlanThresholds = [
  { id: "starter", name: "Starter", maxTeamSize: 5, monthlySeatPrice: publicEnv.roiPricing.starter },
  { id: "growth", name: "Growth", maxTeamSize: 15, monthlySeatPrice: publicEnv.roiPricing.growth },
  { id: "enterprise", name: "Enterprise", maxTeamSize: null, monthlySeatPrice: publicEnv.roiPricing.enterprise },
];

export const chatMessages = [
  {
    sender: "user" as const,
    time: "09:14",
    text: "Need the latest GDPR onboarding checklist for our Munich office.",
  },
  {
    sender: "assistant" as const,
    time: "09:14",
    text: "Found “GDPR_Onboarding_Playbook_v5.pdf”. Updated 4 days ago by Lina Morales.",
    meta: "SharePoint · HR/Policies/EMEA",
  },
  {
    sender: "assistant" as const,
    time: "09:14",
    text: "Immediate next steps: 1) Send consent pack 2) Schedule compliance intro 3) Log signatures in Notion.",
    meta: "Precision@5: 0.71 · Confidence: High",
  },
  {
    sender: "user" as const,
    time: "09:15",
    text: "Great. Push that summary to #people-ops and ping Felix.",
  },
  {
    sender: "assistant" as const,
    time: "09:15",
    text: "Shared to Slack/#people-ops, attached source doc and notified Felix Greer. Added entry to audit log. ✅",
  },
];

export const chatMetrics = [
  { label: "Response Quality", value: "0.71", context: "Precision@5" },
  { label: "User Satisfaction", value: "74%", context: "CSAT Score" },
  { label: "Efficiency Gain", value: "38%", context: "Time Saved" },
];

export const legalCopy = {
  privacy: {
    title: "Privacy Policy",
    body: `We respect your data. Finde processes only the information required to deliver search results during the pilot. Data remains within your connected sources and we honour existing permissions. Reach out to hello@finde.info for any privacy enquiries.`,
  },
  terms: {
    title: "Terms of Use",
    body: `The pilot edition is provided free of charge for evaluation purposes. Participants agree to maintain confidentiality around shared datasets and feedback. Any production deployment will require a signed licence agreement.`,
  },
  imprint: {
    title: "Imprint",
    body: `Finde GmbH
Leipziger Platz 12, 10117 Berlin
Managing Directors: Lea Hartmann, Jonas Weber
Email: hello@finde.info`,
  },
};
