import { Decision } from '@/types/decision';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';

interface BiasInsightsProps {
  decisions: Decision[];
}

export function BiasInsights({ decisions }: BiasInsightsProps) {
  const insights = useMemo(() => {
    if (decisions.length < 3) return null;

    const emotionCounts = decisions.reduce((acc, d) => {
      acc[d.emotion] = (acc[d.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantEmotion = Object.entries(emotionCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const reviewed = decisions.filter((d) => d.reviewedAt);
    const reviewRate = reviewed.length / decisions.length;

    const anxiousDecisions = decisions.filter((d) => d.emotion === 'anxious').length;
    const anxiousRatio = anxiousDecisions / decisions.length;

    return {
      dominantEmotion: dominantEmotion ? dominantEmotion[0] : null,
      dominantEmotionPercent: dominantEmotion
        ? Math.round((dominantEmotion[1] / decisions.length) * 100)
        : 0,
      reviewRate: Math.round(reviewRate * 100),
      anxiousRatio: Math.round(anxiousRatio * 100),
      totalDecisions: decisions.length,
      reviewedDecisions: reviewed.length,
    };
  }, [decisions]);

  if (!insights) {
    return (
      <div className="p-6 rounded-xl border border-border bg-card text-center">
        <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          Log at least 3 decisions to see bias insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        Bias Insights
      </h2>

      <div className="grid gap-3">
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">
                Dominant Emotional State
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                You feel <span className="text-primary capitalize">{insights.dominantEmotion}</span> in{' '}
                {insights.dominantEmotionPercent}% of your decisions
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">Review Rate</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {insights.reviewedDecisions} of {insights.totalDecisions} decisions reviewed ({insights.reviewRate}%)
              </p>
            </div>
          </div>
        </div>

        {insights.anxiousRatio > 30 && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">
                  Stress Pattern Detected
                </h3>
                <p className="text-amber-200/70 text-sm mt-1">
                  {insights.anxiousRatio}% of decisions made while anxious. Consider
                  delaying non-urgent decisions when stressed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
