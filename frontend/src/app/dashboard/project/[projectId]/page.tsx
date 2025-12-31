'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, X, Trash2, Pencil } from 'lucide-react';
import { 
  DndContext, 
  DragEndEvent, 
  useDraggable, 
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import api from '@/lib/api';

// ... (Interfaces match previous)
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

export default function ProjectBoard() {
  const params = useParams();
  const projectId = params.projectId;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => { if (projectId) fetchTasks(); }, [projectId]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks/`);
      setTasks(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/projects/${projectId}/tasks/`, { title, description: desc, status: 'todo' });
      setTasks([...tasks, res.data]);
      setShowCreateModal(false); resetForm();
    } catch (err) { alert("Failed"); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const res = await api.put(`/projects/${projectId}/tasks/${editingTask.id}`, { title, description: desc });
      setTasks(tasks.map(t => t.id === editingTask.id ? res.data : t));
      setEditingTask(null); resetForm();
    } catch (err) { alert("Failed"); }
  };

  const handleDelete = async () => {
    if (!editingTask || !confirm("Delete?")) return;
    try {
      await api.delete(`/projects/${projectId}/tasks/${editingTask.id}`);
      setTasks(tasks.filter(t => t.id !== editingTask.id));
      setEditingTask(null);
    } catch (err) { alert("Failed"); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as number;
    const newStatus = over.id as Task['status'];
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try { await api.put(`/projects/${projectId}/tasks/${taskId}`, { status: newStatus }); } catch (err) { fetchTasks(); }
  };

  const resetForm = () => { setTitle(''); setDesc(''); };
  const openEditModal = (task: Task) => { setEditingTask(task); setTitle(task.title); setDesc(task.description); };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    // FIX: h-full takes exactly the space allowed by body
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">Project Board</h1>
        <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus size={18} /> New Task
        </button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto h-full pb-2">
          <KanbanColumn id="todo" title="To Do" tasks={tasks.filter(t => t.status === 'todo')} color="gray" onTaskClick={openEditModal} />
          <KanbanColumn id="in_progress" title="In Progress" tasks={tasks.filter(t => t.status === 'in_progress')} color="blue" onTaskClick={openEditModal} />
          <KanbanColumn id="done" title="Done" tasks={tasks.filter(t => t.status === 'done')} color="green" onTaskClick={openEditModal} />
        </div>
      </DndContext>

      {/* Modals omitted for brevity, logic remains same as before */}
      {showCreateModal && (
        <Modal title="New Task" onClose={() => setShowCreateModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <input autoFocus placeholder="Title" required className="w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Description" className="w-full border p-2 rounded" value={desc} onChange={e => setDesc(e.target.value)} />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
            </div>
          </form>
        </Modal>
      )}

      {editingTask && (
        <Modal title="Edit Task" onClose={() => setEditingTask(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input placeholder="Title" required className="w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Description" className="w-full border p-2 rounded h-32" value={desc} onChange={e => setDesc(e.target.value)} />
            <div className="flex justify-between items-center mt-6">
              <button type="button" onClick={handleDelete} className="text-red-500 flex items-center gap-1 hover:bg-red-50 px-3 py-2 rounded transition"><Trash2 size={16} /> Delete</button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingTask(null)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Subcomponents
function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function KanbanColumn({ id, title, tasks, color, onTaskClick }: any) {
  const { setNodeRef } = useDroppable({ id });
  const colorMap: any = { gray: 'bg-gray-100', blue: 'bg-blue-50', green: 'bg-green-50' };
  return (
    <div ref={setNodeRef} className={`p-4 rounded-xl flex flex-col ${colorMap[color]} bg-opacity-50 h-full max-h-full`}>
      <h3 className="font-semibold mb-4 flex justify-between text-gray-700 shrink-0">
        {title} <span className="bg-white/50 px-2 rounded-full text-sm">{tasks.length}</span>
      </h3>
      <div className="space-y-3 flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
        {tasks.map((task: Task) => (
          <DraggableTask key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
    </div>
  );
}

function DraggableTask({ task, onClick }: { task: Task, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={onClick} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition z-10 group relative select-none">
      <div className="flex justify-between items-start mb-2 pointer-events-none">
        <h4 className="font-medium text-gray-800">{task.title}</h4>
        <Pencil size={14} className="opacity-0 group-hover:opacity-100 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 pointer-events-none">{task.description}</p>
    </div>
  );
}
