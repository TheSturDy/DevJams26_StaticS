import { useState } from 'react';
import {
  Fingerprint, ScanFace, Delete, CheckCircle2, BatteryLow, Wifi, X,
  ShieldCheck, Loader2, Sparkles, Hand, UserCheck, AlertCircle,
  Receipt, Store, TrendingUp, IndianRupee, Clock, Check, Cpu, ScanLine,
  Layers, ArrowLeft, Printer,
} from 'lucide-react';
import { sfx } from '@/lib/sfx';
import { useToasts, ToastStack } from '@/components/Toast';

type Phase = 'idle' | 'choose' | 'scanning' | 'verifying' | 'success' | 'receipt' | 'face' | 'face-scanning' | 'face-success';

type TxnLog = { id: number; amount: number; method: 'Fingerprint' | 'Face'; time: string; customer: string };

const presets = [50, 100, 200, 500];

export default function MerchantView() {
  const [amount, setAmount] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [log, setLog] = useState<TxnLog[]>([
    { id: 1, amount: 240, method: 'Face', time: '10:42', customer: 'Anita Rao' },
    { id: 2, amount: 85, method: 'Fingerprint', time: '10:18', customer: 'Suresh Patel' },
    { id: 3, amount: 540, method: 'Fingerprint', time: '09:55', customer: 'Meera Iyer' },
  ]);
  const { toasts, autoPush, dismiss } = useToasts();

  const press = (key: string) => {
    sfx('tap');
    if (key === 'del') {
      setAmount((a) => a.slice(0, -1));
      return;
    }
    if (key === 'clr') {
      setAmount('');
      return;
    }
    if (amount.length >= 5) return;
    setAmount((a) => (a === '0' ? key : a + key));
  };

  const numeric = Number(amount || '0');

  const initiate = () => {
    if (numeric < 1) {
      sfx('error');
      autoPush('alert', 'Enter an amount', 'Key in a charge amount before initiating.');
      return;
    }
    sfx('beep');
    setPhase('choose');
  };

  const reset = () => {
    sfx('whoosh');
    setPhase('idle');
    setAmount('');
  };

  const completeTxn = (method: 'Fingerprint' | 'Face') => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLog((l) => [{ id: Date.now(), amount: numeric, method, time, customer: 'Suresh Patel' }, ...l]);
  };

  const scanFinger = () => {
    sfx('scan');
    setPhase('scanning');
    setTimeout(() => {
      setPhase('verifying');
      sfx('beep');
    }, 1700);
    setTimeout(() => {
      setPhase('success');
      sfx('success');
      completeTxn('Fingerprint');
      autoPush('success', 'Payment approved', `₹${numeric} charged from Suresh Patel's account. ₹${roundUpStr(numeric)} added to Gullak.`);
    }, 2600);
  };

  const scanFace = () => {
    sfx('scan');
    setPhase('face-scanning');
    setTimeout(() => {
      setPhase('face-success');
      sfx('success');
      completeTxn('Face');
      autoPush('success', 'Face verified · Payment approved', `Liveness confirmed for Suresh Patel. ₹${numeric} charged successfully.`);
    }, 2800);
  };

  const todayTotal = log.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
      <ToastStack toasts={toasts} dismiss={dismiss} />

      {/* ===================== TERMINAL ===================== */}
      <div className="flex flex-col items-center">
        {/* Phone-free badges */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <Badge Icon={BatteryLow} text="Works with 0% Phone Battery" />
          <Badge Icon={X} text="100% Phone-Free" />
          <Badge Icon={ShieldCheck} text="No OTP · No PIN · No Card" emerald />
        </div>

        {/* Terminal body */}
        <div className="relative w-full max-w-[440px]">
          <div className="absolute -inset-4 rounded-[3rem] bg-emeraldx-600/5 blur-3xl" />

          <div className="relative rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-[#161b27] to-[#0a0e16] p-5 shadow-terminal">
            {/* top bar */}
            <div className="flex items-center justify-between rounded-2xl bg-black/40 px-4 py-2.5 ring-1 ring-white/5">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-emeraldx-500">
                  <Fingerprint className="h-4 w-4 text-ink-900" strokeWidth={2.5} />
                </div>
                <span className="font-display text-sm font-700 tracking-tight">BioPay POS</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-600 text-slate-400">
                <span className="flex items-center gap-1"><Wifi className="h-3.5 w-3.5 text-emeraldx-400" /> Online</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emeraldx-400 animate-warning-pulse" /> Secure</span>
              </div>
            </div>

            {/* Screen */}
            <div className="mt-4 min-h-[440px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#0c111c] to-[#070b13] p-5 ring-1 ring-white/5">
              {phase === 'idle' && <IdleScreen amount={amount} numeric={numeric} onPress={press} onInitiate={initiate} />}
              {phase === 'choose' && <ChooseScreen amount={numeric} onBack={reset} onFinger={scanFinger} onFace={() => setPhase('face')} />}
              {phase === 'scanning' && <ScanningScreen amount={numeric} />}
              {phase === 'verifying' && <VerifyingScreen amount={numeric} />}
              {phase === 'success' && <SuccessScreen amount={numeric} onDone={reset} onViewReceipt={() => setPhase('receipt')} />}
              {phase === 'receipt' && <ReceiptScreen amount={numeric} onDone={reset} />}
              {phase === 'face' && <FaceIntroScreen amount={numeric} onBack={() => setPhase('choose')} onStart={scanFace} />}
              {phase === 'face-scanning' && <FaceScanningScreen amount={numeric} />}
              {phase === 'face-success' && <SuccessScreen amount={numeric} onDone={reset} onViewReceipt={() => setPhase('receipt')} face />}
            </div>

            {/* physical hardware hint */}
            <div className="mt-4 flex items-center justify-between px-2 text-[10px] font-600 uppercase tracking-widest text-slate-600">
              <span>Model · BP-T2</span>
              <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> Secure Enclave</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MERCHANT SIDE PANEL ===================== */}
      <div className="space-y-5">
        {/* Merchant profile + today summary */}
        <section className="animate-fade-up rounded-3xl bg-ink-700/60 p-6 ring-1 ring-white/10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-skyx-400 to-skyx-500 text-ink-900">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-base font-700">Brew Beans Cafe</div>
              <div className="text-xs text-slate-400">Merchant ID · BP-M-88213</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Today" value={`₹${todayTotal.toLocaleString('en-IN')}`} Icon={IndianRupee} tone="emerald" />
            <Stat label="Txns" value={String(log.length)} Icon={Receipt} tone="sky" />
            <Stat label="Avg" value={`₹${Math.round(todayTotal / log.length)}`} Icon={TrendingUp} tone="emerald" />
          </div>
        </section>

        {/* Transaction log */}
        <section className="animate-fade-up rounded-3xl bg-ink-700/60 p-6 ring-1 ring-white/10 backdrop-blur" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-700">Recent transactions</h3>
            <span className="text-[11px] text-slate-400">{log.length} today</span>
          </div>
          <div className="mt-3 space-y-2">
            {log.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${t.method === 'Face' ? 'bg-skyx-500/15 text-skyx-400' : 'bg-emeraldx-500/15 text-emeraldx-400'}`}>
                  {t.method === 'Face' ? <ScanFace className="h-5 w-5" /> : <Fingerprint className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-600">{t.customer}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" /> {t.time} · {t.method}
                  </div>
                </div>
                <div className="font-display text-sm font-700 text-emeraldx-400">+₹{t.amount}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="animate-fade-up rounded-3xl bg-ink-700/60 p-6 ring-1 ring-white/10 backdrop-blur" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emeraldx-400" />
            <h3 className="font-display text-base font-700">How a charge flows</h3>
          </div>
          <ol className="mt-4 space-y-2.5">
            {[
              'Merchant keys in the amount and hits "Initiate Biometric Charge".',
              'Customer scans a finger or face on the terminal.',
              'Terminal verifies live biometric identity in ~2 seconds.',
              'Funds deduct from bank/Gullak. Round-up auto-applied. Done.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emeraldx-500/15 text-xs font-700 text-emeraldx-400">{i + 1}</span>
                <span className="text-sm leading-relaxed text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* tech badges */}
        <section className="animate-fade-up grid grid-cols-2 gap-3" style={{ animationDelay: '160ms' }}>
          {[
            { Icon: Cpu, t: 'Secure Enclave', d: 'On-device crypto' },
            { Icon: Layers, t: '3D Depth', d: 'Structured light' },
            { Icon: ScanLine, t: 'Liveness', d: 'Anti-spoof check' },
            { Icon: ShieldCheck, t: 'Zero Secret', d: 'Nothing to steal' },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <b.Icon className="h-5 w-5 text-emeraldx-400" />
              <div className="mt-2 text-sm font-600">{b.t}</div>
              <div className="text-[11px] text-slate-400">{b.d}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function roundUpStr(n: number) {
  return (Math.ceil(n / 10) * 10 - n) || 0;
}

function Badge({ Icon, text, emerald }: { Icon: typeof BatteryLow; text: string; emerald?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-600 ring-1 ${
      emerald ? 'bg-emeraldx-500/15 text-emeraldx-400 ring-emeraldx-500/30' : 'bg-white/5 text-slate-200 ring-white/10'
    }`}>
      <Icon className="h-4 w-4" /> {text}
    </span>
  );
}

function Stat({ label, value, Icon, tone }: { label: string; value: string; Icon: typeof IndianRupee; tone: 'emerald' | 'sky' }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      <Icon className={`h-4 w-4 ${tone === 'emerald' ? 'text-emeraldx-400' : 'text-skyx-400'}`} />
      <div className="mt-1.5 font-display text-base font-700">{value}</div>
      <div className="text-[10px] text-slate-400">{label}</div>
    </div>
  );
}

/* ---------- Screen phases ---------- */

function IdleScreen({ amount, numeric, onPress, onInitiate }: { amount: string; numeric: number; onPress: (k: string) => void; onInitiate: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="text-center">
        <div className="text-[11px] font-600 uppercase tracking-widest text-slate-500">Charge Amount</div>
        <div className="mt-1 flex items-center justify-center font-display text-5xl font-700 tracking-tight text-white">
          <IndianRupee className="h-8 w-8 text-slate-400" strokeWidth={2.5} />
          {amount || '0'}
        </div>
      </div>

      {/* quick presets */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => { sfx('tap'); onPress('clr'); onPress(String(p)); }}
            className="no-tap rounded-xl bg-emeraldx-500/10 py-2 text-xs font-700 text-emeraldx-400 ring-1 ring-emeraldx-500/20 transition-all hover:bg-emeraldx-500/20 active:scale-95"
          >
            ₹{p}
          </button>
        ))}
      </div>

      {/* keypad */}
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clr', '0', 'del'].map((k) => (
          <button
            key={k}
            onClick={() => onPress(k)}
            className="no-tap grid h-12 place-items-center rounded-2xl bg-white/[0.04] font-display text-xl font-600 text-white ring-1 ring-white/10 transition-all hover:bg-white/[0.08] active:scale-95"
          >
            {k === 'del' ? <Delete className="h-5 w-5" /> : k === 'clr' ? 'C' : k}
          </button>
        ))}
      </div>

      <button
        onClick={onInitiate}
        className="no-tap mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-emeraldx-500 py-3.5 font-display text-base font-700 text-ink-900 shadow-glow transition-all hover:bg-emeraldx-400 active:scale-[0.98]"
      >
        <Fingerprint className="h-5 w-5" /> Initiate Biometric Charge
      </button>
    </div>
  );
}

function ChooseScreen({ amount, onBack, onFinger, onFace }: { amount: number; onBack: () => void; onFinger: () => void; onFace: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="no-tap flex items-center gap-1 rounded-lg p-1 text-slate-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-widest text-slate-500">Awaiting customer</div>
          <div className="font-display text-2xl font-700">₹{amount}</div>
        </div>
        <div className="w-7" />
      </div>

      <div className="mt-4 text-center text-sm text-slate-400">Choose a biometric to authenticate</div>

      <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
        <ScanOption Icon={Fingerprint} label="Scan Fingerprint" hint="Capacitive glass scanner" onClick={onFinger} />
        <ScanOption Icon={ScanFace} label="Face Recognition" hint="3D liveness check" onClick={onFace} />
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emeraldx-500" /> No phone, card, or OTP required from customer
      </div>
    </div>
  );
}

function ScanOption({ Icon, label, hint, onClick }: { Icon: typeof Fingerprint; label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="no-tap group flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition-all hover:bg-emeraldx-500/10 hover:ring-emeraldx-500/40 active:scale-95"
    >
      <div className="relative grid h-20 w-20 place-items-center rounded-full bg-emeraldx-500/10">
        <div className="absolute inset-0 rounded-full bg-emeraldx-500/20 pulse-ring" />
        <Icon className="h-10 w-10 text-emeraldx-400" strokeWidth={1.8} />
      </div>
      <div className="text-center">
        <div className="text-sm font-700 text-white">{label}</div>
        <div className="mt-0.5 text-[11px] text-slate-400">{hint}</div>
      </div>
    </button>
  );
}

function ScanningScreen({ amount }: { amount: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="text-[11px] uppercase tracking-widest text-slate-500">Scanning fingerprint…</div>
      <div className="mt-1 font-display text-2xl font-700">₹{amount}</div>

      {/* biometric glass scanner */}
      <div className="relative mt-7 grid h-44 w-44 place-items-center">
        <div className="absolute inset-0 rounded-[2rem] bg-emeraldx-500/5 blur-xl" />
        <div className="absolute inset-0 rounded-[2rem] border-2 border-emeraldx-500/30" />
        <div className="absolute inset-0 rounded-[2rem] border-2 border-emeraldx-500/60 pulse-ring" />
        <div className="absolute inset-x-4 top-1/2 h-0.5 bg-emeraldx-400 shadow-glow scan-line" />
        <Fingerprint className="h-24 w-24 text-emeraldx-400/80" strokeWidth={1.2} />
        {/* ridge detail dots */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute h-1 w-1 rounded-full bg-emeraldx-300 animate-warning-pulse" style={{ top: `${30 + i * 12}%`, left: `${35 + (i % 2) * 20}%` }} />
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm text-emeraldx-400">
        <Hand className="h-4 w-4 animate-pulse" /> Reading live ridges…
      </div>
      <div className="mt-2 text-[11px] text-slate-500">Matching against secure enclave template</div>
    </div>
  );
}

function VerifyingScreen({ amount }: { amount: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative grid h-24 w-24 place-items-center">
        <div className="absolute inset-0 rounded-full border-4 border-emeraldx-500/20" />
        <Loader2 className="h-20 w-20 animate-spin text-emeraldx-400" strokeWidth={2} />
      </div>
      <div className="mt-6 font-display text-lg font-700">Verifying identity…</div>
      <div className="mt-1 text-sm text-slate-400">Matching biometric template · ₹{amount}</div>
      <div className="mt-4 flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/10">
        <AlertCircle className="h-3.5 w-3.5 text-skyx-400" /> Liveness proof in progress
      </div>
    </div>
  );
}

function SuccessScreen({ amount, onDone, onViewReceipt, face }: { amount: number; onDone: () => void; onViewReceipt: () => void; face?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center animate-pop-in">
      <div className="relative grid h-28 w-28 place-items-center rounded-full bg-emeraldx-500/10">
        <div className="absolute inset-0 rounded-full bg-emeraldx-500/20 pulse-ring" />
        <svg viewBox="0 0 52 52" className="h-20 w-20">
          <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(0,214,143,0.2)" strokeWidth="2" />
          <path d="M14 27 L22 35 L38 18" fill="none" stroke="#00d68f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="check-draw" />
        </svg>
      </div>
      <div className="mt-5 font-display text-xl font-700">Payment Approved</div>
      <div className="mt-1 text-sm text-slate-400">₹{amount} charged from Suresh Patel</div>

      <div className="mt-5 w-full space-y-2 rounded-2xl bg-white/5 p-4 text-left ring-1 ring-white/10">
        <Row label="Customer" value="Suresh Patel" />
        <Row label="Method" value={face ? 'Face Recognition' : 'Fingerprint'} />
        <Row label="Liveness" value="Verified" emerald />
        <Row label="Round-up to Gullak" value={`+₹${roundUpStr(amount)}`} emerald />
      </div>

      <div className="mt-5 grid w-full grid-cols-2 gap-2">
        <button onClick={onDone} className="no-tap rounded-2xl bg-emeraldx-500 py-3 text-sm font-700 text-ink-900 transition-all hover:bg-emeraldx-400 active:scale-95">
          New transaction
        </button>
        <button onClick={onViewReceipt} className="no-tap flex items-center justify-center gap-1.5 rounded-2xl bg-white/5 py-3 text-sm font-600 text-slate-200 ring-1 ring-white/10 hover:bg-white/10">
          <Receipt className="h-4 w-4" /> Receipt
        </button>
      </div>
    </div>
  );
}

function ReceiptScreen({ amount, onDone }: { amount: number; onDone: () => void }) {
  return (
    <div className="animate-pop-in flex h-full flex-col">
      <div className="flex items-center gap-2">
        <Receipt className="h-5 w-5 text-emeraldx-400" />
        <span className="font-display text-sm font-700">Digital Receipt</span>
      </div>

      {/* receipt paper */}
      <div className="mt-4 flex-1 overflow-hidden rounded-2xl bg-[#0e1424] p-5 ring-1 ring-white/10">
        <div className="text-center">
          <div className="font-display text-base font-700 text-white">Brew Beans Cafe</div>
          <div className="mt-0.5 text-[10px] text-slate-500">MG Road, Bengaluru · GSTIN 29ABCDE1234F1Z5</div>
          <div className="mx-auto mt-3 h-px w-full bg-white/10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 4px, transparent 4px, transparent 8px)' }} />
        </div>

        <div className="mt-3 space-y-1.5 text-xs">
          <RLine label="Txn ID" value="BP2408291042" />
          <RLine label="Date" value="29 Aug 2026 · 10:42" />
          <RLine label="Customer" value="Suresh Patel" />
          <RLine label="Auth method" value="Biometric (Fingerprint)" />
          <RLine label="Liveness" value="Verified" />
        </div>

        <div className="mx-auto mt-3 h-px w-full bg-white/10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 4px, transparent 4px, transparent 8px)' }} />

        <div className="mt-3 space-y-1.5 text-xs">
          <RLine label="Amount" value={`₹${amount}`} />
          <RLine label="Round-up to Gullak" value={`+₹${roundUpStr(amount)}`} emerald />
          <RLine label="Total charged" value={`₹${amount}`} bold />
        </div>

        <div className="mx-auto mt-3 h-px w-full bg-white/10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 4px, transparent 4px, transparent 8px)' }} />

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-emeraldx-400">
          <CheckCircle2 className="h-3.5 w-3.5" /> Payment successful · Thank you
        </div>
        <div className="mt-1 text-center text-[9px] text-slate-600">This is a digitally generated receipt via BioPay</div>
      </div>

      <button onClick={onDone} className="no-tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emeraldx-500 py-3 font-display text-sm font-700 text-ink-900 transition-all hover:bg-emeraldx-400 active:scale-95">
        <Printer className="h-4 w-4" /> Done
      </button>
    </div>
  );
}

function FaceIntroScreen({ amount, onBack, onStart }: { amount: number; onBack: () => void; onStart: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <button onClick={onBack} className="absolute left-4 top-4 flex items-center gap-1 rounded-lg p-1 text-slate-400 hover:text-white">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="text-[11px] uppercase tracking-widest text-slate-500">Face Recognition</div>
      <div className="mt-1 font-display text-2xl font-700">₹{amount}</div>

      <FaceMesh height="h-44" width="w-36" />

      <div className="mt-4 space-y-1.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5"><ScanLine className="h-3.5 w-3.5 text-emeraldx-400" /> Align face within the frame</div>
        <div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-emeraldx-400" /> 3D depth mapping active</div>
      </div>

      <button
        onClick={onStart}
        className="no-tap mt-5 flex items-center gap-2 rounded-2xl bg-emeraldx-500 px-6 py-3 font-display text-sm font-700 text-ink-900 shadow-glow transition-all hover:bg-emeraldx-400 active:scale-95"
      >
        <ScanFace className="h-5 w-5" /> Activate face scan
      </button>
    </div>
  );
}

function FaceScanningScreen({ amount }: { amount: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="text-[11px] uppercase tracking-widest text-slate-500">Scanning face…</div>
      <div className="mt-1 font-display text-2xl font-700">₹{amount}</div>

      <div className="relative mt-5 h-48 w-40 overflow-hidden rounded-2xl bg-black/60 ring-2 ring-emeraldx-500/60">
        <div className="absolute inset-x-3 top-1/2 h-1 bg-emeraldx-400 shadow-glow scan-line" />
        <svg viewBox="0 0 100 120" className="absolute inset-0 h-full w-full">
          <g stroke="rgba(0,214,143,0.7)" strokeWidth="0.5" fill="none">
            <ellipse cx="50" cy="55" rx="28" ry="38" className="animate-warning-pulse" />
            <ellipse cx="50" cy="55" rx="20" ry="28" />
            <line x1="50" y1="20" x2="50" y2="90" />
            <line x1="25" y1="45" x2="75" y2="45" />
            <line x1="28" y1="65" x2="72" y2="65" />
            <circle cx="38" cy="48" r="3" fill="rgba(0,214,143,0.5)" />
            <circle cx="62" cy="48" r="3" fill="rgba(0,214,143,0.5)" />
            <path d="M40 70 Q50 76 60 70" />
            {Array.from({ length: 6 }).map((_, i) => (
              <circle key={i} cx={30 + i * 8} cy={35 + (i % 2) * 10} r="1" fill="#00d68f" />
            ))}
          </g>
        </svg>
        <div className="absolute -inset-4 rounded-full border-2 border-dashed border-emeraldx-500/30" style={{ animation: 'bp-mesh-rotate 8s linear infinite' }} />
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-emeraldx-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Building 3D mesh · checking liveness…
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emeraldx-500/15 px-3 py-1.5 text-xs font-600 text-emeraldx-400">
        <UserCheck className="h-3.5 w-3.5" /> Liveness Verified
      </div>
    </div>
  );
}

function FaceMesh({ height, width }: { height: string; width: string }) {
  return (
    <div className={`relative mt-6 ${height} ${width} overflow-hidden rounded-2xl bg-black/60 ring-2 ring-emeraldx-500/40`}>
      <div className="absolute inset-0 grid place-items-center">
        <ScanFace className="h-20 w-20 text-emeraldx-400/40" strokeWidth={1} />
      </div>
      <svg viewBox="0 0 100 120" className="absolute inset-0 h-full w-full opacity-70">
        <g stroke="rgba(0,214,143,0.5)" strokeWidth="0.4" fill="none">
          <ellipse cx="50" cy="55" rx="28" ry="38" />
          <ellipse cx="50" cy="55" rx="20" ry="28" />
          <line x1="50" y1="20" x2="50" y2="90" />
          <line x1="25" y1="45" x2="75" y2="45" />
          <line x1="28" y1="65" x2="72" y2="65" />
          <circle cx="38" cy="48" r="3" />
          <circle cx="62" cy="48" r="3" />
          <path d="M40 70 Q50 76 60 70" />
        </g>
      </svg>
      {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((p, i) => (
        <div key={i} className={`absolute ${p} h-5 w-5 border-emeraldx-400 ${p.includes('top') ? 'border-t-2' : 'border-b-2'} ${p.includes('left') ? 'border-l-2' : 'border-r-2'}`} />
      ))}
    </div>
  );
}

function Row({ label, value, emerald }: { label: string; value: string; emerald?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className={`font-600 ${emerald ? 'text-emeraldx-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function RLine({ label, value, emerald, bold }: { label: string; value: string; emerald?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={bold ? 'font-display text-sm font-700 text-white' : emerald ? 'font-600 text-emeraldx-400' : 'text-slate-300'}>{value}</span>
    </div>
  );
}
