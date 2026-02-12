import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { api, ApiDiaryEntry, ApiNote, ApiBook, ApiPlannerTask } from '@/lib/api';
import { toast } from 'sonner';

function useFeatureCrud<T extends { id: string }>(
  listFn: (userId: string) => Promise<{ data?: T[]; error?: string }>,
  createFn: (userId: string, data: any) => Promise<{ data?: T; error?: string }>,
  deleteFn: (userId: string, id: string) => Promise<{ data?: void; error?: string }>,
  label: string
) {
  const { user } = useAuthContext();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await listFn(user.id);
    if (error) {
      toast.error(`Failed to load ${label}`);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }, [user, listFn, label]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const create = useCallback(async (data: any) => {
    if (!user) return;
    const { data: created, error } = await createFn(user.id, data);
    if (error) {
      toast.error(`Failed to create ${label}`);
      return false;
    }
    if (created) {
      setItems((prev) => [created, ...prev]);
    } else {
      await fetchItems();
    }
    return true;
  }, [user, createFn, label, fetchItems]);

  const remove = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await deleteFn(user.id, id);
    if (error) {
      toast.error(`Failed to delete ${label}`);
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, [user, deleteFn, label]);

  return { items, loading, create, remove, refetch: fetchItems };
}

export function useDiaryApi() {
  return useFeatureCrud<ApiDiaryEntry>(
    api.listDiary, api.createDiary, api.deleteDiary, 'diary entry'
  );
}

export function useNotesApi() {
  return useFeatureCrud<ApiNote>(
    api.listNotes, api.createNote, api.deleteNote, 'note'
  );
}

export function useBooksApi() {
  return useFeatureCrud<ApiBook>(
    api.listBooks, api.createBook, api.deleteBook, 'book'
  );
}

export function usePlannerApi() {
  const crud = useFeatureCrud<ApiPlannerTask>(
    api.listPlanner, api.createPlanner, api.deletePlanner, 'task'
  );
  const { user } = useAuthContext();

  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    if (!user) return;
    const { error } = await api.updatePlanner(user.id, id, { completed: !completed });
    if (error) {
      toast.error('Failed to update task');
      return;
    }
    crud.refetch();
  }, [user, crud.refetch]);

  return { ...crud, toggleComplete };
}
