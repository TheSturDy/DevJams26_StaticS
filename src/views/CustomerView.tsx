import { useMemo, useState } from 'react';
import {
  Wallet, PiggyBank, TrendingUp, ScanFace, Fingerprint, Bell, Shield, ShieldAlert,
  Check, ChevronRight, Plus, ArrowUpRight, ArrowDownLeft, Sparkles, Hand, Zap,
} from 'lucide-react';
import { sfx } from '@/lib/sfx';
import { initialTransactions, roundUp, type Transaction } from '@/lib/types';
import { useToasts, ToastStack, Popup } from '@/components/Toast';

export default function CustomerView() {
  const [gullak, setGullak] = useState(1240);
  const [autoRoundUp, setAutoRoundUp] = useState(true);
  const [duressOn, setDuressOn] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [duressFinger, setDuressFinger] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const { toasts, autoPush, dismiss } = useToasts();

  const totalRoundUp = useMemo(
    () => initialTransactions.reduce((s, t) => s + t.roundUp, 0),
    [],
  );

  const toggleAuto = () => {
    const next = !autoRoundUp;
    setAutoRoundUp(next);
    sfx('toggle');
    autoPush(next ? 'success' : 'info', next ? 'Auto Round-Up enabled' : 'Auto Round-Up paused', next ? 'Spare change now flows into your Gullak automatically.' : 'Transactions will no longer add round-ups.');
  };

  const beginDuressSetup = () => {
    sfx('beep');
    setSetupOpen(true);
  };

  const confirmDuress = (finger: string) => {
    setDuressFinger(finger);
    setDuressOn(true);
    setSetupOpen(false);
    sfx('success');
    autoPush('alert', 'Duress finger registered', `${finger} is now your silent panic trigger. Scanning it during a forced transaction sends a hidden alert — no visible signal on screen.`);
  };

  const simulateDuress = () => {
    if (!duressOn) return;
    setScanning(true);
    sfx('scan');
    setTimeout(() => {
      setScanning(false);
      sfx('alert');
      autoPush('alert', 'Silent emergency alert sent', 'Police control room notified. Live location streamed. Account balance hidden. Transaction appears declined to attacker — no suspicion raised.');
    }, 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
      <ToastStack toasts={toasts} dismiss={dismiss} />

      {/* ===================== PHONE FRAME ===================== */}
      <div className="flex justify-center lg:justify-start">
        <PhoneFrame>
          <div className="flex h-full flex-col bg-gradient-to-b from-ink-700 to-ink-800 text-white">
            {/* status bar */}
            <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-600 text-slate-300">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emeraldx-400" />
                <span className="h-2.5 w-3.5 rounded-sm bg-slate-500/70" />
                <span className="text-slate-400">BioPay</span>
              </div>
            </div>

            {/* greeting */}
            <div className="px-5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Good morning</div>
                  <div className="font-display text-lg font-700">Suresh Patel</div>
                </div>
                <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emeraldx-400 to-skyx-500 text-sm font-700 text-ink-900">SP</div>
              </div>
            </div>

            {/* Gullak balance card */}
            <div className="px-5 pt-4">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emeraldx-600 via-emeraldx-500 to-emeraldx-700 p-5 shadow-glow">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15" />
                <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/10" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emeraldx-50">
                      <PiggyBank className="h-5 w-5" />
                      <span className="text-xs font-600 uppercase tracking-wider">Gullak Savings</span>
                    </div>
                    <TrendingUp className="h-4 w-4 text-emeraldx-50/80" />
                  </div>
                  <div className="mt-2 font-display text-4xl font-700 tracking-tight">₹{gullak.toLocaleString('en-IN')}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-emeraldx-50/90">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>+₹{totalRoundUp} added this week via round-ups</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto round-up toggle */}
            <div className="px-5 pt-3">
              <button
                onClick={toggleAuto}
                className="no-tap flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 text-left ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emeraldx-500/15 text-emeraldx-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-600">Auto Round-Up Savings</div>
                    <div className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                      Rounds every payment to the nearest ₹10 and saves the difference into your Gullak.
                    </div>
                  </div>
                </div>
                <Toggle on={autoRoundUp} />
              </button>
            </div>

            {/* quick actions */}
            <div className="grid grid-cols-3 gap-2 px-5 pt-3">
              {[
                { label: 'Scan & Pay', Icon: Fingerprint },
                { label: 'Face Pay', Icon: ScanFace },
                { label: 'Add Funds', Icon: Plus },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => { sfx('tap'); autoPush('info', a.label, 'Biometric authentication ready — no OTP or PIN required.'); }}
                  className="no-tap flex flex-col items-center gap-1.5 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                >
                  <a.Icon className="h-5 w-5 text-emeraldx-400" />
                  <span className="text-[10px] font-600 text-slate-300">{a.label}</span>
                </button>
              ))}
            </div>

            {/* transactions */}
            <div className="mt-3 flex-1 overflow-y-auto px-5 pb-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-700 uppercase tracking-wider text-slate-400">Recent Activity</span>
                <span className="text-[11px] text-emeraldx-400">+₹{totalRoundUp} round-up</span>
              </div>
              <div className="space-y-1.5">
                {initialTransactions.slice(0, 5).map((t) => (
                  <TxRow key={t.id} tx={t} />
                ))}
              </div>
            </div>

            {/* bottom nav */}
            <div className="flex items-center justify-around border-t border-white/5 bg-ink-800/80 px-6 py-2.5 backdrop-blur">
              {[
                { label: 'Home', Icon: Wallet, active: true },
                { label: 'Gullak', Icon: PiggyBank },
                { label: 'Scan', Icon: Fingerprint },
                { label: 'Alerts', Icon: Bell },
              ].map((n) => (
                <button key={n.label} onClick={() => sfx('tap')} className={`no-tap flex flex-col items-center gap-0.5 ${n.active ? 'text-emeraldx-400' : 'text-slate-500'}`}>
                  <n.Icon className="h-5 w-5" />
                  <span className="text-[9px] font-600">{n.label}</span>
                </button>
              ))}
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* ===================== SIDE PANEL ===================== */}
      <div className="space-y-5">
        {/* Biometric settings card */}
        <section className="animate-fade-up rounded-3xl bg-ink-700/60 p-6 ring-1 ring-white/10 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-700">Biometric Authentication</h2>
              <p className="mt-1 text-sm text-slate-400">Your body is your password. No OTP. No PIN. No phishing surface.</p>
            </div>
            <Shield className="h-7 w-7 text-emeraldx-400" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <BiometricCard
              Icon={ScanFace}
              title="Face ID"
              status="Active"
              desc="3D structured-light liveness check"
              active
            />
            <BiometricCard
              Icon={Fingerprint}
              title="Primary Finger"
              status="Active"
              desc="Index finger · right hand"
              active
            />
          </div>

          {/* Duress finger */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-coralx-600/15 to-ink-700 p-5 ring-1 ring-coralx-500/25">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coralx-500/20 text-coralx-400">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-700 text-white">Duress Security Finger</span>
                    {duressOn && (
                      <span className="rounded-full bg-coralx-500/20 px-2 py-0.5 text-[10px] font-700 uppercase tracking-wide text-coralx-400">Armed</span>
                    )}
                  </div>
                  <p className="mt-1 max-w-md text-[12px] leading-relaxed text-slate-400">
                    Register a panic finger (e.g. your pinky). If someone forces you to pay, scanning it silently alerts
                    the police, hides your real balance, and fakes a "declined" screen — without raising suspicion.
                  </p>
                </div>
              </div>
              <Toggle on={duressOn} coral onClick={() => (duressOn ? setDuressOn(false) : beginDuressSetup())} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={duressOn ? simulateDuress : beginDuressSetup}
                disabled={scanning}
                className="no-tap inline-flex items-center gap-2 rounded-xl bg-coralx-500/15 px-4 py-2.5 text-sm font-600 text-coralx-400 ring-1 ring-coralx-500/30 transition-colors hover:bg-coralx-500/25 disabled:opacity-60"
              >
                {scanning ? (
                  <><Hand className="h-4 w-4 animate-pulse" /> Scanning duress finger…</>
                ) : duressOn ? (
                  <><Hand className="h-4 w-4" /> Simulate duress scan</>
                ) : (
                  <><Plus className="h-4 w-4" /> Set up duress finger</>
                )}
              </button>
              {duressFinger && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2.5 text-xs font-600 text-slate-300 ring-1 ring-white/10">
                  <Check className="h-3.5 w-3.5 text-emeraldx-400" /> Panic finger: {duressFinger}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Gullak explainer + breakdown */}
        <section className="animate-fade-up rounded-3xl bg-ink-700/60 p-6 ring-1 ring-white/10 backdrop-blur" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emeraldx-400" />
            <h3 className="font-display text-lg font-700">How Round-Up Savings Works</h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { pay: '₹84', next: '₹90', saved: '₹6', label: 'Brew Beans Cafe' },
              { pay: '₹153', next: '₹160', saved: '₹7', label: 'Metro Quick Mart' },
              { pay: '₹47', next: '₹50', saved: '₹3', label: 'RideGo Cab' },
            ].map((e, i) => (
              <div key={i} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-[11px] text-slate-400">{e.label}</div>
                <div className="mt-1 flex items-center gap-2 font-display text-base font-700">
                  <span className="text-slate-300">{e.pay}</span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                  <span className="text-white">{e.next}</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emeraldx-500/15 px-2 py-0.5 text-xs font-700 text-emeraldx-400">
                  <ArrowUpRight className="h-3 w-3" /> +{e.saved} to Gullak
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Every transaction is rounded up to the nearest ₹10. The spare change is swept into your Digital Gullak
            instantly — a painless micro-savings engine built into every payment.
          </p>
        </section>
      </div>

      {/* Duress setup popup */}
      <Popup open={setupOpen} onClose={() => setSetupOpen(false)} maxW="max-w-lg">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-coralx-400" />
          <h3 className="font-display text-lg font-700">Choose your panic finger</h3>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Pick a finger you'd never use for normal payments. Scanning it under duress triggers a silent emergency protocol.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Thumb', 'Index', 'Middle', 'Ring', 'Pinky (R)', 'Pinky (L)', 'Middle (L)', 'Index (L)'].map((f) => {
            const recommended = f.toLowerCase().includes('pinky');
            return (
              <button
                key={f}
                onClick={() => confirmDuress(f)}
                className={`no-tap group relative flex flex-col items-center gap-2 rounded-2xl p-4 ring-1 transition-all ${
                  recommended
                    ? 'bg-coralx-500/10 ring-coralx-500/40 hover:bg-coralx-500/20'
                    : 'bg-white/5 ring-white/10 hover:bg-white/10'
                }`}
              >
                <Fingerprint className={`h-7 w-7 ${recommended ? 'text-coralx-400' : 'text-slate-400'}`} />
                <span className="text-[11px] font-600 text-slate-300">{f}</span>
                {recommended && (
                  <span className="absolute -top-2 rounded-full bg-coralx-500 px-2 py-0.5 text-[9px] font-700 uppercase text-white">Recommended</span>
                )}
              </button>
            );
          })}
        </div>
        <button onClick={() => setSetupOpen(false)} className="mt-5 w-full rounded-xl bg-white/5 py-2.5 text-sm font-600 text-slate-300 ring-1 ring-white/10 hover:bg-white/10">
          Cancel
        </button>
      </Popup>
    </div>
  );
}

/* ---------- sub components ---------- */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[680px] w-[340px] shrink-0 rounded-[2.75rem] bg-ink-900 p-2.5 shadow-terminal ring-1 ring-white/10">
      {/* side buttons */}
      <div className="absolute -left-1 top-28 h-12 w-1 rounded-l bg-ink-600" />
      <div className="absolute -left-1 top-44 h-16 w-1 rounded-l bg-ink-600" />
      <div className="absolute -right-1 top-36 h-20 w-1 rounded-r bg-ink-600" />
      {/* screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-ink-800">
        {/* notch */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-ink-900" />
        <div className="h-full w-full overflow-y-auto pt-2">{children}</div>
      </div>
    </div>
  );
}

function Toggle({ on, coral, onClick }: { on: boolean; coral?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`no-tap relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
        on ? (coral ? 'bg-coralx-500' : 'bg-emeraldx-500') : 'bg-white/10'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
          on ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

function TxRow({ tx }: { tx: Transaction }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-lg">{tx.emoji}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-600">{tx.merchant}</div>
        <div className="text-[10px] text-slate-400">{tx.date} · {tx.time} · {tx.category}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-700">−₹{tx.amount}</div>
        <div className="flex items-center justify-end gap-0.5 text-[10px] font-600 text-emeraldx-400">
          <ArrowDownLeft className="h-3 w-3" /> +₹{tx.roundUp}
        </div>
      </div>
    </div>
  );
}

function BiometricCard({ Icon, title, status, desc, active }: { Icon: typeof ScanFace; title: string; status: string; desc: string; active: boolean }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emeraldx-500/15 text-emeraldx-400">
          <Icon className="h-5 w-5" />
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-700 uppercase tracking-wide ${active ? 'bg-emeraldx-500/20 text-emeraldx-400' : 'bg-slate-500/20 text-slate-400'}`}>
          {status}
        </span>
      </div>
      <div className="mt-3 text-sm font-700">{title}</div>
      <div className="mt-0.5 text-[11px] text-slate-400">{desc}</div>
    </div>
  );
}
