import React, { useState } from 'react';
import { useStore } from '@/src/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Plus, CheckCircle2, Circle, CalendarIcon, Trash2, GraduationCap } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/src/lib/utils';
import { TaskStatus, Priority, StudyStatus } from '@/src/types';

export function Tasks() {
  const { subjects, assignments, exams, addAssignment, updateAssignment, deleteAssignment, addExam, updateExam, deleteExam } = useStore();
  const [activeTab, setActiveTab] = useState<'assignments' | 'exams'>('assignments');
  const [isAdding, setIsAdding] = useState(false);

  // Assignment State
  const [newAssignment, setNewAssignment] = useState({ title: '', subjectId: '', dueDate: '', status: 'pending' as TaskStatus, notes: '' });

  // Exam State
  const [newExam, setNewExam] = useState({ title: '', subjectId: '', date: '', priority: 'medium' as Priority, studyStatus: 'not_started' as StudyStatus, notes: '' });

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.subjectId || !newAssignment.dueDate) return;
    addAssignment(newAssignment);
    setNewAssignment({ title: '', subjectId: '', dueDate: '', status: 'pending', notes: '' });
    setIsAdding(false);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.title || !newExam.subjectId || !newExam.date) return;
    addExam(newExam);
    setNewExam({ title: '', subjectId: '', date: '', priority: 'medium', studyStatus: 'not_started', notes: '' });
    setIsAdding(false);
  };

  const sortedAssignments = [...assignments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tarefas e Provas</h1>
          <p className="text-slate-500 mt-1">Gerencie seus prazos e avaliações.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-200/50 rounded-xl">
            <button
              onClick={() => { setActiveTab('assignments'); setIsAdding(false); }}
              className={cn("px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200", activeTab === 'assignments' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Tarefas
            </button>
            <button
              onClick={() => { setActiveTab('exams'); setIsAdding(false); }}
              className={cn("px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200", activeTab === 'exams' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Provas
            </button>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)} className="hidden sm:flex shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Adicionar {activeTab === 'assignments' ? 'Tarefa' : 'Prova'}
          </Button>
        </div>
      </div>

      {/* Mobile Add Button */}
      <Button onClick={() => setIsAdding(!isAdding)} className="w-full sm:hidden shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Adicionar {activeTab === 'assignments' ? 'Tarefa' : 'Prova'}
      </Button>

      {isAdding && activeTab === 'assignments' && (
        <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Título *</label>
                  <Input value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} placeholder="ex., Lista de Matemática 5" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Disciplina *</label>
                  <select
                    value={newAssignment.subjectId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    required
                  >
                    <option value="" disabled>Selecione uma disciplina</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Data de Entrega *</label>
                  <Input type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Anotações (Opcional)</label>
                  <Input value={newAssignment.notes} onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })} placeholder="Qualquer informação extra..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
                <Button type="submit">Salvar Tarefa</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isAdding && activeTab === 'exams' && (
        <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleAddExam} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Título da Prova *</label>
                  <Input value={newExam.title} onChange={(e) => setNewExam({ ...newExam, title: e.target.value })} placeholder="ex., Prova 1" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Disciplina *</label>
                  <select
                    value={newExam.subjectId}
                    onChange={(e) => setNewExam({ ...newExam, subjectId: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    required
                  >
                    <option value="" disabled>Selecione uma disciplina</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Data *</label>
                  <Input type="date" value={newExam.date} onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Prioridade</label>
                  <select
                    value={newExam.priority}
                    onChange={(e) => setNewExam({ ...newExam, priority: e.target.value as Priority })}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
                <Button type="submit">Salvar Prova</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Empty States */}
      {activeTab === 'assignments' && sortedAssignments.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-emerald-50 p-4 mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Nenhuma tarefa</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Tudo em dia! Adicione uma tarefa para acompanhá-la aqui.</p>
        </div>
      )}

      {activeTab === 'exams' && sortedExams.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-indigo-50 p-4 mb-4">
            <GraduationCap className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Nenhuma prova</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Nenhuma prova próxima. Adicione uma para começar a se preparar.</p>
        </div>
      )}

      {/* Assignments List */}
      {activeTab === 'assignments' && sortedAssignments.length > 0 && (
        <div className="space-y-3">
          {sortedAssignments.map((assignment) => {
            const subject = subjects.find(s => s.id === assignment.subjectId);
            const isCompleted = assignment.status === 'completed';
            const isOverdue = isPast(new Date(assignment.dueDate)) && !isToday(new Date(assignment.dueDate)) && !isCompleted;

            return (
              <Card key={assignment.id} className={cn("transition-all hover:shadow-md", isCompleted ? "opacity-60 bg-slate-50/50" : "bg-white")}>
                <CardContent className="p-4 flex items-start sm:items-center gap-4">
                  <button
                    onClick={() => updateAssignment(assignment.id, { status: isCompleted ? 'pending' : 'completed' })}
                    className="mt-1 sm:mt-0 flex-shrink-0 text-slate-300 hover:text-emerald-500 transition-colors"
                  >
                    {isCompleted ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <p className={cn("font-semibold text-slate-900 truncate", isCompleted && "line-through text-slate-500")}>
                        {assignment.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs sm:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject?.color || '#cbd5e1' }} />
                          <span className="font-medium text-slate-600">{subject?.name || 'Desconhecida'}</span>
                        </div>
                        <span className={cn("flex items-center gap-1.5 font-medium", isOverdue ? "text-red-600 bg-red-50 px-2 py-1 rounded-md" : "text-slate-500")}>
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {format(new Date(assignment.dueDate), "d 'de' MMM, yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    {assignment.notes && <p className="text-sm text-slate-500 mt-1.5 truncate">{assignment.notes}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAssignment(assignment.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Exams List */}
      {activeTab === 'exams' && sortedExams.length > 0 && (
        <div className="space-y-3">
          {sortedExams.map((exam) => {
            const subject = subjects.find(s => s.id === exam.subjectId);
            const isPastExam = isPast(new Date(exam.date)) && !isToday(new Date(exam.date));

            return (
              <Card key={exam.id} className={cn("transition-all hover:shadow-md", isPastExam ? "opacity-60 bg-slate-50/50" : "bg-white")}>
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-slate-900 truncate">{exam.title}</h3>
                      <Badge variant={exam.priority === 'high' ? 'destructive' : exam.priority === 'medium' ? 'warning' : 'secondary'} className="text-[10px] uppercase tracking-wider font-bold">
                        {exam.priority === 'low' ? 'Baixa' : exam.priority === 'medium' ? 'Média' : 'Alta'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject?.color || '#cbd5e1' }} />
                        <span className="font-medium text-slate-600">{subject?.name || 'Desconhecida'}</span>
                      </div>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <CalendarIcon className="h-4 w-4" />
                        {format(new Date(exam.date), "EEEE, d 'de' MMM, yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    {exam.notes && <p className="text-sm text-slate-500 mt-3 bg-slate-50 p-2 rounded-md">{exam.notes}</p>}
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status de Estudo</span>
                      <select
                        value={exam.studyStatus}
                        onChange={(e) => updateExam(exam.id, { studyStatus: e.target.value as StudyStatus })}
                        className={cn(
                          "text-sm font-semibold rounded-lg border-0 py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-indigo-600 transition-colors cursor-pointer",
                          exam.studyStatus === 'ready' ? "bg-emerald-100 text-emerald-800" :
                          exam.studyStatus === 'studying' ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-600"
                        )}
                      >
                        <option value="not_started">Não Iniciado</option>
                        <option value="studying">Estudando</option>
                        <option value="ready">Pronto</option>
                      </select>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteExam(exam.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
