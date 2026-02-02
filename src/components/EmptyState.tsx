import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddDecision: () => void;
}

export function EmptyState({ onAddDecision }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="p-4 rounded-2xl bg-primary/10 mb-6">
        <BookOpen className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-display font-semibold text-foreground mb-2">
        Start Your Decision Journal
      </h2>
      <p className="text-muted-foreground max-w-sm mb-6">
        Log your important decisions to track patterns, detect biases, and improve
        your judgment over time.
      </p>
      <Button variant="accent" onClick={onAddDecision}>
        Log Your First Decision
      </Button>
    </div>
  );
}
