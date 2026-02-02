import { Decision, categories } from '@/types/decision';
import { EmotionBadge } from './EmotionBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DecisionDetailProps {
  decision: Decision;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Decision>) => void;
  onDelete: (id: string) => void;
}

export function DecisionDetail({
  decision,
  onBack,
  onUpdate,
  onDelete,
}: DecisionDetailProps) {
  const [actualOutcome, setActualOutcome] = useState(decision.actualOutcome || '');
  const [isReviewing, setIsReviewing] = useState(false);
  const categoryInfo = categories.find((c) => c.value === decision.category);

  const handleReview = () => {
    onUpdate(decision.id, {
      actualOutcome,
      reviewedAt: new Date(),
    });
    setIsReviewing(false);
  };

  return (
    <div className="animate-slide-up">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to decisions
      </button>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <EmotionBadge emotion={decision.emotion} />
            {categoryInfo && (
              <span className={cn('inline-flex items-center gap-1 text-sm px-2.5 py-1 rounded-full border', categoryInfo.color)}>
                {categoryInfo.icon} {categoryInfo.label}
              </span>
            )}
            {decision.reviewedAt && (
              <span className="inline-flex items-center gap-1 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Reviewed
              </span>
            )}
          </div>
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
            {decision.decision}
          </h1>
          <p className="text-sm text-muted-foreground">
            Logged {format(new Date(decision.createdAt), 'MMMM d, yyyy')} at{' '}
            {format(new Date(decision.createdAt), 'h:mm a')}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            My Reasoning
          </h3>
          <p className="text-foreground">{decision.reasoning}</p>
        </div>

        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Expected Outcome
          </h3>
          <p className="text-foreground">{decision.expectedOutcome}</p>
        </div>

        {decision.reviewedAt && decision.actualOutcome && (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
            <h3 className="text-sm font-medium text-primary mb-2">
              Actual Outcome
            </h3>
            <p className="text-foreground">{decision.actualOutcome}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Reviewed {format(new Date(decision.reviewedAt), 'MMMM d, yyyy')}
            </p>
          </div>
        )}

        {!decision.reviewedAt && !isReviewing && (
          <Button
            onClick={() => setIsReviewing(true)}
            variant="accent"
            className="w-full"
          >
            <CheckCircle2 className="h-4 w-4" />
            Review This Decision
          </Button>
        )}

        {isReviewing && (
          <div className="space-y-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
            <Label className="text-sm font-medium text-foreground">
              What actually happened?
            </Label>
            <Textarea
              value={actualOutcome}
              onChange={(e) => setActualOutcome(e.target.value)}
              placeholder="The actual outcome was..."
              className="min-h-[100px] bg-input border-border focus:border-primary resize-none"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsReviewing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                onClick={handleReview}
                disabled={!actualOutcome.trim()}
                className="flex-1"
              >
                Complete Review
              </Button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => onDelete(decision.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete Decision
          </Button>
        </div>
      </div>
    </div>
  );
}
