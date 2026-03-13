import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Decision, Emotion, Category, categories } from '@/types/decision';
import { cn } from '@/lib/utils';
import { Sparkles, X } from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (decision: {
    decision: string;
    reasoning: string;
    emotion: Emotion;
    category: Category;
    expectedOutcome: string;
  }) => void;
  onCancel: () => void;
  editingDecision?: Decision | null;
}

const emotions: { value: Emotion; label: string; icon: string }[] = [
  { value: 'confident', label: 'Confident', icon: '💪' },
  { value: 'anxious', label: 'Anxious', icon: '😰' },
  { value: 'neutral', label: 'Neutral', icon: '😐' },
  { value: 'excited', label: 'Excited', icon: '🔥' },
  { value: 'uncertain', label: 'Uncertain', icon: '🤔' },
];

export function DecisionForm({ onSubmit, onCancel, editingDecision }: DecisionFormProps) {
  const [decision, setDecision] = useState(editingDecision?.decision || '');
  const [reasoning, setReasoning] = useState(editingDecision?.reasoning || '');
  const [emotion, setEmotion] = useState<Emotion>(editingDecision?.emotion || 'neutral');
  const [category, setCategory] = useState<Category>(editingDecision?.category || 'career');
  const [expectedOutcome, setExpectedOutcome] = useState(editingDecision?.expectedOutcome || '');

  useEffect(() => {
    if (editingDecision) {
      setDecision(editingDecision.decision);
      setReasoning(editingDecision.reasoning);
      setEmotion(editingDecision.emotion);
      setCategory(editingDecision.category);
      setExpectedOutcome(editingDecision.expectedOutcome);
    }
  }, [editingDecision]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || !reasoning.trim() || !expectedOutcome.trim()) return;
    
    onSubmit({ decision, reasoning, emotion, category, expectedOutcome });
    if (!editingDecision) {
      setDecision('');
      setReasoning('');
      setEmotion('neutral');
      setCategory('career');
      setExpectedOutcome('');
    }
  };

  const isValid = decision.trim() && reasoning.trim() && expectedOutcome.trim();
  const isEditing = !!editingDecision;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          {isEditing ? 'Edit Decision' : 'New Decision'}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="decision" className="text-sm font-medium text-foreground">
          What decision are you making?
        </Label>
        <Textarea
          id="decision"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="I'm deciding to..."
          className="min-h-[80px] bg-input border-border focus:border-primary resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reasoning" className="text-sm font-medium text-foreground">
          Why are you making this decision?
        </Label>
        <Textarea
          id="reasoning"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="My reasoning is..."
          className="min-h-[100px] bg-input border-border focus:border-primary resize-none"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          How are you feeling right now?
        </Label>
        <div className="flex flex-wrap gap-2">
          {emotions.map((e) => (
            <button
              key={e.value}
              type="button"
              onClick={() => setEmotion(e.value)}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200',
                emotion === e.value
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:border-muted-foreground'
              )}
            >
              <span className="mr-2">{e.icon}</span>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          What area of life?
        </Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200',
                category === c.value
                  ? c.color
                  : 'bg-secondary border-border text-muted-foreground hover:border-muted-foreground'
              )}
            >
              <span className="mr-2">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="outcome" className="text-sm font-medium text-foreground">
          What outcome do you expect?
        </Label>
        <Textarea
          id="outcome"
          value={expectedOutcome}
          onChange={(e) => setExpectedOutcome(e.target.value)}
          placeholder="I expect this will lead to..."
          className="min-h-[80px] bg-input border-border focus:border-primary resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="accent"
          disabled={!isValid}
          className="flex-1"
        >
          <Sparkles className="h-4 w-4" />
          {isEditing ? 'Update Decision' : 'Log Decision'}
        </Button>
      </div>
    </form>
  );
}
