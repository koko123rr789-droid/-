import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { DailyTask } from '../types';
import { playSound } from '../utils/audioSynth';

interface Props {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, priority: 'high' | 'medium' | 'low') => void;
  onDeleteTask: (taskId: string) => void;
}

export const DailyTasks: React.FC<Props> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');

  const completedCount = tasks.filter((t) => t.completed).length;
  const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), priority);
    setNewTitle('');
    playSound('click');
  };

  return (
    <div id="daily-tasks-card" className="rounded-3xl border border-amber-500/20 bg-neutral-900/70 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-white text-base sm:text-lg font-heading">
            قائمة أهداف ومراجعات اليوم
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">
            تم إنجاز: <b className="text-amber-400 font-mono">{completedCount}</b> من <b className="text-white font-mono">{tasks.length}</b>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            {percent}%
          </span>
        </div>
      </div>

      {/* Task Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="أضف مهمة (مثال: حل امتحان فيزياء 2023، مراجعة فصل الكيمياء العضوية...)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
          className="px-2.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-300 focus:outline-none"
        >
          <option value="high">أهمية قصوى 🔥</option>
          <option value="medium">متوسطة ⚡</option>
          <option value="low">عادية 📌</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">إضافة</span>
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-xs text-neutral-500">
            لا توجد مهام مسجلة اليوم. أضف أهدافك اليومية لتنظيم جدول المذاكرة.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-neutral-950/40 border-neutral-800 text-neutral-500 line-through'
                  : 'bg-neutral-950/80 border-neutral-800 text-neutral-200 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => {
                    playSound(task.completed ? 'click' : 'success');
                    onToggleTask(task.id);
                  }}
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-400 text-neutral-950'
                      : 'border-neutral-600 hover:border-amber-400'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <span className="text-xs font-medium truncate">
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  task.priority === 'high'
                    ? 'bg-red-950/50 text-red-400 border border-red-500/30'
                    : task.priority === 'medium'
                    ? 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'عادية'}
                </span>

                <button
                  onClick={() => {
                    playSound('click');
                    onDeleteTask(task.id);
                  }}
                  className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
