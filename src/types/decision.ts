export type Emotion = 'confident' | 'anxious' | 'neutral' | 'excited' | 'uncertain';

export interface Decision {
  id: string;
  decision: string;
  reasoning: string;
  emotion: Emotion;
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
