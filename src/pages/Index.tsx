import { useState } from 'react';
import { useDecisions } from '@/hooks/useDecisions';
import { Decision } from '@/types/decision';
import { Header } from '@/components/Header';
import { DecisionForm } from '@/components/DecisionForm';
import { DecisionCard } from '@/components/DecisionCard';
import { DecisionDetail } from '@/components/DecisionDetail';
import { BiasInsights } from '@/components/BiasInsights';
import { EmptyState } from '@/components/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type View = 'list' | 'form' | 'detail';

const Index = () => {
  const { decisions, addDecision, updateDecision, deleteDecision } = useDecisions();
  const [view, setView] = useState<View>('list');
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const handleAddDecision = (decision: Omit<Decision, 'id' | 'createdAt'>) => {
    addDecision(decision);
    setView('list');
  };

  const handleSelectDecision = (decision: Decision) => {
    setSelectedDecision(decision);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedDecision(null);
    setView('list');
  };

  const handleDelete = (id: string) => {
    deleteDecision(id);
    handleBack();
  };

  const reviewedDecisions = decisions.filter((d) => d.reviewedAt);
  const unreviewedDecisions = decisions.filter((d) => !d.reviewedAt);

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow effect */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(38 92% 60% / 0.15) 0%, transparent 70%)',
        }}
      />

      <Header
        onAddDecision={() => setView('form')}
        showAddButton={view === 'list' && decisions.length > 0}
      />

      <main className="container max-w-2xl mx-auto px-4 py-6">
        {view === 'form' && (
          <DecisionForm
            onSubmit={handleAddDecision}
            onCancel={() => setView('list')}
          />
        )}

        {view === 'detail' && selectedDecision && (
          <DecisionDetail
            decision={selectedDecision}
            onBack={handleBack}
            onUpdate={updateDecision}
            onDelete={handleDelete}
          />
        )}

        {view === 'list' && (
          <>
            {decisions.length === 0 ? (
              <EmptyState onAddDecision={() => setView('form')} />
            ) : (
              <div className="space-y-8">
                <BiasInsights decisions={decisions} />

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-secondary">
                    <TabsTrigger value="all">All ({decisions.length})</TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending ({unreviewedDecisions.length})
                    </TabsTrigger>
                    <TabsTrigger value="reviewed">
                      Reviewed ({reviewedDecisions.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4 space-y-3">
                    {decisions.map((decision) => (
                      <DecisionCard
                        key={decision.id}
                        decision={decision}
                        onClick={() => handleSelectDecision(decision)}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="pending" className="mt-4 space-y-3">
                    {unreviewedDecisions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No pending reviews
                      </p>
                    ) : (
                      unreviewedDecisions.map((decision) => (
                        <DecisionCard
                          key={decision.id}
                          decision={decision}
                          onClick={() => handleSelectDecision(decision)}
                        />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="reviewed" className="mt-4 space-y-3">
                    {reviewedDecisions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No reviewed decisions yet
                      </p>
                    ) : (
                      reviewedDecisions.map((decision) => (
                        <DecisionCard
                          key={decision.id}
                          decision={decision}
                          onClick={() => handleSelectDecision(decision)}
                        />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
