import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Book } from '@/types/features';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ArrowLeft, Trash2, BookMarked, Star } from 'lucide-react';

const statusColors: Record<Book['status'], string> = {
  reading: 'bg-primary/20 text-primary',
  completed: 'bg-green-500/20 text-green-400',
  wishlist: 'bg-secondary text-secondary-foreground',
};

const Books = () => {
  const [books, setBooks] = useLocalStorage<Book[]>('books-entries', []);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<Book['status']>('wishlist');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!title.trim() || !author.trim()) return;
    const book: Book = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      status,
      notes: notes.trim() || undefined,
      rating: rating || undefined,
      createdAt: new Date().toISOString(),
    };
    setBooks((prev) => [book, ...prev]);
    setTitle('');
    setAuthor('');
    setStatus('wishlist');
    setNotes('');
    setRating(0);
    setView('list');
  };

  const handleDelete = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onAddDecision={() => setView('form')} showAddButton={view === 'list' && books.length > 0} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {view === 'form' ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => setView('list')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="font-display text-xl font-semibold">Add Book</h2>
            <Input placeholder="Book title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <Select value={status} onValueChange={(v) => setStatus(v as Book['status'])}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wishlist">Wishlist</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                    <Star className={`h-6 w-6 ${s <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
            <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            <Button variant="accent" onClick={handleSubmit} disabled={!title.trim() || !author.trim()}>
              Save Book
            </Button>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="p-4 rounded-2xl bg-primary/10 mb-6">
              <BookMarked className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">Your Book Shelf</h2>
            <p className="text-muted-foreground max-w-sm mb-6">Track books you're reading and want to read.</p>
            <Button variant="accent" onClick={() => setView('form')}>
              <Plus className="h-4 w-4 mr-1" /> Add First Book
            </Button>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {books.map((book) => (
              <Card key={book.id} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">{book.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[book.status]}>{book.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(book.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {(book.rating || book.notes) && (
                  <CardContent>
                    {book.rating && (
                      <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-4 w-4 ${s <= book.rating! ? 'fill-primary text-primary' : 'text-muted'}`} />
                        ))}
                      </div>
                    )}
                    {book.notes && <p className="text-sm text-muted-foreground line-clamp-2">{book.notes}</p>}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Books;
