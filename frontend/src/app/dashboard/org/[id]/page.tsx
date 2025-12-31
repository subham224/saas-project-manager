'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';                 // CORRECT: Navigation Link
import { Plus, Folder } from 'lucide-react';  // CORRECT: Icons
import api from '@/lib/api';

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function OrganizationPage() {
  const params = useParams();
  const orgId = params.id;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // 1. Fetch Projects
  useEffect(() => {
    if (!orgId) return;

    const fetchProjects = async () => {
      try {
        const res = await api.get(`/organizations/${orgId}/projects/`);
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [orgId]);

  // 2. Create Project
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/organizations/${orgId}/projects/`, {
        name: newName,
        description: newDesc
      });
      setProjects([...projects, res.data]);
      setShowForm(false);
      setNewName('');
      setNewDesc('');
    } catch (err) {
      alert("Failed to create project");
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Create New Project</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Project Name</label>
              <input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                placeholder="e.g., Q1 Marketing"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Description</label>
              <input 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                placeholder="Brief details..."
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* PROJECT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded">
                  <Folder size={20} />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
              </div>
              <p className="text-gray-500 text-sm">{project.description}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <Link 
                href={`/dashboard/project/${project.id}`}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Open Board →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
