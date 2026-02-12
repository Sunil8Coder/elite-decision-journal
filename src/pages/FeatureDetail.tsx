import { useParams, Link, Navigate } from 'react-router-dom';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, BookOpen, StickyNote, BookMarked, CalendarCheck, ArrowRight, ArrowLeft, CheckCircle2, LucideIcon } from 'lucide-react';

interface FeatureData {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  howItWorks: { step: string; detail: string }[];
  useCases: string[];
  seoTitle: string;
  seoDesc: string;
}

const featureData: Record<string, FeatureData> = {
  decisions: {
    icon: Brain,
    title: 'Decision Tracker',
    tagline: 'Make better decisions through structured reflection',
    description:
      'The Decision Tracker is the core of Decision Journal. It lets you log important decisions along with your reasoning, emotional state, and expected outcomes. Later, you can review decisions with actual outcomes and identify cognitive biases that may have influenced your thinking.',
    benefits: [
      'Reduce cognitive biases by reviewing past decisions objectively',
      'Track how emotions influence your choices over time',
      'Build a personal database of decision-making patterns',
      'Improve future decisions by learning from past outcomes',
      'Categorise decisions for easy filtering and review',
    ],
    howItWorks: [
      { step: 'Record', detail: 'Log your decision, reasoning, category, emotion, and expected outcome.' },
      { step: 'Live with it', detail: 'Let time pass so you can evaluate the decision objectively.' },
      { step: 'Review', detail: 'Come back to record the actual outcome and note any biases detected.' },
      { step: 'Learn', detail: 'Use bias insights to spot recurring patterns and improve.' },
    ],
    useCases: [
      'Career moves — job offers, promotions, pivots',
      'Financial decisions — investments, big purchases',
      'Relationship choices — setting boundaries, commitments',
      'Business strategy — product launches, partnerships',
    ],
    seoTitle: 'Decision Tracker – Log & Review Decisions',
    seoDesc: 'Track decisions with reasoning, emotions, and expected outcomes. Review later to detect cognitive biases and improve your thinking.',
  },
  diary: {
    icon: BookOpen,
    title: 'Diary',
    tagline: 'Daily reflections with mood tracking',
    description:
      'The Diary feature lets you write daily reflections and tag them with mood emojis. Build a personal archive of your thoughts, feelings, and experiences over time. It\'s your private space for honest self-expression.',
    benefits: [
      'Build self-awareness through daily writing practice',
      'Track mood patterns over days, weeks, and months',
      'Create a searchable archive of personal growth',
      'Process emotions through structured journaling',
      'Look back on past entries to see how far you\'ve come',
    ],
    howItWorks: [
      { step: 'Write', detail: 'Create a new diary entry with a title and your thoughts for the day.' },
      { step: 'Tag mood', detail: 'Pick an emoji that represents how you\'re feeling.' },
      { step: 'Save', detail: 'Your entry is saved with the current date automatically.' },
      { step: 'Reflect', detail: 'Browse past entries to spot patterns and track your journey.' },
    ],
    useCases: [
      'Morning pages — stream of consciousness writing',
      'Evening reflection — summarising the day',
      'Gratitude journaling — noting what went well',
      'Stress processing — writing through difficult emotions',
    ],
    seoTitle: 'Diary – Daily Journal with Mood Tracking',
    seoDesc: 'Write daily reflections with mood emoji tracking. Build a personal archive of thoughts and feelings to grow through self-awareness.',
  },
  notes: {
    icon: StickyNote,
    title: 'Notes',
    tagline: 'Capture ideas in seconds',
    description:
      'Notes is a lightweight, fast note-taking tool for capturing quick thoughts, ideas, and observations. Add optional tags to organise your notes and find them easily later. No formatting complexity — just clean, simple text.',
    benefits: [
      'Capture ideas before they disappear',
      'Tag notes for easy categorisation and retrieval',
      'Keep meeting notes, ideas, and observations in one place',
      'Distraction-free writing experience',
      'Quick creation — title, content, and optional tag',
    ],
    howItWorks: [
      { step: 'Create', detail: 'Tap the add button and write your note with a title.' },
      { step: 'Tag', detail: 'Optionally add a tag like "work", "idea", or "personal".' },
      { step: 'Save', detail: 'Your note is stored instantly with a timestamp.' },
      { step: 'Browse', detail: 'Scroll through notes with tags visible for quick scanning.' },
    ],
    useCases: [
      'Brainstorming — dump ideas without judgement',
      'Meeting notes — capture key points quickly',
      'Reading notes — jot down insights from articles or books',
      'To-research list — things to look up later',
    ],
    seoTitle: 'Notes – Quick Thought Capture with Tags',
    seoDesc: 'Capture quick thoughts and ideas with optional tags. A clean, distraction-free note-taking tool built into Decision Journal.',
  },
  books: {
    icon: BookMarked,
    title: 'Book Shelf',
    tagline: 'Track your reading journey',
    description:
      'Book Shelf helps you manage your reading life. Add books to your wishlist, track what you\'re currently reading, rate completed books with a 5-star system, and keep personal notes about each book. It\'s a simple but powerful reading tracker.',
    benefits: [
      'Never forget a book recommendation again',
      'Track reading progress with status labels',
      'Rate books to remember your favourites',
      'Keep personal notes and takeaways per book',
      'See your reading history at a glance',
    ],
    howItWorks: [
      { step: 'Add', detail: 'Enter the book title, author, and set an initial status (wishlist, reading, completed).' },
      { step: 'Rate', detail: 'Give the book a 1–5 star rating.' },
      { step: 'Note', detail: 'Add personal notes, key takeaways, or favourite quotes.' },
      { step: 'Track', detail: 'Browse your shelf filtered by status to see what\'s next.' },
    ],
    useCases: [
      'Reading challenges — track how many books you finish',
      'Book clubs — notes for discussion',
      'Wishlist — save recommendations from friends or podcasts',
      'Personal development — track self-help and business books',
    ],
    seoTitle: 'Book Shelf – Reading Tracker with Ratings',
    seoDesc: 'Track books you\'re reading, rate completed ones, and maintain a personal reading wishlist. Built into Decision Journal.',
  },
  planner: {
    icon: CalendarCheck,
    title: 'Planner',
    tagline: 'Stay productive with prioritised tasks',
    description:
      'The Planner is a focused task management tool. Create tasks with priority levels (low, medium, high), set due dates, and toggle completion status. The clean split between pending and completed tasks keeps your focus sharp.',
    benefits: [
      'Prioritise what matters with three priority levels',
      'Set due dates to stay accountable',
      'Toggle tasks complete with a single click',
      'Clear visual separation of pending vs done tasks',
      'Descriptions for additional task context',
    ],
    howItWorks: [
      { step: 'Create', detail: 'Add a task with a title, optional description, due date, and priority level.' },
      { step: 'Prioritise', detail: 'Set low, medium, or high priority to focus on what matters.' },
      { step: 'Complete', detail: 'Check off tasks as you finish them — they move to the completed section.' },
      { step: 'Clean up', detail: 'Delete tasks you no longer need to keep your list tidy.' },
    ],
    useCases: [
      'Daily to-do lists — plan your day each morning',
      'Weekly goals — set and track weekly objectives',
      'Project tasks — break projects into actionable steps',
      'Errands — keep a running list of things to do',
    ],
    seoTitle: 'Planner – Task Manager with Priorities',
    seoDesc: 'Manage tasks with priority levels and due dates. Toggle completion and keep a clear view of pending vs completed work.',
  },
};

const FeatureDetail = () => {
  const { featureId } = useParams<{ featureId: string }>();

  if (!featureId || !featureData[featureId]) {
    return <Navigate to="/features" replace />;
  }

  const feature = featureData[featureId];
  const Icon = feature.icon;

  // Get other features for "more features" section
  const otherFeatures = Object.entries(featureData)
    .filter(([key]) => key !== featureId)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
          <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24 relative z-10">
            <Link to="/features" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4" /> All Features
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-primary/10">
                <Icon className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{feature.title}</h1>
                <p className="text-lg text-muted-foreground">{feature.tagline}</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl text-base md:text-lg">
              {feature.description}
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="container max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feature.benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-card border-y border-border">
          <div className="container max-w-4xl mx-auto px-4 py-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {feature.howItWorks.map((s, i) => (
                <div key={s.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3 text-lg">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{s.step}</h3>
                  <p className="text-sm text-muted-foreground">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="container max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Use Cases</h2>
          <ul className="space-y-3">
            {feature.useCases.map((uc) => (
              <li key={uc} className="flex items-center gap-3 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                {uc}
              </li>
            ))}
          </ul>
        </section>

        {/* More features */}
        <section className="bg-card border-y border-border">
          <div className="container max-w-4xl mx-auto px-4 py-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">Explore More Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherFeatures.map(([key, f]) => (
                <Link key={key} to={`/features/${key}`} className="group">
                  <Card className="bg-background border-border h-full transition-all hover:border-primary/40">
                    <CardContent className="p-5">
                      <f.icon className="h-6 w-6 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                      <p className="text-xs text-muted-foreground">{f.tagline}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Try {feature.title} Now</h2>
          <p className="text-muted-foreground mb-6">Sign up free and start using {feature.title} today.</p>
          <Button variant="accent" size="lg" asChild>
            <Link to="/auth">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default FeatureDetail;
