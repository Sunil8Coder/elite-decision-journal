import { Emotion } from '@/types/decision';
import { cn } from '@/lib/utils';

const emotionConfig: Record<Emotion, { label: string; className: string }> = {
  confident: {
    label: 'Confident',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  anxious: {
    label: 'Anxious',
    className: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  },
  neutral: {
    label: 'Neutral',
    className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  },
  excited: {
    label: 'Excited',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  uncertain: {
    label: 'Uncertain',
    className: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  },
};

interface EmotionBadgeProps {
  emotion: Emotion;
  className?: string;
}

export function EmotionBadge({ emotion, className }: EmotionBadgeProps) {
  const config = emotionConfig[emotion] || {
    label: emotion || 'Unknown',
    className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
