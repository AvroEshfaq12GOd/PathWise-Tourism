import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Gauge,
  BellRing,
  Sparkles,
  BrainCircuit,
  Map,
  ShieldCheck,
  Gift,
  Activity,
  ChevronDown } from 'lucide-react';
import { getAdminOverviewData } from '../lib/api';
export function Landing() {
  const [successfulNudges, setSuccessfulNudges] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getAdminOverviewData();
        if (!mounted) return;
        setSuccessfulNudges(data.metrics.successfulNudges);
      } catch {
        if (!mounted) return;
        setSuccessfulNudges(0);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const features = [
  {
    icon: Map,
    title: 'Real-time Heatmaps',
    desc: 'Live visualization of tourist density across major landmarks.'
  },
  {
    icon: BrainCircuit,
    title: 'LSTM Forecasting',
    desc: 'Neural network predictions up to 4 hours ahead with 93.8% accuracy.'
  },
  {
    icon: BellRing,
    title: 'Behavioral Nudges',
    desc: 'Smart, personalized alternative route suggestions to disperse crowds.'
  },
  {
    icon: Gift,
    title: 'Reward Incentives',
    desc: 'Gamified PathPoints system encouraging off-peak and alternative visits.'
  },
  {
    icon: ShieldCheck,
    title: 'Admin Oversight',
    desc: 'Comprehensive control center for site managers and tourism boards.'
  },
  {
    icon: Activity,
    title: 'Privacy-First',
    desc: 'Aggregated, anonymized data processing ensuring tourist privacy.'
  }];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Top Nav */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-display font-bold text-brand-800">
            PathWise
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#how-it-works"
              className="hover:text-brand-700 transition-colors">
              
              How it Works
            </a>
            <a
              href="#features"
              className="hover:text-brand-700 transition-colors">
              
              Features
            </a>
            <a
              href="#research"
              className="hover:text-brand-700 transition-colors">
              
              Research
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/app/signin"
              className="text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors">
              
              Sign In
            </Link>
            <Link
              to="/app/signup"
              className="text-sm font-semibold bg-brand-700 text-white px-4 py-2 rounded-full hover:bg-brand-800 transition-colors">
              
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-400/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6
            }}
            className="max-w-xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6">
              <BrainCircuit size={14} /> AI Tourism Prediction
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight mb-6">
              Travel smarter.
              <br />
              Skip the crowds.
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              PathWise uses advanced LSTM neural networks to forecast tourist
              congestion hours before it happens. Get smart nudges to hidden
              gems, earn rewards, and experience destinations peacefully.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/app"
                className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                
                Open Tourist App
              </Link>
              <Link
                to="/admin/login"
                className="bg-white text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
                
                Admin Console
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
            className="relative hidden lg:flex justify-center">

            <div className="w-full max-w-[560px] rounded-[2rem] bg-white border border-slate-200 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.35em] text-brand-600 font-bold">
                    Live tourist pulse
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Real-time map, forecast and nudges</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={14} /> Kandy</span>
                </div>
              </div>

              <div className="p-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-slate-950 text-white p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,110,110,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.18),transparent_32%)]"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4 text-sm text-slate-300">
                      <span>Temple of the Tooth</span>
                      <span className="font-semibold text-amber-400">92%</span>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-4xl font-display font-bold">Live</div>
                        <p className="text-sm text-slate-300 mt-2 max-w-xs">
                          Crowds are rising now. The system is pushing visitors toward quieter alternatives.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 min-w-28 text-right">
                        <div className="text-xs text-slate-300">Forecast</div>
                        <div className="text-xl font-bold text-emerald-300">+8%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold mb-2">
                      <Gauge size={16} className="text-brand-600" /> Live density
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-brand-500 via-amber-500 to-red-500 rounded-full"></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Updated every few seconds from backend data sources.</p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold mb-3">
                      <BellRing size={16} className="text-brand-600" /> Smart nudge
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Try Royal Botanical Gardens and earn PathPoints for avoiding peak traffic.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-brand-100 bg-brand-50 p-4">
                    <div className="flex items-center gap-2 text-brand-800 text-sm font-semibold mb-2">
                      <Sparkles size={16} /> Live signals
                    </div>
                    <div className="flex items-center justify-between text-xs text-brand-700">
                      <span>Weather</span>
                      <span>Sunny 28°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-brand-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-700">
          <div className="pt-4 md:pt-0">
            <div className="text-4xl font-display font-bold mb-2">8</div>
            <div className="text-brand-200 text-sm font-medium">
              Sri Lankan Landmarks Monitored
            </div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-4xl font-display font-bold mb-2">1,440</div>
            <div className="text-brand-200 text-sm font-medium">
              LSTM Predictions Daily
            </div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-4xl font-display font-bold mb-2">{successfulNudges}%</div>
            <div className="text-brand-200 text-sm font-medium">
              Nudge Acceptance Rate
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
              How PathWise Works
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              A seamless loop of prediction, behavioral economics, and reward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-slate-100 -z-10"></div>

            {[
            {
              step: '1',
              title: 'Predict',
              desc: 'Our LSTM model analyzes weather, holidays, and historical data to forecast crowd density 4 hours ahead.',
              icon: BrainCircuit
            },
            {
              step: '2',
              title: 'Nudge',
              desc: 'Before a site becomes critical, the system sends personalized suggestions for less-crowded alternatives.',
              icon: BellRing
            },
            {
              step: '3',
              title: 'Reward',
              desc: 'Accept a nudge to earn PathPoints, redeemable for museum passes, coffee, and transport credits.',
              icon: Gift
            }].
            map((s, i) =>
            <div key={i} className="text-center relative bg-white">
                <div className="w-24 h-24 mx-auto bg-brand-50 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-sm">
                  <s.icon size={32} className="text-brand-600" />
                </div>
                <div className="text-brand-600 font-bold text-sm mb-2">
                  Step {s.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-12 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) =>
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: i * 0.1
              }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              
                <f.icon size={28} className="text-brand-600 mb-6" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Research Strip */}
      <section
        id="research"
        className="py-16 px-6 bg-brand-50 border-y border-brand-100">
        
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-display font-bold text-brand-900 mb-4">
            Academic Foundation
          </h2>
          <p className="text-brand-700 leading-relaxed mb-6">
            PathWise was developed as an MSc Dissertation prototype to evaluate
            the efficacy of combining Time-Series Forecasting (LSTM) with
            Behavioral Nudge Theory to mitigate overtourism.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-brand-800">
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">
              Built on TensorFlow/Keras
            </span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">
              Validation MAE: 6.2%
            </span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">
              React + Node.js Architecture
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
            {
              q: 'What is PathWise?',
              a: 'PathWise is an AI-powered tourism management system that predicts congestion at popular landmarks and offers tourists smart, rewarding alternatives to reduce overcrowding.'
            },
            {
              q: 'How does the LSTM model work?',
              a: 'Long Short-Term Memory (LSTM) is a type of neural network perfect for time-series data. It analyzes historical visitor counts, weather, and holidays to predict future crowd density up to 4 hours in advance.'
            },
            {
              q: 'Is my location data private?',
              a: 'Yes. The system uses aggregated, anonymized data from public APIs (like Google Places) to gauge crowd density. Individual user tracking is strictly opt-in for routing purposes only.'
            },
            {
              q: 'How do I earn rewards?',
              a: 'When you accept a "Smart Nudge" to visit a less-crowded alternative site, you earn PathPoints. These can be redeemed in the app for perks like free coffee or museum passes.'
            }].
            map((faq, i) =>
            <details
              key={i}
              className="group bg-slate-50 rounded-xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
              
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900">
                  {faq.q}
                  <ChevronDown
                  className="transition-transform group-open:rotate-180 text-slate-400"
                  size={20} />
                
                </summary>
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
            PathWise
          </div>
          <p>© 2026 PathWise AI Tourism System. Academic Prototype.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>);

}