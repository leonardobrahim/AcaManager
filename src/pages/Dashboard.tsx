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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Painel</h1>
        <p className="text-sm text-slate-500 capitalize">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
      </div>

      {absenceAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Alertas de Faltas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {absenceAlerts.map((alert) => (
              <Card key={alert.id} className="border-red-200 bg-red-50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">{alert.name}</p>
                    <p className="text-sm text-red-700">
                      {alert.currentAbsences} / {alert.maxAbsences} faltas
                    </p>
                  </div>
                  <Badge variant="destructive">{Math.round(alert.percentage)}%</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Próximas Provas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Nenhuma prova nos próximos 7 dias.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingExams.map((exam) => {
                  const subject = subjects.find((s) => s.id === exam.subjectId);
                  return (
                    <li key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div>
                        <p className="font-medium text-sm">{exam.title}</p>
                        <p className="text-xs text-slate-500">{subject?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(exam.date), "d 'de' MMM", { locale: ptBR })}</p>
                        <Badge variant={exam.priority === 'high' ? 'destructive' : exam.priority === 'medium' ? 'warning' : 'secondary'} className="mt-1 text-[10px]">
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingAssignments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Tudo em dia!</p>
            ) : (
              <ul className="space-y-3">
                {pendingAssignments.map((assignment) => {
                  const subject = subjects.find((s) => s.id === assignment.subjectId);
                  return (
                    <li key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div>
                        <p className="font-medium text-sm">{assignment.title}</p>
                        <p className="text-xs text-slate-500">{subject?.name}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">{format(new Date(assignment.dueDate), "d 'de' MMM", { locale: ptBR })}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Tópicos para Revisar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingStudyTopics.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Nenhum tópico pendente.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pendingStudyTopics.map((topic) => {
                  const subject = subjects.find((s) => s.id === topic.subjectId);
                  return (
                    <li key={topic.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="mt-0.5 h-4 w-4 rounded border border-slate-300 bg-white" />
                      <div>
                        <p className="font-medium text-sm leading-tight">{topic.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{subject?.name}</p>
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
