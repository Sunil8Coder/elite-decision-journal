import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DiaryEntry } from '@/types/features';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const Diary = () => {
  const [entries, setEntries] = useLocalStorage<DiaryEntry[]>('diary-entries', []);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const moods = ['😊', '😐', '😔', '😤', '🤔', '😴', '🥳'];

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      mood,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
    setTitle('');
    setContent('');
    setMood('');
    setView('list');
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onAddDecision={() => setView('form')} showAddButton={view === 'list' && entries.length > 0} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {view === 'form' ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => setView('list')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="font-display text-xl font-semibold">New Diary Entry</h2>
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="What happened today..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            <div>
              <p className="text-sm text-muted-foreground mb-2">How are you feeling?</p>
              <div className="flex gap-2">
                {moods.map((m) => (
                  <button key={m} onClick={() => setMood(m)} className={`text-2xl p-1 rounded-lg transition-all ${mood === m ? 'bg-primary/20 scale-110' : 'hover:bg-secondary'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <Button variant="accent" onClick={handleSubmit} disabled={!title.trim() || !content.trim()}>
              Save Entry
            </Button>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="p-4 rounded-2xl bg-primary/10 mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">Your Diary</h2>
            <p className="text-muted-foreground max-w-sm mb-6">Start writing your daily reflections.</p>
            <Button variant="accent" onClick={() => setView('form')}>
              <Plus className="h-4 w-4 mr-1" /> Write First Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {entries.map((entry) => (
              <Card key={entry.id} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {entry.mood && <span className="mr-2">{entry.mood}</span>}
                      {entry.title}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(entry.date), 'MMM d, yyyy')}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Diary;
