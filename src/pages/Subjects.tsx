import React, { useState } from 'react';
import { useStore } from '@/src/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Plus, Trash2, Edit2, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ClassSchedule, Subject } from '@/src/types';

// Gera uma lista de horários de 30 em 30 min (ex: "08:00", "08:30", "09:00"...)
const TIME_OPTIONS = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7; // Começa às 07:00
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export function Subjects() {
  const { subjects, absences, addSubject, updateSubject, deleteSubject, addAbsence } = useStore();
  
  // Estados para controlar o formulário e a edição
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    professor: '', 
    maxAbsences: 10, 
    color: '#6366f1',
    schedules: [] as ClassSchedule[]
  });

  const resetForm = () => {
    setFormData({ name: '', professor: '', maxAbsences: 10, color: '#6366f1', schedules: [] });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    if (editingId) {
      updateSubject(editingId, { ...formData, maxAbsences: Number(formData.maxAbsences) });
    } else {
      addSubject({ ...formData, maxAbsences: Number(formData.maxAbsences) });
    }
    
    resetForm();
  };

  const handleEditClick = (subject: Subject) => {
    setFormData({
      name: subject.name,
      professor: subject.professor || '',
      maxAbsences: subject.maxAbsences,
      color: subject.color,
      schedules: subject.schedules || []
    });
    setEditingId(subject.id);
    setIsFormOpen(true);
    // Faz scroll suave para o topo onde está o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAbsence = (subjectId: string) => {
    addAbsence({ subjectId, date: new Date().toISOString() });
  };

  // Funções para gerir os horários dinamicamente no formulário
  const addScheduleRow = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: '' }]
    }));
  };

  const updateSchedule = (index: number, field: keyof ClassSchedule, value: string | number) => {
    const updated = [...formData.schedules];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, schedules: updated }));
  };

  const removeSchedule = (index: number) => {
    const updated = formData.schedules.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, schedules: updated }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Disciplinas</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie as suas matérias, horários e acompanhe as faltas.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsFormOpen(!isFormOpen); }} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nova Disciplina
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm">
          <CardHeader className="pb-4 border-b border-indigo-100 dark:border-indigo-900/30">
            <CardTitle className="text-lg text-indigo-900 dark:text-indigo-100">
              {editingId ? 'Editar Disciplina' : 'Adicionar Nova Disciplina'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSaveSubject} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nome da Disciplina *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex., Cálculo I"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Professor (Opcional)</label>
                  <Input
                    value={formData.professor}
                    onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                    placeholder="ex., Dr. Silva"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Máximo de Faltas</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.maxAbsences}
                    onChange={(e) => setFormData({ ...formData, maxAbsences: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cor na Agenda</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-9 w-16 p-1 cursor-pointer"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">{formData.color}</span>
                  </div>
                </div>
              </div>

              {/* Seção de Horários */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Horários das Aulas
                  </label>
                  <Button type="button" variant="secondary" size="sm" onClick={addScheduleRow}>
                    <Plus className="h-3 w-3 mr-1" /> Adicionar Horário
                  </Button>
                </div>
                
                {formData.schedules.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">Sem horários definidos para esta disciplina.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.schedules.map((schedule, index) => (
                      <div key={index} className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <select 
                          className="flex h-9 w-full sm:w-1/4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-50"
                          value={schedule.dayOfWeek}
                          onChange={(e) => updateSchedule(index, 'dayOfWeek', parseInt(e.target.value))}
                        >
                          <option value={1}>Segunda</option>
                          <option value={2}>Terça</option>
                          <option value={3}>Quarta</option>
                          <option value={4}>Quinta</option>
                          <option value={5}>Sexta</option>
                        </select>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <select 
                            className="flex h-9 w-full sm:w-24 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 text-sm text-slate-900 dark:text-slate-50"
                            value={schedule.startTime}
                            onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                          >
                            {TIME_OPTIONS.map(time => <option key={`start-${time}`} value={time}>{time}</option>)}
                          </select>
                          <span className="text-slate-400 text-sm">às</span>
                          <select 
                            className="flex h-9 w-full sm:w-24 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 text-sm text-slate-900 dark:text-slate-50"
                            value={schedule.endTime}
                            onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                          >
                            {TIME_OPTIONS.map(time => <option key={`end-${time}`} value={time}>{time}</option>)}
                          </select>
                        </div>

                        <Input 
                          placeholder="Sala (opcional)" 
                          className="w-full sm:w-1/4 h-9" 
                          value={schedule.room || ''} 
                          onChange={(e) => updateSchedule(index, 'room', e.target.value)}
                        />
                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0 ml-auto" onClick={() => removeSchedule(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={resetForm}>Cancelar</Button>
                <Button type="submit">{editingId ? 'Guardar Alterações' : 'Criar Disciplina'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Listagem de Disciplinas */}
      {subjects.length === 0 && !isFormOpen ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 mb-4">
            <BookOpen className="h-6 w-6 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Nenhuma disciplina ainda</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Adicione a sua primeira disciplina para começar a acompanhar faltas e horários.</p>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4" variant="outline">
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
                    <div className="mt-1.5 h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{subject.name}</CardTitle>
                      {subject.professor && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{subject.professor}</p>}
                    </div>
                  </div>
                  <div className="flex -mr-2 -mt-2">
                    {/* Botão de Editar Adicionado Aqui */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" onClick={() => handleEditClick(subject)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteSubject(subject.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end pt-4">
                  <div className="space-y-4">
                    {subject.schedules && subject.schedules.length > 0 && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md">
                        <span className="font-semibold flex items-center gap-1 mb-1"><Clock className="h-3 w-3"/> Aulas na semana: {subject.schedules.length}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-500 dark:text-slate-400">Faltas</span>
                      <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{absenceCount} / {subject.maxAbsences}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-500 rounded-full", statusColor)} 
                        style={{ width: `${Math.min(percentage, 100)}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                      {percentage >= 80 ? (
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Perigo
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
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