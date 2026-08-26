import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/admin/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getSitesLive, type LiveSite } from '../../lib/api';
export function Sites() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sites, setSites] = useState<LiveSite[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const liveSites = await getSitesLive();
        if (!mounted) return;
        setSites(liveSites);
      } catch {
        if (!mounted) return;
        setSites([]);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Managed Sites</h2>
          <p className="text-sm text-slate-500">
            Configure physical boundaries and capacities.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-brand-800 transition-colors">
          
          <Plus size={16} /> Add Site
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Site Name</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Max Capacity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sites.map((site) =>
              <tr
                key={site.id}
                className="hover:bg-slate-50/50 transition-colors">
                
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {site.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{site.region}</td>
                  <td className="px-6 py-4 text-slate-600">{site.category}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {site.maxCapacity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${site.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    
                      {site.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Site">
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              placeholder="e.g. Lotus Tower" />
            
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Region
              </label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                <option>Western</option>
                <option>Central</option>
                <option>Southern</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. 5000" />
              
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="6.9271" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="79.8612" />
              
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
              
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 rounded-lg">
              Save Site
            </button>
          </div>
        </div>
      </Modal>
    </div>);

}
