import { Linkedin } from "lucide-react";
import { benefitCards, faqs, legalCopy, painPoints, testimonials, workflowSteps } from "@/data/content";
import { publicEnv } from "@/lib/env";
import { HeroSection } from "@/components/sections/hero-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { RoiSection } from "@/components/sections/roi-section";
import { TypeformModal } from "@/components/typeform-widget";
import { LegalModals } from "@/components/legal-modals";
import { ApplyButton } from "@/components/apply-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <main
        id="main-content"
        className="mx-auto flex max-w-7xl flex-col gap-24 px-6 pb-24 pt-8 md:gap-28 md:pt-12"
        aria-label={`${publicEnv.brandName} marketing site`}
      >
        <HeroSection />

        <section id="benefits" className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="font-display text-3xl text-slate-900 md:text-4xl">
              From chaos to clarity — your company’s brain, searchable.
            </h2>
            <p className="text-base text-slate-600">
              Relief, trust, and flow are the new productivity stack. {publicEnv.brandName} brings calm confidence to every search moment.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {benefitCards.map((benefit) => (
              <div key={benefit.title} className="paper-sheet flex h-full flex-col gap-4 p-6">
                <benefit.icon className="h-10 w-10 text-slate-900" aria-hidden="true" focusable="false" />
                <h3 className="text-xl font-semibold text-slate-900">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pain" className="paper-sheet space-y-6 p-8 md:p-12">
          <div className="space-y-3">
            <h2 className="font-display text-3xl text-slate-900 md:text-4xl">The pain behind the search bar</h2>
            <p className="text-base text-slate-600">
              “I waste hours searching for what I already own.” {publicEnv.brandName} replaces that frustration with clarity you can feel.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {painPoints.map((pain) => (
              <div key={pain.persona} className="rounded-2xl border border-white/60 bg-white/70 p-6">
                <pain.icon className="h-6 w-6 text-slate-900" aria-hidden="true" focusable="false" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{pain.persona}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Frustration:</span> {pain.frustration}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Hidden cost:</span> {pain.hiddenCost}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="paper-sheet space-y-8 p-8 md:p-12" aria-labelledby="workflow-heading">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 id="workflow-heading" className="font-display text-3xl text-slate-900 md:text-4xl">
              Improve with confidence in 3 steps.
            </h2>
            <p className="text-base text-slate-600">
              Relief arrives quickly: map pains, launch {publicEnv.brandName}, and scale clarity across every search.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <div key={step.title} className="paper-sheet flex h-full flex-col gap-4 p-6">
                <step.icon className="h-8 w-8 text-slate-900" aria-hidden="true" focusable="false" />
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <RoiSection />
        <PricingSection />

        <section id="testimonials" className="space-y-8">
          <h2 className="font-display text-3xl text-slate-900 md:text-4xl">Clarity felt worldwide</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="paper-sheet flex h-full flex-col gap-4 p-6">
                <p className="text-base text-slate-700">{testimonial.quote}</p>
                <div className="mt-auto flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.linkedin.avatar}
                    alt={`LinkedIn avatar for ${testimonial.name}`}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{testimonial.role}</p>
                    <a
                      href={publicEnv.linkedin.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 hover:text-sky-900"
                      aria-label={publicEnv.linkedin.label}
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      {publicEnv.linkedin.label}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="space-y-8">
          <h2 className="font-display text-3xl text-slate-900 md:text-4xl">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="paper-sheet group space-y-3 p-6">
                <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-slate-900">
                  {faq.question}
                  <span className="text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="cta" className="paper-sheet space-y-6 rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-8 py-16 text-center text-white shadow-2xl md:px-16">
          <h2 className="text-3xl font-semibold md:text-4xl text-white">Find. Decide. Deliver.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-100">
            Relief starts with one pilot. Apply for the {publicEnv.brandName} pilot — free setup, limited seats — and feel what clarity does for your team.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${publicEnv.contactEmail ?? "hello@finde.info"}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              hello@finde.info
            </a>
            <ApplyButton
              source="cta-primary"
              className="bg-sky-500 text-white hover:bg-sky-600 focus-visible:outline-white focus-visible:outline-offset-2 text-lg"
            >
              Apply for the pilot
            </ApplyButton>
          </div>
        </section>

        <TypeformModal url={publicEnv.typeformUrl} />
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-white/80 py-12 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt={`${publicEnv.brandName} logo`} className="h-12 w-auto" />
            <p className="text-sm text-slate-600">{publicEnv.brandName} — Retrieval built for confident teams.</p>
            <div className="text-xs uppercase tracking-[0.35em] text-slate-400">
              © {new Date().getFullYear()} {publicEnv.brandName}. All rights reserved.
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <a href="#benefits" className="hover:text-slate-900">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-slate-900">
                  Pilot journey
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-slate-900">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <a href="#roi" className="hover:text-slate-900">
                  ROI calculator
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-slate-900">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-900">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <LegalModals content={legalCopy} />
        </div>
      </footer>
    </div>
  );
}
