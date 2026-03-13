import { useState } from 'react';
import { useDiaryApi } from '@/hooks/useFeatureApi';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Trash2, BookOpen, Loader2, Pencil } from 'lucide-react';
import { format } from 'date-fns';

const Diary = () => {
  const { items: entries, loading, create, remove, update } = useDiaryApi();
  const [view, setView] = useState<'list' | 'form' | 'detail' | 'edit'>('list');
  const [selectedEntry, setSelectedEntry] = useState<typeof entries[0] | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const moods = ['😊', '😐', '😔', '😤', '🤔', '😴', '🥳'];

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    const success = await create({
      title: title.trim(),
      content: content.trim(),
      mood: mood || undefined,
      date: new Date().toISOString(),
    });
    if (success) {
      resetForm();
      setView('list');
    }
  };

  const handleEdit = (entry: typeof entries[0]) => {
    setSelectedEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || '');
    setView('edit');
  };

  const handleUpdate = async () => {
    if (!selectedEntry || !title.trim() || !content.trim()) return;
    const success = await update(selectedEntry.id, {
      title: title.trim(),
      content: content.trim(),
      mood: mood || undefined,
    });
    if (success) {
      resetForm();
      setView('list');
      setSelectedEntry(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header onAddDecision={() => {}} showAddButton={false} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onAddDecision={() => setView('form')} showAddButton={(view === 'list' || view === 'detail') && entries.length > 0} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {view === 'detail' && selectedEntry ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => { setView('list'); setSelectedEntry(null); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Diary
            </Button>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                {selectedEntry.mood && <span className="mr-2">{selectedEntry.mood}</span>}
                {selectedEntry.title}
              </h2>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(selectedEntry)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { remove(selectedEntry.id); setView('list'); setSelectedEntry(null); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedEntry.date && !isNaN(new Date(selectedEntry.date).getTime())
                ? format(new Date(selectedEntry.date), 'EEEE, MMMM d, yyyy')
                : 'Just now'}
            </p>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedEntry.content}</p>
              </CardContent>
            </Card>
          </div>
        ) : (view === 'form' || view === 'edit') ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => { setView(view === 'edit' && selectedEntry ? 'detail' : 'list'); resetForm(); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="font-display text-xl font-semibold">
              {view === 'edit' ? 'Edit Diary Entry' : 'New Diary Entry'}
            </h2>
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
            <Button variant="accent" onClick={view === 'edit' ? handleUpdate : handleSubmit} disabled={!title.trim() || !content.trim()}>
              {view === 'edit' ? 'Update Entry' : 'Save Entry'}
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
              <Card key={entry.id} className="bg-card border-border cursor-pointer hover:border-primary/50 transition-colors" onClick={() => { setSelectedEntry(entry); setView('detail'); }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {entry.mood && <span className="mr-2">{entry.mood}</span>}
                      {entry.title}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(entry); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); remove(entry.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.date && !isNaN(new Date(entry.date).getTime())
                      ? format(new Date(entry.date), 'MMM d, yyyy')
                      : 'Just now'}
                  </p>
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
