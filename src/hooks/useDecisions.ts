import { useState, useEffect, useCallback } from 'react';
import { Decision, Emotion, Category } from '@/types/decision';
import { api, ApiDecision } from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

function mapApiToDecision(apiDecision: ApiDecision): Decision {
  return {
    id: apiDecision.id,
    decision: apiDecision.decision,
    reasoning: apiDecision.reasoning,
    emotion: apiDecision.emotion as Emotion,
    category: apiDecision.category as Category,
    expectedOutcome: apiDecision.expectedOutcome,
    createdAt: new Date(apiDecision.createdAt),
    reviewedAt: apiDecision.reviewedAt ? new Date(apiDecision.reviewedAt) : undefined,
    actualOutcome: apiDecision.actualOutcome,
    biasDetected: apiDecision.biasDetected,
  };
}

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  const { toast } = useToast();

  const fetchDecisions = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    const { data, error } = await api.listDecisions(user.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else if (data) {
      setDecisions(data.map(mapApiToDecision));
    }
    setIsLoading(false);
  }, [user?.id, toast]);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  const addDecision = async (decision: Omit<Decision, 'id' | 'createdAt'>) => {
    if (!user?.id) return;

    const { data, error } = await api.createDecision(user.id, {
      decision: decision.decision,
      reasoning: decision.reasoning,
      emotion: decision.emotion,
      category: decision.category,
      expectedOutcome: decision.expectedOutcome,
    });

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else if (data) {
      setDecisions((prev) => [mapApiToDecision(data), ...prev]);
      toast({
        title: 'Success',
        description: 'Decision logged successfully',
      });
    }
  };

  const updateDecision = async (id: string, updates: Partial<Decision>) => {
    if (!user?.id) return;

    // If updating with actualOutcome or reviewedAt, use the review endpoint
    if (updates.actualOutcome !== undefined || updates.reviewedAt !== undefined) {
      const { data, error } = await api.reviewDecision(user.id, id, {
        actualOutcome: updates.actualOutcome,
        biasDetected: updates.biasDetected,
        reviewedAt: updates.reviewedAt?.toISOString(),
      });

      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
      } else if (data) {
        setDecisions((prev) =>
          prev.map((d) => (d.id === id ? mapApiToDecision(data) : d))
        );
        toast({
          title: 'Success',
          description: 'Decision reviewed successfully',
        });
      }
    }
  };

  const deleteDecision = async (id: string) => {
    if (!user?.id) return;

    const { error } = await api.deleteDecision(user.id, id);

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } else {
      setDecisions((prev) => prev.filter((d) => d.id !== id));
      toast({
        title: 'Success',
        description: 'Decision deleted successfully',
      });
    }
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
    isLoading,
    addDecision,
    updateDecision,
    deleteDecision,
    getUnreviewedDecisions,
    refetch: fetchDecisions,
  };
}
