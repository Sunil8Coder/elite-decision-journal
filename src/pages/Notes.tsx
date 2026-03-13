import { useState } from 'react';
import { useNotesApi } from '@/hooks/useFeatureApi';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Trash2, StickyNote, Loader2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { ApiNote } from '@/lib/api';

const Notes = () => {
  const { items: notes, loading, create, remove, update } = useNotesApi();
  const [view, setView] = useState<'list' | 'form' | 'detail' | 'edit'>('list');
  const [selectedNote, setSelectedNote] = useState<ApiNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTag('');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    const success = await create({
      title: title.trim(),
      content: content.trim(),
      tag: tag.trim() || undefined,
    });
    if (success) {
      resetForm();
      setView('list');
    }
  };

  const handleEdit = (note: ApiNote) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTag(note.tag || '');
    setView('edit');
  };

  const handleUpdate = async () => {
    if (!selectedNote || !title.trim() || !content.trim()) return;
    const success = await update(selectedNote.id, {
      title: title.trim(),
      content: content.trim(),
      tag: tag.trim() || undefined,
    });
    if (success) {
      resetForm();
      setView('list');
      setSelectedNote(null);
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
      <Header onAddDecision={() => setView('form')} showAddButton={(view === 'list' || view === 'detail') && notes.length > 0} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {view === 'detail' && selectedNote ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => { setView('list'); setSelectedNote(null); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Notes
            </Button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold">{selectedNote.title}</h2>
                {selectedNote.tag && <Badge variant="secondary" className="text-xs">{selectedNote.tag}</Badge>}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(selectedNote)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { remove(selectedNote.id); setView('list'); setSelectedNote(null); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedNote.createdAt && !isNaN(new Date(selectedNote.createdAt).getTime())
                ? format(new Date(selectedNote.createdAt), 'EEEE, MMMM d, yyyy')
                : 'Just now'}
            </p>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedNote.content}</p>
              </CardContent>
            </Card>
          </div>
        ) : (view === 'form' || view === 'edit') ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => { setView(view === 'edit' && selectedNote ? 'detail' : 'list'); resetForm(); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="font-display text-xl font-semibold">
              {view === 'edit' ? 'Edit Note' : 'New Note'}
            </h2>
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Write your note..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            <Input placeholder="Tag (optional)" value={tag} onChange={(e) => setTag(e.target.value)} />
            <Button variant="accent" onClick={view === 'edit' ? handleUpdate : handleSubmit} disabled={!title.trim() || !content.trim()}>
              {view === 'edit' ? 'Update Note' : 'Save Note'}
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
              <Card key={note.id} className="bg-card border-border cursor-pointer hover:border-primary/50 transition-colors" onClick={() => { setSelectedNote(note); setView('detail'); }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">{note.title}</CardTitle>
                      {note.tag && <Badge variant="secondary" className="text-xs">{note.tag}</Badge>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(note); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); remove(note.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
