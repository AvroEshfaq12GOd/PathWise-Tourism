import { useEffect, useState } from 'react';
import { Modal } from '../../components/admin/Modal';
import { Plus, Gem, Store, CheckCircle2, Trash2 } from 'lucide-react';
import { getIncentivesLive, type LiveIncentive } from '../../lib/api';

export function Incentives() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncentive, setEditingIncentive] = useState<LiveIncentive | null>(null);
  const [incentives, setIncentives] = useState<LiveIncentive[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [partner, setPartner] = useState('');
  const [pointsCost, setPointsCost] = useState('500');
  const [isHiddenGem, setIsHiddenGem] = useState(false);

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

  const openCreateModal = () => {
    setEditingIncentive(null);
    setName('');
    setPartner('');
    setPointsCost('500');
    setIsHiddenGem(false);
    setIsModalOpen(true);
  };

  const openEditModal = (inc: LiveIncentive) => {
    setEditingIncentive(inc);
    setName(inc.name);
    setPartner(inc.partner);
    setPointsCost(inc.pointsCost.toString());
    setIsHiddenGem(inc.isHiddenGem);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setIncentives((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? { ...inc, status: inc.status === 'active' ? 'paused' : 'active' }
          : inc
      )
    );
  };

  const handleDelete = (id: string, incName: string) => {
    if (confirm(`Are you sure you want to delete incentive "${incName}"?`)) {
      setIncentives((prev) => prev.filter((i) => i.id !== id));
      setToastMsg(`Incentive "${incName}" deleted.`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !partner.trim()) return;

    if (editingIncentive) {
      setIncentives((prev) =>
        prev.map((inc) =>
          inc.id === editingIncentive.id
            ? {
                ...inc,
                name,
                partner,
                pointsCost: parseInt(pointsCost, 10) || 500,
                isHiddenGem
              }
            : inc
        )
      );
      setToastMsg(`Incentive "${name}" updated successfully.`);
    } else {
      const newInc: LiveIncentive = {
        id: `inc-${Date.now()}`,
        name,
        partner,
        pointsCost: parseInt(pointsCost, 10) || 500,
        redemptions: 0,
        status: 'active',
        isHiddenGem,
        expiry: 'Dec 31, 2026'
      };
      setIncentives((prev) => [newInc, ...prev]);
      setToastMsg(`Incentive "${name}" created.`);
    }

    setTimeout(() => setToastMsg(null), 3000);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Incentive Management
          </h2>
          <p className="text-sm text-slate-500">
            Manage rewards and "Hidden Gem" alternatives for crowd dispersal.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-brand-800 transition-colors shadow-sm"
        >
          <Plus size={16} /> Create Incentive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {incentives.map((inc) => (
          <div
            key={inc.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative overflow-hidden flex flex-col justify-between transition-all hover:border-slate-300"
          >
            {inc.isHiddenGem && (
              <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1">
                <Gem size={12} /> Hidden Gem
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
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
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleToggleStatus(inc.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  inc.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {inc.status === 'active' ? 'Active' : 'Paused'}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(inc)}
                  className="text-sm font-medium text-brand-700 hover:text-brand-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(inc.id, inc.name)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Delete incentive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIncentive ? 'Edit Incentive' : 'Create Incentive'}
      >
        <div className="space-y-4 font-sans">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Incentive Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. 10% Off Cafe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Partner Business
              </label>
              <input
                type="text"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. Kandy Cafe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Points Cost
              </label>
              <input
                type="number"
                value={pointsCost}
                onChange={(e) => setPointsCost(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. 500"
              />
            </div>
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isHiddenGem}
                onChange={(e) => setIsHiddenGem(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Flag as "Hidden Gem" (Prioritize in nudge engine)</span>
            </label>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 rounded-lg shadow-sm"
            >
              {editingIncentive ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}