export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  date: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'wishlist';
  notes?: string;
  rating?: number;
  createdAt: string;
}

export interface PlannerTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}
