import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Subject, Absence, Assignment, Exam, StudyTopic } from '../types';

interface AppState {
  theme: 'light' | 'dark';
  subjects: Subject[];
  absences: Absence[];
  assignments: Assignment[];
  exams: Exam[];
  studyTopics: StudyTopic[];

  // Actions
  toggleTheme: () => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addAbsence: (absence: Omit<Absence, 'id'>) => void;
  deleteAbsence: (id: string) => void;

  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  addStudyTopic: (topic: Omit<StudyTopic, 'id'>) => void;
  updateStudyTopic: (id: string, topic: Partial<StudyTopic>) => void;
  deleteStudyTopic: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      subjects: [],
      absences: [],
      assignments: [],
      exams: [],
      studyTopics: [],

      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, { ...subject, id: uuidv4() }] })),
      updateSubject: (id, updated) => set((state) => ({
        subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...updated } : s)),
      })),
      deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter((s) => s.id !== id),
        absences: state.absences.filter((a) => a.subjectId !== id),
        assignments: state.assignments.filter((a) => a.subjectId !== id),
        exams: state.exams.filter((e) => e.subjectId !== id),
        studyTopics: state.studyTopics.filter((t) => t.subjectId !== id),
      })),

      addAbsence: (absence) => set((state) => ({ absences: [...state.absences, { ...absence, id: uuidv4() }] })),
      deleteAbsence: (id) => set((state) => ({ absences: state.absences.filter((a) => a.id !== id) })),

      addAssignment: (assignment) => set((state) => ({ assignments: [...state.assignments, { ...assignment, id: uuidv4() }] })),
      updateAssignment: (id, updated) => set((state) => ({
        assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...updated } : a)),
      })),
      deleteAssignment: (id) => set((state) => ({ assignments: state.assignments.filter((a) => a.id !== id) })),

      addExam: (exam) => set((state) => ({ exams: [...state.exams, { ...exam, id: uuidv4() }] })),
      updateExam: (id, updated) => set((state) => ({
        exams: state.exams.map((e) => (e.id === id ? { ...e, ...updated } : e)),
      })),
      deleteExam: (id) => set((state) => ({ exams: state.exams.filter((e) => e.id !== id) })),

      addStudyTopic: (topic) => set((state) => ({ studyTopics: [...state.studyTopics, { ...topic, id: uuidv4() }] })),
      updateStudyTopic: (id, updated) => set((state) => ({
        studyTopics: state.studyTopics.map((t) => (t.id === id ? { ...t, ...updated } : t)),
      })),
      deleteStudyTopic: (id) => set((state) => ({ studyTopics: state.studyTopics.filter((t) => t.id !== id) })),
    }),
    {
      name: 'academic-manager-storage',
    }
  )
);