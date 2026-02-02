export type Emotion = 'confident' | 'anxious' | 'neutral' | 'excited' | 'uncertain';

export type Category = 'career' | 'relationships' | 'finances' | 'health';

export const categories: { value: Category; label: string; icon: string; color: string }[] = [
  { value: 'career', label: 'Career', icon: '💼', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'relationships', label: 'Relationships', icon: '💝', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { value: 'finances', label: 'Finances', icon: '💰', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'health', label: 'Health', icon: '🏃', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
];

export interface Decision {
  id: string;
  decision: string;
  reasoning: string;
  emotion: Emotion;
  category: Category;
  expectedOutcome: string;
  createdAt: Date;
  reviewedAt?: Date;
  actualOutcome?: string;
  biasDetected?: string[];
}

export interface BiasPattern {
  name: string;
  count: number;
  description: string;
}
