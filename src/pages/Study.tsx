import React, { useState } from 'react';
import { useStore } from '@/src/store/useStore';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Plus, CheckSquare, Square, Trash2, Edit2, ListTodo } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { StudyTopic } from '@/src/types';

export function Study() {
  const { subjects, studyTopics, addStudyTopic, updateStudyTopic, deleteStudyTopic } = useStore();
  
  // Estados de UI
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Estado de Edição e Formulário
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState({ title: '', subjectId: '', completed: false, notes: '' });

  const resetForm = () => {
    setNewTopic({ title: '', subjectId: '', completed: false, notes: '' });
    setEditingTopicId(null);
    setIsAdding(false);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.title || !newTopic.subjectId) return;
    
    if (editingTopicId) {
      updateStudyTopic(editingTopicId, newTopic);
    } else {
      addStudyTopic(newTopic);
    }
    resetForm();
  };

  const handleEditTopic = (topic: StudyTopic) => {
    setNewTopic({
      title: topic.title,
      subjectId: topic.subjectId,
      completed: topic.completed,
      notes: topic.notes || ''
    });
    setEditingTopicId(topic.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTopics = studyTopics.filter(t => selectedSubject === 'all' || t.subjectId === selectedSubject);
  const sortedTopics = [...filteredTopics].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tópicos de Estudo</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organize o que precisa de rever.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex h-10 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
          >
            <option value="all">Todas as Disciplinas</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Button onClick={() => { resetForm(); setIsAdding(!isAdding); }} className="hidden sm:flex shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Novo Tópico
          </Button>
        </div>
      </div>

      <Button onClick={() => { resetForm(); setIsAdding(!isAdding); }} className="w-full sm:hidden shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Novo Tópico
      </Button>

      {isAdding && (
        <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
              {editingTopicId ? 'Editar Tópico' : 'Novo Tópico'}
            </div>
            <form onSubmit={handleSaveTopic} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Título do Tópico *</label>
                  <Input value={newTopic.title} onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })} placeholder="ex., Derivadas" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Disciplina *</label>
                  <select
                    value={newTopic.subjectId}
                    onChange={(e) => setNewTopic({ ...newTopic, subjectId: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                    required
                  >
                    <option value="" disabled>Selecione uma disciplina</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Anotações (Opcional)</label>
                  <Input value={newTopic.notes} onChange={(e) => setNewTopic({ ...newTopic, notes: e.target.value })} placeholder="Qualquer informação extra..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={resetForm}>Cancelar</Button>
                <Button type="submit">{editingTopicId ? 'Guardar Alterações' : 'Guardar Tópico'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {sortedTopics.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
            <ListTodo className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Nenhum tópico de estudo</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">Adicione tópicos para organizar as suas sessões de estudo e manter o foco.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTopics.map((topic) => {
            const subject = subjects.find(s => s.id === topic.subjectId);
            const isCompleted = topic.completed;

            return (
              <Card key={topic.id} className={cn("transition-all hover:shadow-md", isCompleted ? "opacity-60 bg-slate-50/50 dark:bg-slate-900/50" : "bg-white dark:bg-slate-900")}>
                <CardContent className="p-5 flex items-start gap-4">
                  <button
                    onClick={() => updateStudyTopic(topic.id, { completed: !isCompleted })}
                    className="mt-0.5 flex-shrink-0 text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    {isCompleted ? <CheckSquare className="h-6 w-6 text-emerald-500 dark:text-emerald-400" /> : <Square className="h-6 w-6" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold text-slate-900 dark:text-white leading-tight", isCompleted && "line-through text-slate-500 dark:text-slate-400")}>
                      {topic.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject?.color || '#cbd5e1' }} />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{subject?.name || 'Desconhecida'}</span>
                      </div>
                    </div>
                    {topic.notes && <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 bg-slate-50 dark:bg-slate-800/30 p-2 rounded-md truncate">{topic.notes}</p>}
                  </div>
                  <div className="flex items-center flex-col sm:flex-row gap-1 -mr-2 -mt-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditTopic(topic)} className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteStudyTopic(topic.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8">
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