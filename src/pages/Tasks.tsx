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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tarefas e Provas</h1>
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => { setActiveTab('assignments'); setIsAdding(false); }}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'assignments' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Tarefas
            </button>
            <button
              onClick={() => { setActiveTab('exams'); setIsAdding(false); }}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'exams' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Provas
            </button>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)} size="sm" className="hidden sm:flex">
            <Plus className="mr-2 h-4 w-4" /> Adicionar {activeTab === 'assignments' ? 'Tarefa' : 'Prova'}
          </Button>
        </div>
      </div>

      {/* Mobile Add Button */}
      <Button onClick={() => setIsAdding(!isAdding)} className="w-full sm:hidden" variant="outline">
        <Plus className="mr-2 h-4 w-4" /> Adicionar {activeTab === 'assignments' ? 'Tarefa' : 'Prova'}
      </Button>

      {isAdding && activeTab === 'assignments' && (
        <Card className="border-indigo-100 bg-indigo-50/50">
          <CardContent className="p-4 sm:p-6">
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
        <Card className="border-indigo-100 bg-indigo-50/50">
          <CardContent className="p-4 sm:p-6">
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-100 p-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Nenhuma tarefa</h3>
          <p className="text-sm text-slate-500 mt-1">Tudo em dia! Adicione uma tarefa para acompanhá-la aqui.</p>
        </div>
      )}

      {activeTab === 'exams' && sortedExams.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-100 p-3 mb-4">
            <GraduationCap className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Nenhuma prova</h3>
          <p className="text-sm text-slate-500 mt-1">Nenhuma prova próxima. Adicione uma para começar a se preparar.</p>
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
              <Card key={assignment.id} className={cn("transition-all", isCompleted ? "opacity-60 bg-slate-50" : "bg-white")}>
                <CardContent className="p-4 flex items-start sm:items-center gap-4">
                  <button
                    onClick={() => updateAssignment(assignment.id, { status: isCompleted ? 'pending' : 'completed' })}
                    className="mt-1 sm:mt-0 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {isCompleted ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <p className={cn("font-medium truncate", isCompleted && "line-through text-slate-500")}>
                        {assignment.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                        <Badge variant="outline" style={{ borderColor: subject?.color, color: subject?.color }}>
                          {subject?.name || 'Disciplina Desconhecida'}
                        </Badge>
                        <span className={cn("flex items-center gap-1", isOverdue ? "text-red-600 font-medium" : "text-slate-500")}>
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(assignment.dueDate), "d 'de' MMM, yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    {assignment.notes && <p className="text-xs text-slate-500 mt-1 truncate">{assignment.notes}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAssignment(assignment.id)} className="text-slate-400 hover:text-red-600 flex-shrink-0">
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
              <Card key={exam.id} className={cn("transition-all", isPastExam ? "opacity-60 bg-slate-50" : "bg-white")}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{exam.title}</h3>
                      <Badge variant={exam.priority === 'high' ? 'destructive' : exam.priority === 'medium' ? 'warning' : 'secondary'} className="text-[10px] uppercase">
                        {exam.priority === 'low' ? 'Baixa' : exam.priority === 'medium' ? 'Média' : 'Alta'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1 font-medium" style={{ color: subject?.color }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject?.color }} />
                        {subject?.name || 'Disciplina Desconhecida'}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {format(new Date(exam.date), "EEEE, d 'de' MMM, yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    {exam.notes && <p className="text-sm text-slate-600 mt-2">{exam.notes}</p>}
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status de Estudo</span>
                      <select
                        value={exam.studyStatus}
                        onChange={(e) => updateExam(exam.id, { studyStatus: e.target.value as StudyStatus })}
                        className={cn(
                          "text-sm font-medium rounded-md border-0 py-1 pl-2 pr-8 focus:ring-2 focus:ring-indigo-600 sm:text-sm",
                          exam.studyStatus === 'ready' ? "bg-emerald-100 text-emerald-800" :
                          exam.studyStatus === 'studying' ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-800"
                        )}
                      >
                        <option value="not_started">Não Iniciado</option>
                        <option value="studying">Estudando</option>
                        <option value="ready">Pronto</option>
                      </select>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteExam(exam.id)} className="text-slate-400 hover:text-red-600">
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
