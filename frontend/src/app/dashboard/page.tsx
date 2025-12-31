'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Briefcase, LogOut } from 'lucide-react';
import api from '@/lib/api';

interface Organization {
  id: number;
  name: string;
  description: string;
}

export default function DashboardHome() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await api.get('/organizations/');
        setOrgs(res.data);
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/organizations/', { name: orgName, description: orgDesc });
      setOrgs([...orgs, res.data]);
      setShowCreateModal(false);
      setOrgName(''); setOrgDesc('');
    } catch (err) { alert('Failed to create'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    // FIX: h-full + overflow-hidden prevents window scroll
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      
      {/* NAVBAR (Fixed height) */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0 z-10">
        <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <Briefcase /> SaaS Manager
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* MAIN CONTENT (Scrollable Area) */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Organizations</h1>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              <Plus size={20} /> New Organization
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {orgs.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">You haven't created any organizations yet.</p>
                <button onClick={() => setShowCreateModal(true)} className="text-blue-600 font-medium hover:underline">
                  Create your first one now
                </button>
              </div>
            ) : (
              orgs.map((org) => (
                <Link key={org.id} href={`/dashboard/org/${org.id}`}>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition cursor-pointer h-full flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                          <Briefcase size={24} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{org.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{org.description}</p>
                    </div>
                    <div className="mt-6 text-blue-600 text-sm font-medium flex items-center gap-1">
                      Manage Projects →
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4">Create New Organization</h2>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <input autoFocus className="w-full border p-2 rounded" placeholder="e.g. Acme Corp" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
              <textarea className="w-full border p-2 rounded" placeholder="What does it do?" value={orgDesc} onChange={(e) => setOrgDesc(e.target.value)} />
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
