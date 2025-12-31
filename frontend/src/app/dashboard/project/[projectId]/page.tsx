'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, X, Layout, Clock, CheckCircle, Trash2, ArrowRight, ArrowLeft, Edit3 } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

export default function ProjectTasksPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks/`);
      setTasks(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (projectId) fetchTasks(); }, [projectId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/tasks/`, {
        title, description: desc, status: 'todo', project_id: parseInt(projectId as string)
      });
      toast.success("Task added!");
      setIsCreateModalOpen(false);
      resetForm();
      fetchTasks();
    } catch (err) { toast.error("Failed to add"); }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    try {
      await api.patch(`/projects/${projectId}/tasks/${activeTask.id}`, { title, description: desc });
      toast.success("Task updated!");
      setIsEditModalOpen(false);
      resetForm();
      fetchTasks();
    } catch (err) { toast.error("Update failed"); }
  };

  const moveStatus = async (taskId: number, newStatus: string) => {
    try {
      await api.patch(`/projects/${projectId}/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) { toast.error("Move failed"); }
  };

  const openEditModal = (task: Task) => {
    setActiveTask(task);
    setTitle(task.title);
    setDesc(task.description);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setActiveTask(null);
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: 'todo', label: 'To Do', prev: null, next: 'in_progress', color: 'text-gray-600' },
          { id: 'in_progress', label: 'In Progress', prev: 'todo', next: 'done', color: 'text-amber-600' },
          { id: 'done', label: 'Completed', prev: 'in_progress', next: null, color: 'text-green-600' }
        ].map(col => (
          <div key={col.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 min-h-[600px]">
            <h2 className={`mb-6 font-bold text-sm uppercase tracking-widest ${col.color}`}>{col.label}</h2>
            <div className="space-y-4">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{task.title}</h4>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => openEditModal(task)} className="text-gray-400 hover:text-blue-500"><Edit3 size={16}/></button>
                      <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                  
                  <div className="flex gap-2">
                    {col.prev && (
                      <button onClick={() => moveStatus(task.id, col.prev!)} className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center transition">
                        <ArrowLeft size={14}/>
                      </button>
                    )}
                    {col.next && (
                      <button onClick={() => moveStatus(task.id, col.next!)} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition">
                        <ArrowRight size={14}/>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* REUSABLE MODAL (Works for Create and Edit) */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{isEditModalOpen ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={isEditModalOpen ? handleUpdateTask : handleCreateTask} className="space-y-5">
              <input placeholder="Task Title" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea placeholder="Description" rows={3} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={desc} onChange={(e) => setDesc(e.target.value)} />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); resetForm(); }} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
