import { Link } from 'react-router-dom';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, BookOpen, StickyNote, BookMarked, CalendarCheck, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Decision Tracker',
    desc: 'Log important decisions with your reasoning and emotional state. Come back later to review outcomes and detect cognitive biases like confirmation bias, sunk cost fallacy, and more.',
    bullets: ['Record decision + reasoning + emotion', 'Set expected outcomes', 'Review with actual outcomes', 'Automatic bias detection insights'],
    href: '/features/decisions',
    color: 'text-primary',
  },
  {
    icon: BookOpen,
    title: 'Diary',
    desc: 'Daily reflections with mood tracking. Write about your day, tag your mood with emojis, and build a searchable archive of your personal growth journey.',
    bullets: ['Daily journal entries', 'Mood emoji tracking', 'Date-stamped reflections', 'Chronological timeline'],
    href: '/features/diary',
    color: 'text-primary',
  },
  {
    icon: StickyNote,
    title: 'Notes',
    desc: 'Capture thoughts and ideas in seconds. Tag notes for easy categorisation and retrieval. Perfect for quick ideas, meeting notes, or random inspiration.',
    bullets: ['Quick note capture', 'Optional tagging system', 'Full-text entries', 'Clean, scannable list view'],
    href: '/features/notes',
    color: 'text-primary',
  },
  {
    icon: BookMarked,
    title: 'Book Shelf',
    desc: 'Track your reading life. Add books to your wishlist, mark what you\'re currently reading, rate completed books, and keep personal reading notes.',
    bullets: ['Wishlist / Reading / Completed statuses', '5-star rating system', 'Personal reading notes', 'Author tracking'],
    href: '/features/books',
    color: 'text-primary',
  },
  {
    icon: CalendarCheck,
    title: 'Planner',
    desc: 'Stay on top of tasks with priority levels and due dates. Toggle completion status and keep a clear view of pending vs completed work.',
    bullets: ['Low / Medium / High priority', 'Due date tracking', 'Completion toggle', 'Pending vs completed sections'],
    href: '/features/planner',
    color: 'text-primary',
  },
];

const FeaturesOverview = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <section className="container max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">All Features</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Five integrated tools to help you make better decisions, reflect on your day, capture ideas, track reading, and stay productive.
          </p>
        </section>

        <section className="container max-w-5xl mx-auto px-4 pb-20 space-y-8">
          {features.map((f, i) => (
            <Card key={f.href} className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <div className={`flex flex-col md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Icon side */}
                  <div className="flex items-center justify-center p-8 md:p-12 md:w-1/3 bg-primary/5">
                    <f.icon className="h-16 w-16 text-primary" />
                  </div>
                  {/* Content side */}
                  <div className="p-6 md:p-8 md:w-2/3">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">{f.title}</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{f.desc}</p>
                    <ul className="space-y-2 mb-6">
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={f.href}>Learn more <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="container max-w-3xl mx-auto px-4 pb-20 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Ready to get started?</h2>
          <Button variant="accent" size="lg" asChild>
            <Link to="/auth">Create Free Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default FeaturesOverview;
