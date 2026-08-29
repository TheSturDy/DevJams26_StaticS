import { useEffect, useState } from 'react';
import { Fingerprint, ShieldCheck, AlertTriangle, Volume2, VolumeX, Smartphone, Store, GraduationCap } from 'lucide-react';
import { sfx, setSfxEnabled, isSfxEnabled } from '@/lib/sfx';
import type { View } from '@/lib/types';
import CustomerView from '@/views/CustomerView';
import MerchantView from '@/views/MerchantView';
import AttackView from '@/views/AttackView';
import LearnView from '@/views/LearnView';

const views: { id: View; label: string; short: string; icon: typeof Smartphone }[] = [
  { id: 'customer', label: 'Customer Mobile App', short: 'Customer App', icon: Smartphone },
  { id: 'merchant', label: 'Merchant Biometric POS', short: 'Merchant POS', icon: Store },
  { id: 'attack', label: 'Attack Simulation', short: 'Why OTP is Dead', icon: AlertTriangle },
  { id: 'learn', label: 'Learning Space', short: 'Learn Finance', icon: GraduationCap },
];

export default function App() {
  const [view, setView] = useState<View>('customer');
  const [soundOn, setSoundOn] = useState(isSfxEnabled());

  useEffect(() => {
    setSfxEnabled(soundOn);
  }, [soundOn]);

  const switchView = (v: View) => {
    if (v === view) return;
    sfx('whoosh');
    setView(v);
  };

  return (
    <div className="min-h-screen bg-ink-900 text-slate-100 selection:bg-emeraldx-500/30">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-emeraldx-600/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-skyx-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-coralx-500/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emeraldx-400 to-emeraldx-700 shadow-glow">
              <Fingerprint className="h-6 w-6 text-ink-900" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-700 tracking-tight sm:text-base">
                BioPay<span className="text-emeraldx-400">.</span>
              </div>
              <div className="hidden text-[11px] text-slate-400 sm:block">Digital Gullak Ecosystem</div>
            </div>
          </div>

          {/* View switcher */}
          <nav className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl bg-white/5 p-1 ring-1 ring-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {views.map((v) => {
              const Icon = v.icon;
              const active = view === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => switchView(v.id)}
                  className={`no-tap group flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-600 transition-all duration-300 sm:px-4 ${
                    active
                      ? 'bg-emeraldx-500 text-ink-900 shadow-glow'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.4} />
                  <span className="hidden md:inline">{v.label}</span>
                  <span className="md:hidden">{v.short}</span>
                </button>
              );
            })}
          </nav>

          {/* Sound toggle */}
          <button
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              if (next) sfx('ding');
            }}
            className="no-tap grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Toggle sound effects"
            title={soundOn ? 'Sound on' : 'Sound off'}
          >
            {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* View body */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {view === 'customer' && <CustomerView />}
        {view === 'merchant' && <MerchantView />}
        {view === 'attack' && <AttackView />}
        {view === 'learn' && <LearnView />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emeraldx-500" />
            <span>BioPay Prototype · Physical Liveness Authentication · No OTP, No PIN</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emeraldx-500 animate-warning-pulse" /> Demo Environment</span>
            <span>For simulation only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
