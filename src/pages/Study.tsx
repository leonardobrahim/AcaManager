import React, { useState } from 'react';
import { useStore } from '@/src/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Plus, CheckSquare, Square, Trash2, ListTodo } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function Study() {
  const { subjects, studyTopics, addStudyTopic, updateStudyTopic, deleteStudyTopic } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', subjectId: '', completed: false, notes: '' });
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.title || !newTopic.subjectId) return;
    addStudyTopic(newTopic);
    setNewTopic({ title: '', subjectId: '', completed: false, notes: '' });
    setIsAdding(false);
  };

  const filteredTopics = studyTopics.filter(t => selectedSubject === 'all' || t.subjectId === selectedSubject);
  const sortedTopics = [...filteredTopics].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tópicos de Estudo</h1>
          <p className="text-slate-500 mt-1">Organize o que você precisa revisar.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex h-10 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="all">Todas as Disciplinas</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Button onClick={() => setIsAdding(!isAdding)} className="hidden sm:flex shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Tópico
          </Button>
        </div>
      </div>

      <Button onClick={() => setIsAdding(!isAdding)} className="w-full sm:hidden shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Tópico
      </Button>

      {isAdding && (
        <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleAddTopic} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Título do Tópico *</label>
                  <Input value={newTopic.title} onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })} placeholder="ex., Derivadas" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Disciplina *</label>
                  <select
                    value={newTopic.subjectId}
                    onChange={(e) => setNewTopic({ ...newTopic, subjectId: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    required
                  >
                    <option value="" disabled>Selecione uma disciplina</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Anotações (Opcional)</label>
                  <Input value={newTopic.notes} onChange={(e) => setNewTopic({ ...newTopic, notes: e.target.value })} placeholder="Qualquer informação extra..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
                <Button type="submit">Salvar Tópico</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {sortedTopics.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-blue-50 p-4 mb-4">
            <ListTodo className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Nenhum tópico de estudo</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Adicione tópicos para organizar suas sessões de estudo e manter o foco.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTopics.map((topic) => {
            const subject = subjects.find(s => s.id === topic.subjectId);
            const isCompleted = topic.completed;

            return (
              <Card key={topic.id} className={cn("transition-all hover:shadow-md", isCompleted ? "opacity-60 bg-slate-50/50" : "bg-white")}>
                <CardContent className="p-5 flex items-start gap-4">
                  <button
                    onClick={() => updateStudyTopic(topic.id, { completed: !isCompleted })}
                    className="mt-0.5 flex-shrink-0 text-slate-300 hover:text-emerald-500 transition-colors"
                  >
                    {isCompleted ? <CheckSquare className="h-6 w-6 text-emerald-500" /> : <Square className="h-6 w-6" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold text-slate-900 leading-tight", isCompleted && "line-through text-slate-500")}>
                      {topic.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject?.color || '#cbd5e1' }} />
                        <span className="text-xs font-medium text-slate-600 truncate">{subject?.name || 'Desconhecida'}</span>
                      </div>
                    </div>
                    {topic.notes && <p className="text-sm text-slate-500 mt-3 bg-slate-50 p-2 rounded-md truncate">{topic.notes}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteStudyTopic(topic.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0 h-8 w-8 -mr-2 -mt-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
