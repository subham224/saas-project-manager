'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Folder, X } from 'lucide-react';
import Link from 'next/link'; // <--- ADD THIS LINE


export default function OrganizationPage() {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get(`/projects/?organization_id=${id}`);
      setProjects(res.data);
    } catch (err) {
      toast.error("Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProjects();
  }, [id]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects/', {
        name: newName,
        description: newDesc,
        organization_id: parseInt(id as string)
      });
      toast.success("Project created!");
      setIsModalOpen(false);
      setNewName('');
      setNewDesc('');
      fetchProjects(); // Refresh the list
    } catch (err) {
      toast.error("Failed to create project");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* PROJECT GRID */}
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
          <Folder className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No projects yet. Create your first one!</p>
        </div>
      ) : (
        // <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        //   {projects.map((p: any) => (
        //     <div key={p.id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        //       <h3 className="font-bold text-lg mb-2">{p.name}</h3>
        //       <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
        //     </div>
        //   ))}
        // </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {projects.map((p: any) => (
    <Link href={`/dashboard/project/${p.id}`} key={p.id}>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition cursor-pointer group">
        <div className="flex items-center gap-3 mb-2">
          <Folder className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
          <h3 className="font-bold text-lg text-gray-800">{p.name}</h3>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
        <div className="mt-4 text-xs font-semibold text-blue-600 flex items-center gap-1">
          View Tasks →
        </div>
      </div>
    </Link>
  ))}
</div>

      )}

      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Project</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input 
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={newName} onChange={(e) => setNewName(e.target.value)} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
