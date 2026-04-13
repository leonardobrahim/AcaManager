import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Badge } from "@/src/components/ui/Badge";
import {
  Plus,
  CheckCircle2,
  Circle,
  CalendarIcon,
  Trash2,
  Edit2,
  GraduationCap,
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/src/lib/utils";
import {
  TaskStatus,
  Priority,
  StudyStatus,
  Assignment,
  Exam,
} from "@/src/types";

export function Tasks() {
  const {
    subjects,
    assignments,
    exams,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addExam,
    updateExam,
    deleteExam,
  } = useStore();

  // Estados de UI
  const [activeTab, setActiveTab] = useState<"assignments" | "exams">(
    "assignments",
  );
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Estados de Edição
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(
    null,
  );
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  // Estados dos Formulários
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subjectId: "",
    dueDate: "",
    status: "pending" as TaskStatus,
    notes: "",
  });
  const [newExam, setNewExam] = useState({
    title: "",
    subjectId: "",
    date: "",
    priority: "medium" as Priority,
    studyStatus: "not_started" as StudyStatus,
    notes: "",
  });

  // Função para corrigir o bug de fuso horário (Força a data para as 12:00 local)
  const parseLocal = (dateStr: string) => {
    if (!dateStr) return new Date();
    return new Date(dateStr + "T12:00:00");
  };

  const resetForms = () => {
    setNewAssignment({
      title: "",
      subjectId: "",
      dueDate: "",
      status: "pending",
      notes: "",
    });
    setNewExam({
      title: "",
      subjectId: "",
      date: "",
      priority: "medium",
      studyStatus: "not_started",
      notes: "",
    });
    setEditingAssignmentId(null);
    setEditingExamId(null);
    setIsAdding(false);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newAssignment.title ||
      !newAssignment.subjectId ||
      !newAssignment.dueDate
    )
      return;

    if (editingAssignmentId) {
      updateAssignment(editingAssignmentId, newAssignment);
    } else {
      addAssignment(newAssignment);
    }
    resetForms();
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.title || !newExam.subjectId || !newExam.date) return;

    if (editingExamId) {
      updateExam(editingExamId, newExam);
    } else {
      addExam(newExam);
    }
    resetForms();
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setNewAssignment({
      title: assignment.title,
      subjectId: assignment.subjectId,
      dueDate: assignment.dueDate,
      status: assignment.status,
      notes: assignment.notes || "",
    });
    setEditingAssignmentId(assignment.id);
    setActiveTab("assignments");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditExam = (exam: Exam) => {
    setNewExam({
      title: exam.title,
      subjectId: exam.subjectId,
      date: exam.date,
      priority: exam.priority,
      studyStatus: exam.studyStatus,
      notes: exam.notes || "",
    });
    setEditingExamId(exam.id);
    setActiveTab("exams");
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Lógica de Filtro e Ordenação (Agora joga as concluídas para o fim)
  const filteredAssignments = assignments.filter(
    (a) => selectedSubject === "all" || a.subjectId === selectedSubject,
  );
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    // 1. Verifica se está completa e joga pro final
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    // 2. Se ambas tiverem o mesmo status, ordena pela data mais próxima
    return parseLocal(a.dueDate).getTime() - parseLocal(b.dueDate).getTime();
  });

  const filteredExams = exams.filter(
    (e) => selectedSubject === "all" || e.subjectId === selectedSubject,
  );
  const sortedExams = [...filteredExams].sort((a, b) => {
    // Para as provas, se a data já passou, consideramos finalizada e vai pro fim
    const aPast = isPast(parseLocal(a.date)) && !isToday(parseLocal(a.date));
    const bPast = isPast(parseLocal(b.date)) && !isToday(parseLocal(b.date));

    if (aPast && !bPast) return 1;
    if (!aPast && bPast) return -1;

    return parseLocal(a.date).getTime() - parseLocal(b.date).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tarefas e Provas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gerencie os seus prazos e avaliações.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="cursor-pointer flex h-10 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
          >
            <option value="all">Todas as Disciplinas</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl">
            <button
              onClick={() => {
                setActiveTab("assignments");
                resetForms();
              }}
              className={cn(
                "cursor-pointer px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                activeTab === "assignments"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
              )}
            >
              Tarefas
            </button>
            <button
              onClick={() => {
                setActiveTab("exams");
                resetForms();
              }}
              className={cn(
                "cursor-pointer px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                activeTab === "exams"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
              )}
            >
              Provas
            </button>
          </div>

          <Button
            onClick={() => {
              resetForms();
              setIsAdding(!isAdding);
            }}
            className="hidden sm:flex shadow-sm cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova{" "}
            {activeTab === "assignments" ? "Tarefa" : "Prova"}
          </Button>
        </div>
      </div>

      <Button
        onClick={() => {
          resetForms();
          setIsAdding(!isAdding);
        }}
        className="w-full sm:hidden shadow-sm cursor-pointer"
      >
        <Plus className="mr-2 h-4 w-4" /> Nova{" "}
        {activeTab === "assignments" ? "Tarefa" : "Prova"}
      </Button>

      {/* Formulário de Tarefas */}
      {isAdding && activeTab === "assignments" && (
        <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
              {editingAssignmentId ? "Editar Tarefa" : "Nova Tarefa"}
            </div>
            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Título *
                  </label>
                  <Input
                    value={newAssignment.title}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        title: e.target.value,
                      })
                    }
                    placeholder="ex., Lista de Matemática 5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Disciplina *
                  </label>
                  <select
                    value={newAssignment.subjectId}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        subjectId: e.target.value,
                      })
                    }
                    className="cursor-pointer flex h-10 w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                    required
                  >
                    <option value="" disabled>
                      Selecione uma disciplina
                    </option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Data de Entrega *
                  </label>
                  <Input
                    className="cursor-pointer"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        dueDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Anotações (Opcional)
                  </label>
                  <Input
                    value={newAssignment.notes}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Qualquer informação extra..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={resetForms}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="cursor-pointer">
                  {editingAssignmentId
                    ? "Guardar Alterações"
                    : "Guardar Tarefa"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Provas */}
      {isAdding && activeTab === "exams" && (
        <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
              {editingExamId ? "Editar Prova" : "Nova Prova"}
            </div>
            <form onSubmit={handleSaveExam} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Título da Prova *
                  </label>
                  <Input
                    value={newExam.title}
                    onChange={(e) =>
                      setNewExam({ ...newExam, title: e.target.value })
                    }
                    placeholder="ex., Prova 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Disciplina *
                  </label>
                  <select
                    value={newExam.subjectId}
                    onChange={(e) =>
                      setNewExam({ ...newExam, subjectId: e.target.value })
                    }
                    className="cursor-pointer flex h-10 w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                    required
                  >
                    <option value="" disabled>
                      Selecione uma disciplina
                    </option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Data *
                  </label>
                  <Input
                    className="cursor-pointer"
                    type="date"
                    value={newExam.date}
                    onChange={(e) =>
                      setNewExam({ ...newExam, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Prioridade
                  </label>
                  <select
                    value={newExam.priority}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        priority: e.target.value as Priority,
                      })
                    }
                    className="cursor-pointer flex h-10 w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={resetForms}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="cursor-pointer">
                  {editingExamId ? "Guardar Alterações" : "Guardar Prova"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Listas - Mensagens Vazias */}
      {activeTab === "assignments" &&
        sortedAssignments.length === 0 &&
        !isAdding && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 p-4 mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Nenhuma tarefa
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              Tudo em dia! Adicione uma tarefa para acompanhá-la aqui.
            </p>
          </div>
        )}

      {activeTab === "exams" && sortedExams.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 p-4 mb-4">
            <GraduationCap className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Nenhuma prova
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
            Nenhuma prova próxima. Adicione uma para começar a preparar-se.
          </p>
        </div>
      )}

      {/* Lista de Tarefas */}
      {activeTab === "assignments" && sortedAssignments.length > 0 && (
        <div className="space-y-3">
          {sortedAssignments.map((assignment) => {
            const subject = subjects.find((s) => s.id === assignment.subjectId);
            const isCompleted = assignment.status === "completed";
            const dateObj = parseLocal(assignment.dueDate);
            const isOverdue =
              isPast(dateObj) && !isToday(dateObj) && !isCompleted;

            return (
              <Card
                key={assignment.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  isCompleted
                    ? "opacity-60 bg-slate-50/50 dark:bg-slate-900/50"
                    : "bg-white dark:bg-slate-900",
                )}
              >
                <CardContent className="p-4 flex items-start sm:items-center gap-4">
                  <button
                    onClick={() =>
                      updateAssignment(assignment.id, {
                        status: isCompleted ? "pending" : "completed",
                      })
                    }
                    className="cursor-pointer mt-1 sm:mt-0 flex-shrink-0 text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 cursor-default">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <p
                        className={cn(
                          "font-semibold text-slate-900 dark:text-white truncate",
                          isCompleted &&
                            "line-through text-slate-500 dark:text-slate-400",
                        )}
                      >
                        {assignment.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs sm:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: subject?.color || "#cbd5e1",
                            }}
                          />
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {subject?.name || "Desconhecida"}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "flex items-center gap-1.5 font-medium",
                            isOverdue
                              ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md"
                              : "text-slate-500 dark:text-slate-400",
                          )}
                        >
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {format(dateObj, "d 'de' MMM, yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                    {assignment.notes && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 truncate">
                        {assignment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditAssignment(assignment)}
                      className="cursor-pointer text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAssignment(assignment.id)}
                      className="cursor-pointer text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lista de Provas */}
      {activeTab === "exams" && sortedExams.length > 0 && (
        <div className="space-y-3">
          {sortedExams.map((exam) => {
            const subject = subjects.find((s) => s.id === exam.subjectId);
            const dateObj = parseLocal(exam.date);
            const isPastExam = isPast(dateObj) && !isToday(dateObj);

            return (
              <Card
                key={exam.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  isPastExam
                    ? "opacity-60 bg-slate-50/50 dark:bg-slate-900/50"
                    : "bg-white dark:bg-slate-900",
                )}
              >
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0 cursor-default">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                        {exam.title}
                      </h3>
                      <Badge
                        variant={
                          exam.priority === "high"
                            ? "destructive"
                            : exam.priority === "medium"
                              ? "warning"
                              : "secondary"
                        }
                        className="text-[10px] uppercase tracking-wider font-bold"
                      >
                        {exam.priority === "low"
                          ? "Baixa"
                          : exam.priority === "medium"
                            ? "Média"
                            : "Alta"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: subject?.color || "#cbd5e1",
                          }}
                        />
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {subject?.name || "Desconhecida"}
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                        <CalendarIcon className="h-4 w-4" />
                        {format(dateObj, "EEEE, d 'de' MMM, yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    {exam.notes && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 bg-slate-50 dark:bg-slate-800/30 p-2 rounded-md">
                        {exam.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 mt-4 sm:mt-0 border-t dark:border-slate-800 sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <div className="flex flex-col gap-1.5 mr-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Status
                      </span>
                      <select
                        value={exam.studyStatus}
                        onChange={(e) =>
                          updateExam(exam.id, {
                            studyStatus: e.target.value as StudyStatus,
                          })
                        }
                        className={cn(
                          "cursor-pointer text-sm font-semibold rounded-lg border-0 py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 transition-colors outline-none",
                          exam.studyStatus === "ready"
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                            : exam.studyStatus === "studying"
                              ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                        )}
                      >
                        <option value="not_started">Não Iniciado</option>
                        <option value="studying">Estudando</option>
                        <option value="ready">Pronto</option>
                      </select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditExam(exam)}
                      className="cursor-pointer text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExam(exam.id)}
                      className="cursor-pointer text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
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
