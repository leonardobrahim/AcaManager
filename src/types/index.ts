export type Priority = "low" | "medium" | "high";
export type StudyStatus = "not_started" | "studying" | "ready";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface ClassSchedule {
  dayOfWeek: number; // 1 = Segunda, 2 = Terça, ..., 5 = Sexta
  startTime: string; // Ex: "08:00"
  endTime: string; // Ex: "10:00"
  room?: string; // Ex: "Sala 204"
}

export interface Subject {
  id: string;
  name: string;
  professor?: string;
  maxAbsences: number;
  color: string;
  schedules?: ClassSchedule[];
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
