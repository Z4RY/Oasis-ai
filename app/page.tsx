"use client"

import Link from "next/link"
import { Keyboard, Target, Zap, Award, TrendingUp, PenTool } from "lucide-react"


export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 transition-colors ${"bg-card/80 backdrop-blur border-b" 
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* brand mark kept minimal */}
            <span className="text-lg md:text-xl font-medium">Oasis</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="hover:opacity-80">
              Features
            </Link>
            <Link href="#slides" className="hover:opacity-80">
              What’s Next
            </Link>
            <Link href="/typing" className="hover:opacity-80">
              Typing Test
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/signin" className="rounded-full px-4 py-2 text-sm hover:bg-secondary transition-colors">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full px-4 py-2 text-sm bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero with friendly visuals and animated arrow */}
      <section className="relative overflow-hidden">
        {/* subtle decorative background using provided soft motif */}
        <img
          src="/images/soft-motif.jpg"
          alt="Soft decorative background"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative mx-auto max-w-6xl px-6 md:px-8 py-24 md:py-36 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-balance text-4xl md:text-6xl font-light leading-tight">
              Write smarter. Type faster. Shine brighter.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mt-7">
              Oasis is your personal essay writing coach. Practice, get instant AI-powered feedback, and track your progress—all in one distraction-free workspace.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/auth/signup"
                className="rounded-full text-primary-background border px-6 py-3 hover:opacity-90 transition bg-secondary-background"
              >
                Start free
              </Link>
              <Link href="#features" className="rounded-full border px-6 py-3 hover:bg-secondary transition">
                See how it works

              </Link>
            </div>
          </div>

          {/* right column visuals using provided assets */}
          <div className="relative pb-25 md:pb-0">
             <video
              src="/video/hand-typing.mp4"
              className="rounded-lg border shadow-sm w-full mx-3.5 my-0"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Hand-drawn typing concept"
            />
{/* 
            <img
              src="/images/logo-star.gif"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 -right-4 md:-right-6 w-14 h-14 md:w-20 md:h-20"
            /> */}

            {/* <Link
              href="#features"
              aria-label="Scroll to features"
              className="group absolute -bottom-6 left-4 inline-flex items-center gap-2"
            >
              <span className="text-sm text-muted-foreground">See what’s next</span>
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-primary animate-bounce transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path
                  d="M12 4v12m0 0l-5-5m5 5l5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link> */}

            {/* <p className="mt-8 text-sm md:text-base text-muted-foreground leading-relaxed">
              In the slides below, we introduce the essentials—distraction‑free editor, smart auto‑correct, snippet
              expansions, and actionable analytics—so you know exactly what’s coming next.
            </p> */}
          </div>
        </div>

        {/* animated down arrow cue */}
        <div className="mt-8 flex justify-center" aria-hidden="true">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">Scroll</span>
            <svg viewBox="0 0 24 24" className="w-5 h-5 animate-bounce">
              <path
                d="M12 4v12m0 0l-5-5m5 5l5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Typing test teaser */}
        <div id="typing-test-teaser" className="relative mx-auto max-w-5xl px-6 md:px-8">
          <div className="rounded-2xl border bg-card text-card-foreground p-6 md:p-8 mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-medium">Evaluate your typing skill</h2>
              <p className="text-muted-foreground leading-relaxed mt-2 max-w-2xl">
                Take a quick typing test to measure speed and accuracy. Get tailored suggestions to improve and track
                your progress over time from your dashboard.
              </p>
            </div>
            <Link href="/typing" className="rounded-full border px-5 py-3 hover:bg-secondary transition">
              Try the typing test
            </Link>
          </div>
        </div>
      </section>

      {/* Friendly components to humanize the SaaS */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8 grid gap-10 md:grid-cols-3">
          <div className="rounded-2xl border p-6 md:p-8 bg-card">
            <h3 className="text-xl font-medium font-sans">Personalized Feedback</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              AI-powered insights to enhance your grammar, flow, and clarity.
            </p>
          </div>
          <div className="rounded-2xl border p-6 md:p-8 bg-card">
            <h3 className="text-xl font-medium">Practice Anytime</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Access your work anywhere—always saved and in sync.            </p>
          </div>
          <div className="rounded-2xl border p-6 md:p-8 bg-card">
            <h3 className="text-xl font-medium">Track Your Growth</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
             Track your improvement with clear analytics and milestone highlights.
            </p>
          </div>
        </div>
      </section>

      {/* Primary features overview */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl md:text-5xl font-light">
              Everything you need to write smarter and ship faster.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Clear, friendly tools that help you focus on outcomes—not complexity.
            </p>
          </div>
          <div className="mt-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Target,
                  title: "AI Essay Evaluation",
                  desc: "Detailed analysis with clear, actionable suggestions.",
                },
                { icon: Keyboard, title: "Typing Tests", desc: "Measure speed and accuracy with calm, focused flows." },
                { icon: PenTool, title: "Cloud Essays", desc: "Draft anywhere. Everything syncs automatically." },
                { icon: TrendingUp, title: "Progress Insights", desc: "Trends over time, not just single scores." },
                { icon: Zap, title: "Smart Prompts", desc: "Contextual prompts that meet you where you are." },
                { icon: Award, title: "Achievements", desc: "Celebrate meaningful milestones to keep momentum." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group rounded-2xl border bg-card p-6 transition-shadow hover:shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GSAP-driven scroll slides that hint what's next */}
      <section id="slides" className="bg-card">
        <div className="mx-auto max-w-6xl px-6 md:px-8 py-24 md:py-32 space-y-24">
          {[
            {
              id: "slide-1",
              title: "Draft with confidence",
              copy:
                "Write with assurance using real-time AI feedback that enhances grammar, structure, and clarity. Get personalized suggestions tailored to your writing style, helping you refine every essay with precision and ease.",
              media: "/video/draft.mp4",
              alt: "Editorial layout illustration",
            },
            {
              id: "slide-2",
              title: "Feedback that clicks",
              copy:
                "Get instant, actionable feedback that fits your writing style. Our AI pinpoints areas for improvement and offers clear suggestions you can apply right away—making better writing feel effortless and intuitive.",
              media: "/video/doodle.mp4",
              alt: "Infographic showing compact insights",
            },
            {
              id: "slide-3",
              title: "See your growth.",
              copy:
                "Track your writing journey with insightful analytics that highlight your progress over time. Visualize improvements in clarity, tone, and structure while celebrating key milestones. Every draft becomes a reflection of your growth, helping you stay motivated and confident in your craft.",
              media: "/video/meditate.mp4",
              alt: "Subtle animated brand glyph",
            },
          ].map((s) => (
            <div key={s.id} className="slide-panel">
              <div className="slide-inner grid items-center gap-10 md:grid-cols-2">
                <div>
                  <h3 className="text-3xl md:text-4xl font-light">{s.title}</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{s.copy}</p>
                </div>
                <div className="relative">
                  <video
                    src={s.media || "/placeholder.svg"}
                    className="rounded-lg border shadow-sm w-full mx-3.5 my-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Hand-drawn typing concept"
                  />
                  {/* <img
                    src={s.media || "/placeholder.svg"}
                    alt={s.alt}
                    className="rounded-xl border shadow-sm w-full object-cover"
                  /> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Footer() {
  return (
    <footer id="contact" className="border-top bg-card">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* <img src="/images/logo-star.gif" alt="Brand mark" className="h-5 w-5 rounded" /> */}
          <span className="font-medium">Oasis</span>
        </div>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Oasis, Inc. All rights reserved.</p>
        <div className="flex gap-4 text-sm">
          <a href="#features" className="hover:opacity-80">
            Features
          </a>
          <a href="/auth/signup" className="hover:opacity-80">
            Get started
          </a>
        </div>
      </div>
    </footer>
  )
}
