import React, { useState } from 'react';
import { useStore } from '@/src/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Plus, MoreVertical, Trash2, Edit2, AlertTriangle, BookOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function Subjects() {
  const { subjects, absences, addSubject, deleteSubject, addAbsence, deleteAbsence } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', professor: '', maxAbsences: 10, color: '#6366f1' });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name.trim()) return;
    addSubject({ ...newSubject, maxAbsences: Number(newSubject.maxAbsences) });
    setNewSubject({ name: '', professor: '', maxAbsences: 10, color: '#6366f1' });
    setIsAdding(false);
  };

  const handleAddAbsence = (subjectId: string) => {
    addAbsence({ subjectId, date: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Disciplinas</h1>
          <p className="text-slate-500 mt-1">Gerencie suas matérias e acompanhe suas faltas.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Disciplina
        </Button>
      </div>

      {isAdding && (
        <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nome da Disciplina *</label>
                  <Input
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="ex., Cálculo I"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Professor (Opcional)</label>
                  <Input
                    value={newSubject.professor}
                    onChange={(e) => setNewSubject({ ...newSubject, professor: e.target.value })}
                    placeholder="ex., Dr. Silva"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Máximo de Faltas</label>
                  <Input
                    type="number"
                    min="0"
                    value={newSubject.maxAbsences}
                    onChange={(e) => setNewSubject({ ...newSubject, maxAbsences: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Cor</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={newSubject.color}
                      onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
                      className="h-9 w-16 p-1 cursor-pointer"
                    />
                    <span className="text-sm text-slate-500">{newSubject.color}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
                <Button type="submit">Salvar Disciplina</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {subjects.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-100 p-3 mb-4">
            <BookOpen className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Nenhuma disciplina ainda</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">Adicione sua primeira disciplina para começar a acompanhar faltas e tarefas.</p>
          <Button onClick={() => setIsAdding(true)} className="mt-4" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Disciplina
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const subjectAbsences = absences.filter((a) => a.subjectId === subject.id);
            const absenceCount = subjectAbsences.length;
            const percentage = subject.maxAbsences > 0 ? (absenceCount / subject.maxAbsences) * 100 : 0;
            
            let statusColor = 'bg-emerald-500';
            if (percentage >= 80) statusColor = 'bg-red-500';
            else if (percentage >= 50) statusColor = 'bg-amber-500';

            return (
              <Card key={subject.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0 relative">
                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">{subject.name}</CardTitle>
                      {subject.professor && <p className="text-sm font-medium text-slate-500 mt-0.5">{subject.professor}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteSubject(subject.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-500">Faltas</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{absenceCount} / {subject.maxAbsences}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-500 rounded-full", statusColor)} 
                        style={{ width: `${Math.min(percentage, 100)}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      {percentage >= 80 ? (
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Perigo
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500">
                          {subject.maxAbsences - absenceCount} restantes
                        </span>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => handleAddAbsence(subject.id)} className="h-8 text-xs">
                        <Plus className="mr-1 h-3 w-3" /> Adicionar Falta
                      </Button>
                    </div>
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
