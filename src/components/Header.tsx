import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onAddDecision: () => void;
  showAddButton: boolean;
}

export function Header({ onAddDecision, showAddButton }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 glass border-b border-border">
      <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Decision Journal
            </h1>
            <p className="text-xs text-muted-foreground">Elite performers only</p>
          </div>
        </div>
        {showAddButton && (
          <Button onClick={onAddDecision} variant="accent" size="sm">
            <Plus className="h-4 w-4" />
            New
          </Button>
        )}
      </div>
    </header>
  );
}
