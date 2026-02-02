import { Decision } from '@/types/decision';
import { EmotionBadge } from './EmotionBadge';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionCardProps {
  decision: Decision;
  onClick: () => void;
}

export function DecisionCard({ decision, onClick }: DecisionCardProps) {
  const isReviewed = !!decision.reviewedAt;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-5 rounded-xl border transition-all duration-200',
        'bg-card border-border hover:border-muted-foreground/50',
        'hover:shadow-lg group animate-fade-in'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <EmotionBadge emotion={decision.emotion} />
            {isReviewed && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Reviewed
              </span>
            )}
          </div>
          <h3 className="font-medium text-foreground line-clamp-2 mb-1">
            {decision.decision}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {decision.reasoning}
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            {formatDistanceToNow(new Date(decision.createdAt), { addSuffix: true })}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
      </div>
    </button>
  );
}
