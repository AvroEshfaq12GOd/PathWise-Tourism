import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/admin/Modal';
import { Plus, Gem, Store } from 'lucide-react';
import { getIncentivesLive, type LiveIncentive } from '../../lib/api';
export function Incentives() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incentives, setIncentives] = useState<LiveIncentive[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const liveIncentives = await getIncentivesLive();
        if (!mounted) return;
        setIncentives(liveIncentives);
      } catch {
        if (!mounted) return;
        setIncentives([]);
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
          <h2 className="text-lg font-bold text-slate-900">
            Incentive Management
          </h2>
          <p className="text-sm text-slate-500">
            Manage rewards and "Hidden Gem" alternatives.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-brand-800 transition-colors">
          
          <Plus size={16} /> Create Incentive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {incentives.map((inc) =>
        <div
          key={inc.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative overflow-hidden">
          
            {inc.isHiddenGem &&
          <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1">
                <Gem size={12} /> Hidden Gem
              </div>
          }

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                <Store size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{inc.name}</h4>
                <p className="text-xs text-slate-500">{inc.partner}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Cost</p>
                <p className="font-bold text-slate-900">{inc.pointsCost} pts</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Redeemed</p>
                <p className="font-bold text-slate-900">
                  {inc.redemptions.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${inc.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              
                {inc.status === 'active' ? 'Active' : 'Paused'}
              </span>
              <button className="text-sm font-medium text-brand-700 hover:text-brand-800">
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Incentive">
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Incentive Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. 10% Off Cafe" />
            
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Partner Business
              </label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. Kandy Cafe" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Points Cost
              </label>
              <input
                type="number"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. 500" />
              
            </div>
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-brand-600 focus:ring-brand-500" />
              
              Flag as "Hidden Gem" (Prioritize in nudge engine)
            </label>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
              
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 rounded-lg">
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>);

}