import { useStore } from '@/src/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { format, isAfter, isBefore, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

export function Dashboard() {
  const { subjects, absences, assignments, exams, studyTopics } = useStore();
  const today = startOfDay(new Date());
  const nextWeek = addDays(today, 7);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Upcoming Exams (next 7 days)
  const upcomingExams = exams
    .filter((e) => {
      const examDate = new Date(e.date);
      return isAfter(examDate, today) && isBefore(examDate, nextWeek);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Pending Assignments
  const pendingAssignments = assignments
    .filter((a) => a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Absence Alerts (>= 80% of max absences)
  const absenceAlerts = subjects.map((subject) => {
    const subjectAbsences = absences.filter((a) => a.subjectId === subject.id).length;
    const percentage = subject.maxAbsences > 0 ? (subjectAbsences / subject.maxAbsences) * 100 : 0;
    return { ...subject, currentAbsences: subjectAbsences, percentage };
  }).filter((s) => s.percentage >= 80);

  // Today's Study Topics
  const pendingStudyTopics = studyTopics.filter((t) => !t.completed).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{getGreeting()}!</h1>
          <p className="text-slate-500 mt-1">Aqui está o seu resumo acadêmico para hoje.</p>
        </div>
        <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full w-fit capitalize border border-indigo-100/50">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {absenceAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Atenção às Faltas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {absenceAlerts.map((alert) => (
              <Card key={alert.id} className="border-red-100 bg-red-50/50 shadow-none">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-red-900">{alert.name}</p>
                    <p className="text-sm text-red-700/80 mt-0.5">
                      {alert.currentAbsences} / {alert.maxAbsences} faltas
                    </p>
                  </div>
                  <Badge variant="destructive" className="bg-red-500">{Math.round(alert.percentage)}%</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Exams Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="h-4 w-4 text-indigo-600" />
              </div>
              Próximas Provas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            {upcomingExams.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <div className="rounded-full bg-indigo-50 p-3 mb-3">
                  <Calendar className="h-6 w-6 text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-slate-900">Sem provas próximas</p>
                <p className="text-xs text-slate-500 mt-1">Nenhuma prova nos próximos 7 dias.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {upcomingExams.map((exam) => {
                  const subject = subjects.find(s => s.id === exam.subjectId);
                  return (
                    <li key={exam.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: subject?.color || '#cbd5e1' }} />
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{exam.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{subject?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">{format(new Date(exam.date), "d 'de' MMM", { locale: ptBR })}</p>
                        <Badge variant={exam.priority === 'high' ? 'destructive' : exam.priority === 'medium' ? 'warning' : 'secondary'} className="mt-1 text-[10px] uppercase font-bold tracking-wider">
                          {exam.priority === 'low' ? 'Baixa' : exam.priority === 'medium' ? 'Média' : 'Alta'}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Assignments Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            {pendingAssignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <div className="rounded-full bg-emerald-50 p-3 mb-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-slate-900">Tudo em dia!</p>
                <p className="text-xs text-slate-500 mt-1">Nenhuma tarefa pendente.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {pendingAssignments.map((assignment) => {
                  const subject = subjects.find(s => s.id === assignment.subjectId);
                  return (
                    <li key={assignment.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: subject?.color || '#cbd5e1' }} />
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{assignment.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{subject?.name}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md">{format(new Date(assignment.dueDate), "d 'de' MMM", { locale: ptBR })}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Study Topics Card */}
        <Card className="flex flex-col lg:col-span-1 md:col-span-2">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              Tópicos para Revisar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            {pendingStudyTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <div className="rounded-full bg-blue-50 p-3 mb-3">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-sm font-medium text-slate-900">Nenhum tópico</p>
                <p className="text-xs text-slate-500 mt-1">Você não tem tópicos pendentes.</p>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {pendingStudyTopics.map((topic) => {
                  const subject = subjects.find(s => s.id === topic.subjectId);
                  return (
                    <li key={topic.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="mt-0.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: subject?.color || '#cbd5e1' }} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{topic.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{subject?.name}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
