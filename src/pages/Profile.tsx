import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import {
  Wallet,
  Award,
  Settings,
  ChevronRight,
  Coffee,
  Ticket,
  Car,
  LogOut,
  CheckCircle2,
  X,
  QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RewardItem {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  icon: typeof Coffee;
  iconBg: string;
  iconColor: string;
}

export function Profile() {
  const { signOut } = useAuth();
  const [balance, setBalance] = useState(1250);
  const [redeemedReward, setRedeemedReward] = useState<{ item: RewardItem; code: string } | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [settings, setSettings] = useState({
    routeAlerts: true,
    offPeakBonuses: true,
    hapticFeedback: true
  });
  const [interests, setInterests] = useState<string[]>([
    'Historical Sites',
    'Botanical Gardens',
    'Cultural Festivals',
    'Local Dining'
  ]);

  const rewards: RewardItem[] = [
    {
      id: 'coffee',
      title: 'Free Coffee',
      subtitle: 'At partner cafes',
      points: 500,
      icon: Coffee,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      id: 'museum',
      title: 'Museum Pass',
      subtitle: 'Skip the line entry',
      points: 1200,
      icon: Ticket,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'tuktuk',
      title: 'Tuk-Tuk Credit',
      subtitle: 'LKR 500 discount on eco rides',
      points: 800,
      icon: Car,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    }
  ];

  const handleRedeem = (item: RewardItem) => {
    if (balance >= item.points) {
      setBalance((prev) => prev - item.points);
      const code = `PW-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setRedeemedReward({ item, code });
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto pb-6 relative"
    >
      <AppHeader title="Profile & Wallet" />

      <div className="px-5 mt-2 space-y-6">
        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-[#0c534f] to-[#073835] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Wallet size={84} />
          </div>
          <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            PathPoints Balance
          </p>
          <div className="flex items-end gap-2 mb-5">
            <h2 className="text-4xl font-display font-bold">{balance.toLocaleString()}</h2>
            <span className="text-emerald-200 text-sm mb-1 font-medium">pts</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex justify-between items-center border border-white/20">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-300" />
              <span className="text-sm font-semibold text-white">Explorer Tier</span>
            </div>
            <span className="text-xs text-emerald-200 font-medium">
              {Math.max(0, 1500 - balance)} to next tier
            </span>
          </div>
        </div>

        {/* Rewards Section */}
        <div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-3">
            Redeem Rewards
          </h3>
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-between transition-all hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${reward.iconBg} flex items-center justify-center ${reward.iconColor}`}
                  >
                    <reward.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{reward.title}</p>
                    <p className="text-xs text-slate-500">{reward.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={balance < reward.points}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-transform active:scale-95 ${
                    balance >= reward.points
                      ? 'text-[#0D6E6E] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                      : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                  }`}
                >
                  {reward.points} pts
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-3">
            Preferences
          </h3>
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden divide-y divide-slate-100">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Nudge Settings
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
            <button
              onClick={() => setShowInterestsModal(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Travel Interests
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full mt-6 bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors active:scale-98"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Reward Voucher Modal */}
      <AnimatePresence>
        {redeemedReward && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-center"
            >
              <button
                onClick={() => setRedeemedReward(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Reward Redeemed!
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Present this voucher at any participating merchant:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 flex flex-col items-center">
                <QrCode size={96} className="text-slate-800 mb-2" />
                <p className="font-mono text-base font-bold text-[#0D6E6E] tracking-wider">
                  {redeemedReward.code}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">{redeemedReward.item.title}</p>
              </div>
              <button
                onClick={() => setRedeemedReward(null)}
                className="w-full bg-[#0D6E6E] text-white font-bold py-3 rounded-xl text-sm"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Nudge Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900">Nudge Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4 text-xs">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-800">Route Alerts</p>
                    <p className="text-slate-500">Live congestion notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.routeAlerts}
                    onChange={(e) => setSettings({ ...settings, routeAlerts: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-800">Off-Peak Bonuses</p>
                    <p className="text-slate-500">Bonus points for flexible hours</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.offPeakBonuses}
                    onChange={(e) => setSettings({ ...settings, offPeakBonuses: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-800">Haptic Feedback</p>
                    <p className="text-slate-500">Vibrate on route suggestions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.hapticFeedback}
                    onChange={(e) => setSettings({ ...settings, hapticFeedback: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                </label>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full mt-5 bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Save Preferences
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Travel Interests Modal */}
      <AnimatePresence>
        {showInterestsModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900">Travel Interests</h3>
                <button
                  onClick={() => setShowInterestsModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  'Historical Sites',
                  'Botanical Gardens',
                  'Cultural Festivals',
                  'Local Dining',
                  'Scenic Viewpoints',
                  'Wildlife & Safari',
                  'Tea Plantations',
                  'Architecture'
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                      interests.includes(item)
                        ? 'bg-[#0D6E6E] text-white border-[#0D6E6E]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowInterestsModal(false)}
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}