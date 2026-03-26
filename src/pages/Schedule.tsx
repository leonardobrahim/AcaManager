import React, { useState } from 'react';
import { useStore } from '@/src/store/useStore';
import { Card, CardContent } from '@/src/components/ui/Card';
import { CalendarIcon, Clock } from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 1, name: 'Segunda' },
  { id: 2, name: 'Terça' },
  { id: 3, name: 'Quarta' },
  { id: 4, name: 'Quinta' },
  { id: 5, name: 'Sexta' },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

export function Schedule() {
  const { subjects } = useStore();
  const [activeTab, setActiveTab] = useState<'weekly' | 'calendar'>('weekly');

  // Função para verificar se existe uma aula para um dia e hora específicos
  const getSubjectForSlot = (dayId: number, timeString: string) => {
    for (const subject of subjects) {
      if (!subject.schedules) continue;
      
      for (const schedule of subject.schedules) {
        if (schedule.dayOfWeek === dayId) {
          // Compara as horas (ex: "09:00" está entre "08:00" e "10:00")
          if (timeString >= schedule.startTime && timeString < schedule.endTime) {
            return { subject, schedule };
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Agenda e Horários</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">A sua rotina semanal e calendário mensal.</p>
        </div>
        <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'weekly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            Semanal
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            Calendário
          </button>
        </div>
      </div>

      {activeTab === 'weekly' && (
        <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-x-auto">
          <CardContent className="p-0 min-w-[800px]">
            <div className="grid grid-cols-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="p-4 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400">
                <Clock className="h-5 w-5" />
              </div>
              {DAYS_OF_WEEK.map(day => (
                <div key={day.id} className="p-4 text-center font-semibold text-sm text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800 last:border-0">
                  {day.name}
                </div>
              ))}
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {TIME_SLOTS.map((time) => (
                <div key={time} className="grid grid-cols-6">
                  <div className="p-3 text-xs font-medium text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    {time}
                  </div>
                  {DAYS_OF_WEEK.map(day => {
                    const slotData = getSubjectForSlot(day.id, time);
                    
                    return (
                      <div key={`${day.id}-${time}`} className="p-1 min-h-[60px] border-r border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        {slotData && (
                          <div 
                            className="h-full w-full rounded-md p-2 text-white shadow-sm flex flex-col justify-center overflow-hidden"
                            style={{ backgroundColor: slotData.subject.color }}
                          >
                            <span className="text-xs font-bold truncate block">{slotData.subject.name}</span>
                            {slotData.schedule.room && (
                              <span className="text-[10px] font-medium opacity-90 truncate block mt-0.5">
                                Sala: {slotData.schedule.room}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'calendar' && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 p-4 mb-4">
            <CalendarIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Calendário Mensal</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">A visão de calendário em formato Google Calendar está a ser construída e estará disponível em breve!</p>
        </div>
      )}
    </div>
  );
}