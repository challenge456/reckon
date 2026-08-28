import Link from "next/link";
import { ArrowRight, Target, Zap, Trophy, TrendingUp, MessageSquare, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
              ⚡
            </div>
            <span className="text-xl font-bold">Reckon</span>
          </div>
          <Link
            href="/signin"
            className="btn btn-secondary"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Commit to it.
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Or reckon with it.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
              Set your goals. Own your deadlines. When you miss them, RECKON makes sure the commitment doesn't disappear — you face a profession-relevant consequence instead.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signin" className="btn btn-primary btn-lg">
              Start Reckoning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              See How It Works
            </a>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-3xl" />
            <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm font-medium text-muted">Goal</p>
                  <p className="text-lg font-semibold mt-2">Complete DSA</p>
                  <p className="text-xs text-muted mt-2">Due: Tomorrow 8 PM</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 animate-pulse">
                  <p className="text-sm font-medium text-primary">Status</p>
                  <p className="text-lg font-semibold mt-2 text-primary">3h 42m left</p>
                  <p className="text-xs text-primary/70 mt-2">Ticking...</p>
                </div>
                <div className="p-4 rounded-lg bg-error/10 border border-error/20">
                  <p className="text-sm font-medium text-error">If Missed</p>
                  <p className="text-lg font-semibold mt-2">Consequence</p>
                  <p className="text-xs text-error/70 mt-2">You'll face it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: The Core Loop */}
      <section id="how-it-works" className="py-24 px-6 border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How RECKON Works</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              The accountability loop that actually sticks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Create a Goal",
                description: "Set what you want to accomplish and when.",
              },
              {
                icon: CheckCircle2,
                title: "Complete It",
                description: "Finish before the deadline and build your streak.",
              },
              {
                icon: Zap,
                title: "Miss It?",
                description: "The deadline passes. Your goal becomes MISSED.",
              },
              {
                icon: Trophy,
                title: "Face It",
                description: "Choose a profession-relevant consequence and deal with it.",
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative">
                  <div className="card text-center space-y-4 h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-muted">{step.description}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-primary/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Profession-Based Consequences */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Profession-Based Challenges</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Consequences built around who you are. Not generic punishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                profession: "Developer",
                consequences: ["LeetCode problem", "Debugging challenge", "Git workflow drill"],
              },
              {
                profession: "Cybersecurity",
                consequences: ["Security lab", "Networking exercise", "Linux challenge"],
              },
              {
                profession: "Student",
                consequences: ["Subject quiz", "Practice problems", "Revision challenge"],
              },
              {
                profession: "Designer",
                consequences: ["UI redesign", "UX critique", "Design exercise"],
              },
            ].map((item, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold text-lg mb-4">{item.profession}</h3>
                <ul className="space-y-2">
                  {item.consequences.map((c, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Lifelines */}
      <section className="py-24 px-6 bg-card/50 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">7 Lifelines</h2>
          <p className="text-lg text-muted mb-8">
            Start with 7 lifelines. Use them strategically to shield from consequences when life genuinely gets in the way.
          </p>
          <div className="flex gap-2 justify-center mb-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent opacity-80"
              />
            ))}
          </div>
          <p className="text-muted max-w-2xl mx-auto">
            Each lifeline can shield you from one consequence. Once used, it counts toward your accountability metrics. This isn't about escaping — it's about making choices that matter.
          </p>
        </div>
      </section>

      {/* Section: Accountability Dashboard */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Track Your Progress</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Your commitment score. Your streaks. Your achievements. Transparent, measurable accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                metric: "Reliability Score",
                description: "Your completion rate. Built on real outcomes.",
              },
              {
                icon: Zap,
                metric: "Current Streak",
                description: "Consecutive goals completed. Build momentum.",
              },
              {
                icon: Trophy,
                metric: "Achievements",
                description: "Unlock badges. Celebrate milestones. Share progress.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="card text-center">
                  <Icon className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{item.metric}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: AI Assistant */}
      <section className="py-24 px-6 bg-card/50 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-8">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">AI Companion</h2>
          </div>
          <p className="text-lg text-muted text-center mb-8 max-w-2xl mx-auto">
            Ask your AI assistant about your goals, deadlines, lifelines, and progress. Get insights. Stay motivated.
          </p>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0" />
              <p className="text-sm text-muted">What's my next deadline?</p>
            </div>
            <div className="flex gap-3 justify-end">
              <p className="text-sm text-primary bg-primary/10 rounded-lg p-3 max-w-xs">
                You have "Complete DSA" due tomorrow at 8 PM — 3 hours 42 minutes left.
              </p>
              <div className="w-8 h-8 rounded-full bg-accent/10 flex-shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your goals are yours.
              <br />
              Your deadlines are yours.
              <br />
              <span className="text-primary">So are the consequences.</span>
            </h2>
            <p className="text-lg text-muted mt-6">
              Stop letting missed commitments disappear into nothing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signin" className="btn btn-primary btn-lg">
              Start Reckoning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <p className="text-sm text-muted">
            It's free. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
              ⚡
            </div>
            <span className="font-semibold">Reckon</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted">
            <a href="/about" className="hover:text-foreground transition">About</a>
            <a href="/contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Reckon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}