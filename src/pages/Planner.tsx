import { useState } from 'react';
import { usePlannerApi } from '@/hooks/useFeatureApi';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ArrowLeft, Trash2, CalendarCheck, Loader2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { ApiPlannerTask } from '@/lib/api';

const priorityColors: Record<string, string> = {
  low: 'bg-secondary text-secondary-foreground',
  medium: 'bg-primary/20 text-primary',
  high: 'bg-destructive/20 text-destructive',
};

const Planner = () => {
  const { items: tasks, loading, create, remove, toggleComplete, update } = usePlannerApi();
  const [view, setView] = useState<'list' | 'form' | 'detail' | 'edit'>('list');
  const [selectedTask, setSelectedTask] = useState<ApiPlannerTask | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<string>('medium');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const success = await create({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
    });
    if (success) {
      resetForm();
      setView('list');
    }
  };

  const handleEdit = (task: ApiPlannerTask) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate || '');
    setPriority(task.priority);
    setView('edit');
  };

  const handleUpdate = async () => {
    if (!selectedTask || !title.trim()) return;
    const success = await update(selectedTask.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
    });
    if (success) {
      resetForm();
      setView('list');
      setSelectedTask(null);
    }
  };

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

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

  const renderTaskCard = (task: ApiPlannerTask, isCompleted: boolean) => (
    <Card key={task.id} className={`bg-card border-border cursor-pointer hover:border-primary/50 transition-colors ${isCompleted ? 'opacity-60' : ''}`} onClick={() => { setSelectedTask(task); setView('detail'); }}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Checkbox checked={task.completed} onCheckedChange={(e) => { e; toggleComplete(task.id, task.completed); }} onClick={(e) => e.stopPropagation()} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-base font-semibold ${isCompleted ? 'line-through' : ''}`}>{task.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                {!isCompleted && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(task); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); remove(task.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {task.dueDate && !isNaN(new Date(task.dueDate).getTime()) && <p className="text-xs text-muted-foreground">Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</p>}
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="pl-12">
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onAddDecision={() => setView('form')} showAddButton={(view === 'list' || view === 'detail') && tasks.length > 0} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {view === 'detail' && selectedTask ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => { setView('list'); setSelectedTask(null); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Planner
            </Button>
            <div className="flex items-center justify-between">
              <h2 className={`font-display text-xl font-semibold ${selectedTask.completed ? 'line-through' : ''}`}>{selectedTask.title}</h2>
              <div className="flex items-center gap-2">
                <Badge className={priorityColors[selectedTask.priority]}>{selectedTask.priority}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(selectedTask)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { remove(selectedTask.id); setView('list'); setSelectedTask(null); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {selectedTask.dueDate && !isNaN(new Date(selectedTask.dueDate).getTime()) && (
              <p className="text-sm text-muted-foreground">Due: {format(new Date(selectedTask.dueDate), 'EEEE, MMMM d, yyyy')}</p>
            )}
            {selectedTask.description && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedTask.description}</p>
                </CardContent>
              </Card>
            )}
            <div className="flex items-center gap-2">
              <Checkbox checked={selectedTask.completed} onCheckedChange={() => toggleComplete(selectedTask.id, selectedTask.completed)} />
              <span className="text-sm text-muted-foreground">{selectedTask.completed ? 'Completed' : 'Mark as complete'}</span>
            </div>
          </div>
        ) : (view === 'form' || view === 'edit') ? (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" size="sm" onClick={() => { setView(view === 'edit' && selectedTask ? 'detail' : 'list'); resetForm(); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="font-display text-xl font-semibold">
              {view === 'edit' ? 'Edit Task' : 'New Task'}
            </h2>
            <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="accent" onClick={view === 'edit' ? handleUpdate : handleSubmit} disabled={!title.trim()}>
              {view === 'edit' ? 'Update Task' : 'Add Task'}
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
                {pending.map((task) => renderTaskCard(task, false))}
              </div>
            )}
            {completed.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed ({completed.length})</h3>
                {completed.map((task) => renderTaskCard(task, true))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Planner;
