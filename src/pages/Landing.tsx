import { Link } from 'react-router-dom';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, BookOpen, StickyNote, BookMarked, CalendarCheck, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Decision Tracker',
    desc: 'Log decisions with reasoning and emotions, then review outcomes to detect cognitive biases.',
    href: '/features/decisions',
  },
  {
    icon: BookOpen,
    title: 'Diary',
    desc: 'Write daily reflections with mood tracking to build self-awareness over time.',
    href: '/features/diary',
  },
  {
    icon: StickyNote,
    title: 'Notes',
    desc: 'Capture quick thoughts and ideas with optional tags for easy organisation.',
    href: '/features/notes',
  },
  {
    icon: BookMarked,
    title: 'Book Shelf',
    desc: 'Track books you\'re reading, rate them, and maintain a personal reading list.',
    href: '/features/books',
  },
  {
    icon: CalendarCheck,
    title: 'Planner',
    desc: 'Manage tasks with priorities and due dates to stay productive and focused.',
    href: '/features/planner',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
          <div className="container max-w-4xl mx-auto px-4 py-24 md:py-32 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" /> Your personal thinking toolkit
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Track Decisions.<br />Reflect & <span className="text-primary">Grow.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Decision Journal combines decision tracking, diary writing, note-taking, book management, and task planning into one beautiful, distraction-free app.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="accent" size="lg" asChild>
                <Link to="/auth">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="container max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">Everything You Need</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Five powerful tools designed to help you think better, reflect deeper, and stay organised.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.href} to={f.href} className="group">
                <Card className="bg-card border-border h-full transition-all hover:border-primary/40 hover:shadow-[var(--shadow-glow)]">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Why section */}
        <section className="bg-card border-y border-border">
          <div className="container max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-3">Why Decision Journal?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Private & Secure</h3>
                <p className="text-sm text-muted-foreground">Your data is protected with authentication and stored securely on the cloud.</p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fast & Minimal</h3>
                <p className="text-sm text-muted-foreground">No bloat, no distractions. Just clean tools that help you think.</p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Bias Detection</h3>
                <p className="text-sm text-muted-foreground">Review past decisions to identify cognitive biases and improve your thinking.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Start Journaling Today</h2>
          <p className="text-muted-foreground mb-8">Free to use. No credit card required.</p>
          <Button variant="accent" size="lg" asChild>
            <Link to="/auth">Create Your Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Landing;
