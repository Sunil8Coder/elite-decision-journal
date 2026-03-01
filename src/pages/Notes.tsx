import { useState } from 'react';
import { useNotesApi } from '@/hooks/useFeatureApi';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Trash2, StickyNote, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const Notes = () => {
  const { items: notes, loading, create, remove } = useNotesApi();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    const success = await create({
      title: title.trim(),
      content: content.trim(),
      tag: tag.trim() || undefined,
    });
    if (success) {
      setTitle('');
      setContent('');
      setTag('');
      setView('list');
    }
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
      <Header onAddDecision={() => setView('form')} showAddButton={view === 'list' && notes.length > 0} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {view === 'form' ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => setView('list')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="font-display text-xl font-semibold">New Note</h2>
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Write your note..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            <Input placeholder="Tag (optional)" value={tag} onChange={(e) => setTag(e.target.value)} />
            <Button variant="accent" onClick={handleSubmit} disabled={!title.trim() || !content.trim()}>
              Save Note
            </Button>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="p-4 rounded-2xl bg-primary/10 mb-6">
              <StickyNote className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">Your Notes</h2>
            <p className="text-muted-foreground max-w-sm mb-6">Capture quick thoughts and ideas.</p>
            <Button variant="accent" onClick={() => setView('form')}>
              <Plus className="h-4 w-4 mr-1" /> Create First Note
            </Button>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {notes.map((note) => (
              <Card key={note.id} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">{note.title}</CardTitle>
                      {note.tag && <Badge variant="secondary" className="text-xs">{note.tag}</Badge>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {note.createdAt && !isNaN(new Date(note.createdAt).getTime())
                      ? format(new Date(note.createdAt), 'MMM d, yyyy')
                      : 'Just now'}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
