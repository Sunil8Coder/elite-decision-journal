import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PlannerTask } from '@/types/features';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ArrowLeft, Trash2, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';

const priorityColors: Record<PlannerTask['priority'], string> = {
  low: 'bg-secondary text-secondary-foreground',
  medium: 'bg-primary/20 text-primary',
  high: 'bg-destructive/20 text-destructive',
};

const Planner = () => {
  const [tasks, setTasks] = useLocalStorage<PlannerTask[]>('planner-tasks', []);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PlannerTask['priority']>('medium');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const task: PlannerTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setView('list');
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onAddDecision={() => setView('form')} showAddButton={view === 'list' && tasks.length > 0} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {view === 'form' ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => setView('list')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="font-display text-xl font-semibold">New Task</h2>
            <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Select value={priority} onValueChange={(v) => setPriority(v as PlannerTask['priority'])}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="accent" onClick={handleSubmit} disabled={!title.trim()}>
              Add Task
            </Button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="p-4 rounded-2xl bg-primary/10 mb-6">
              <CalendarCheck className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">Your Planner</h2>
            <p className="text-muted-foreground max-w-sm mb-6">Plan and track your tasks with priorities.</p>
            <Button variant="accent" onClick={() => setView('form')}>
              <Plus className="h-4 w-4 mr-1" /> Add First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {pending.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">To Do ({pending.length})</h3>
                {pending.map((task) => (
                  <Card key={task.id} className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={task.completed} onCheckedChange={() => toggleComplete(task.id)} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(task.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {task.dueDate && <p className="text-xs text-muted-foreground">Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</p>}
                        </div>
                      </div>
                    </CardHeader>
                    {task.description && (
                      <CardContent className="pl-12">
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
            {completed.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed ({completed.length})</h3>
                {completed.map((task) => (
                  <Card key={task.id} className="bg-card border-border opacity-60">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={task.completed} onCheckedChange={() => toggleComplete(task.id)} />
                        <CardTitle className="text-base font-semibold line-through">{task.title}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto text-muted-foreground hover:text-destructive" onClick={() => handleDelete(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Planner;
