import { useState, useEffect } from 'react';
import { Decision } from '@/types/decision';

const STORAGE_KEY = 'decision-journal';

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setDecisions(parsed.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt),
        reviewedAt: d.reviewedAt ? new Date(d.reviewedAt) : undefined,
      })));
    }
  }, []);

  const saveDecisions = (newDecisions: Decision[]) => {
    setDecisions(newDecisions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDecisions));
  };

  const addDecision = (decision: Omit<Decision, 'id' | 'createdAt'>) => {
    const newDecision: Decision = {
      ...decision,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    saveDecisions([newDecision, ...decisions]);
  };

  const updateDecision = (id: string, updates: Partial<Decision>) => {
    const updated = decisions.map((d) =>
      d.id === id ? { ...d, ...updates } : d
    );
    saveDecisions(updated);
  };

  const deleteDecision = (id: string) => {
    saveDecisions(decisions.filter((d) => d.id !== id));
  };

  const getUnreviewedDecisions = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return decisions.filter(
      (d) => !d.reviewedAt && new Date(d.createdAt) <= weekAgo
    );
  };

  return {
    decisions,
    addDecision,
    updateDecision,
    deleteDecision,
    getUnreviewedDecisions,
  };
}
