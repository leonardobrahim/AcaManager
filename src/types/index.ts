export type Priority = 'low' | 'medium' | 'high';
export type StudyStatus = 'not_started' | 'studying' | 'ready';
export type TaskStatus = 'pending' | 'completed';

export interface Subject {
  id: string;
  name: string;
  professor?: string;
  maxAbsences: number;
  color: string;
}

export interface Absence {
  id: string;
  subjectId: string;
  date: string;
  notes?: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  notes?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  date: string;
  priority: Priority;
  studyStatus: StudyStatus;
  notes?: string;
}

export interface StudyTopic {
  id: string;
  subjectId: string;
  title: string;
  completed: boolean;
  notes?: string;
}
