import { useState, useEffect, useRef } from 'react';
import {
  PhoneCall, Download, MessageSquare, ShieldAlert, Fingerprint, ScanFace,
  CheckCircle2, XCircle, Play, RotateCcw, Lock, Eye, UserX, Skull, Camera,
  ChevronRight, Smartphone, Wifi, CreditCard, ShieldOff, TrendingDown,
  Cpu, ScanLine, Banknote,
} from 'lucide-react';
import { sfx } from '@/lib/sfx';

type AttackId = 'call' | 'apk' | 'sim';
type Attack = {
  id: AttackId;
  title: string;
  subtitle: string;
  Icon: typeof PhoneCall;
  steps: { title: string; desc: string; Icon: typeof PhoneCall }[];
  outcome: string;
};

const attacks: Attack[] = [
  {
    id: 'call',
    title: 'OTP Forward Call',
    subtitle: 'Social engineering over phone',
    Icon: PhoneCall,
    steps: [
      { title: 'Ring… "Bank security"', desc: 'Caller ID spoofed to look like your bank. "Your account shows suspicious activity — verify now or it will be frozen."', Icon: PhoneCall },
      { title: 'Manufactured urgency', desc: '"A ₹49,000 transfer was attempted using your card. Did you make it? No? Then we need to verify your identity."', Icon: ShieldAlert },
      { title: '"Read me the OTP"', desc: '"I\'ve sent a verification code to your number. Please read it back so I can stop the fraud." The OTP is actually for their transfer.', Icon: MessageSquare },
      { title: 'Transaction authorized', desc: 'The scammer enters the OTP you just read aloud. Their transfer completes. Your account is drained.', Icon: Banknote },
    ],
    outcome: 'Account drained — using a code you handed over yourself.',
  },
  {
    id: 'apk',
    title: 'Fake APK / Screen Mirror',
    subtitle: 'Malicious app steals credentials',
    Icon: Download,
    steps: [
      { title: 'Lookalike link', desc: 'A WhatsApp message: "Update your UPI app for RBI compliance" with a link to a fake APK. The icon and name match your real app.', Icon: Download },
      { title: 'SMS + screen permissions', desc: 'On install, it requests READ_SMS and Screen Cast "to detect fraud." You grant them because it looks official.', Icon: ShieldOff },
      { title: 'Silent capture', desc: 'The app logs every keystroke and reads every incoming SMS. Your UPI PIN and every OTP are sent to the scammer in the background.', Icon: Cpu },
      { title: 'Remote drain', desc: 'With your PIN and live OTPs, the scammer initiates transfers from their device. You see nothing until the SMS confirmations arrive.', Icon: Banknote },
    ],
    outcome: 'Every OTP and PIN silently exfiltrated. Money moved remotely.',
  },
  {
    id: 'sim',
    title: 'SIM Swap / Port-Out',
    subtitle: 'Attacker takes over your number',
    Icon: CreditCard,
    steps: [
      { title: 'ID details harvested', desc: 'From a data breach or phishing, the scammer has your name, DOB, and Aadhaar-last-4 — enough to convince a telco agent.', Icon: CreditCard },
      { title: 'Port-out request', desc: '"I lost my phone, please port my number to this new SIM." The agent complies. Your number activates on the scammer\'s SIM.', Icon: Smartphone },
      { title: 'Your phone goes silent', desc: 'Your SIM stops working. You assume it\'s a network issue. Meanwhile, every OTP now arrives on the scammer\'s device.', Icon: Wifi },
      { title: 'Account takeover', desc: 'The scammer resets your banking and UPI passwords using "forgot password" + OTP. They now control your accounts entirely.', Icon: Banknote },
    ],
    outcome: 'Your entire identity hijacked — no call, no app, no warning.',
  },
];

const bioSteps = [
  { title: 'Scammer calls / messages', desc: '"Share your verification code to protect your account." The same opening as every OTP scam.', Icon: PhoneCall },
  { title: 'No code exists to share', desc: 'BioPay never generates an OTP or PIN. There is literally nothing to read aloud, screenshot, or type into a fake app.', Icon: Lock },
  { title: 'Physical liveness demanded', desc: 'The terminal requires a live 3D face or fingerprint, present in person. A photo, a recording, or a mold won\'t pass the depth check.', Icon: ScanLine },
  { title: 'Attack dies', desc: 'The scammer has no body to present. The transaction can\'t be authorized remotely. Your money stays put.', Icon: Fingerprint },
];

export default function AttackView() {
  const [selected, setSelected] = useState<AttackId>('call');
  const [otpActive, setOtpActive] = useState(false);
  const [otpStep, setOtpStep] = useState(0);
  const [bioActive, setBioActive] = useState(false);
  const [bioStep, setBioStep] = useState(0);
  const [fraudSaved, setFraudSaved] = useState<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const attack = attacks.find((a) => a.id === selected)!;

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const playOtp = () => {
    clearTimers();
    sfx('error');
    setOtpActive(true);
    setOtpStep(0);
    setFraudSaved(null);
    attack.steps.forEach((_, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setOtpStep(i + 1);
          sfx(i + 1 < attack.steps.length ? 'error' : 'alert');
        }, 1400 * (i + 1)),
      );
    });
    timersRef.current.push(
      setTimeout(() => setFraudSaved(49000), 1400 * attack.steps.length),
    );
  };

  const playBio = () => {
    clearTimers();
    sfx('scan');
    setBioActive(true);
    setBioStep(0);
    bioSteps.forEach((_, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setBioStep(i + 1);
          sfx(i + 1 < bioSteps.length ? 'beep' : 'success');
        }, 1300 * (i + 1)),
      );
    });
  };

  const reset = () => {
    clearTimers();
    sfx('whoosh');
    setOtpActive(false);
    setOtpStep(0);
    setBioActive(false);
    setBioStep(0);
    setFraudSaved(null);
  };

  const selectAttack = (id: AttackId) => {
    clearTimers();
    sfx('whoosh');
    setSelected(id);
    setOtpActive(false);
    setOtpStep(0);
    setBioActive(false);
    setBioStep(0);
    setFraudSaved(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-up text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-coralx-500/15 px-4 py-1.5 text-sm font-600 text-coralx-400 ring-1 ring-coralx-500/30">
          <Skull className="h-4 w-4" /> Why OTP is dead
        </div>
        <h1 className="mt-4 font-display text-3xl font-700 tracking-tight sm:text-4xl">
          The scam works because <span className="text-coralx-400">secrets can be stolen</span>.
          <br className="hidden sm:block" /> Biometrics <span className="text-emeraldx-400">can't be shared</span>.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Pick a real-world fraud pattern, run it against traditional OTP auth, then run the same attack against BioPay.
          The difference is the whole pitch.
        </p>
      </div>

      {/* Attack selector */}
      <div className="grid gap-3 sm:grid-cols-3">
        {attacks.map((a) => {
          const active = a.id === selected;
          return (
            <button
              key={a.id}
              onClick={() => selectAttack(a.id)}
              className={`no-tap group flex items-start gap-3 rounded-2xl p-4 text-left ring-1 transition-all ${
                active ? 'bg-coralx-500/15 ring-coralx-500/40' : 'bg-white/5 ring-white/10 hover:bg-white/[0.08]'
              }`}
            >
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? 'bg-coralx-500/20 text-coralx-400' : 'bg-white/5 text-slate-400'}`}>
                <a.Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-700 text-white">{a.title}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">{a.subtitle}</div>
              </div>
              {active && <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-coralx-400" />}
            </button>
          );
        })}
      </div>

      {/* Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ============ OTP SIDE ============ */}
        <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-coralx-600/10 to-ink-700 p-6 ring-1 ring-coralx-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-coralx-500/20 text-coralx-400">
                <attack.Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-lg font-700">{attack.title}</div>
                <div className="text-xs text-coralx-400">Traditional OTP / UPI · vulnerable</div>
              </div>
            </div>
            {!otpActive ? (
              <button onClick={playOtp} className="no-tap inline-flex items-center gap-2 rounded-xl bg-coralx-500/15 px-3 py-2 text-sm font-600 text-coralx-400 ring-1 ring-coralx-500/30 hover:bg-coralx-500/25">
                <Play className="h-4 w-4" /> Run attack
              </button>
            ) : (
              <button onClick={() => { clearTimers(); setOtpActive(false); setOtpStep(0); setFraudSaved(null); sfx('whoosh'); }} className="no-tap rounded-xl bg-white/5 px-3 py-2 text-xs font-600 text-slate-300 ring-1 ring-white/10 hover:bg-white/10">
                Replay
              </button>
            )}
          </div>

          {/* simulated phone */}
          <div className="mt-5 overflow-hidden rounded-2xl bg-ink-800 p-4 ring-1 ring-white/10">
            {!otpActive ? (
              <div className="grid place-items-center py-12 text-center">
                <attack.Icon className="h-12 w-12 text-coralx-500/50" />
                <p className="mt-3 text-sm text-slate-500">Press "Run attack" to simulate {attack.title.toLowerCase()}.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {attack.steps.map((step, i) => {
                  const reached = i < otpStep;
                  const current = i === otpStep;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-xl p-3 transition-all duration-300 ${
                        reached ? 'bg-coralx-500/10 ring-1 ring-coralx-500/30' : current ? 'bg-coralx-500/15 ring-1 ring-coralx-500/50 animate-pulse' : 'bg-white/[0.02] opacity-40'
                      }`}
                    >
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${reached || current ? 'bg-coralx-500/20 text-coralx-400' : 'bg-white/5 text-slate-500'}`}>
                        <step.Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-600 text-white">{step.title}</div>
                        <div className="mt-0.5 text-xs leading-relaxed text-slate-400">{step.desc}</div>
                      </div>
                      {reached && <XCircle className="h-5 w-5 shrink-0 text-coralx-400" />}
                    </div>
                  );
                })}

                {otpStep >= attack.steps.length && (
                  <div className="animate-pop-in space-y-3">
                    <div className="rounded-xl bg-coralx-500/15 p-4 text-center ring-1 ring-coralx-500/30">
                      <div className="font-display text-base font-700 text-coralx-400">Fraud successful</div>
                      <p className="mt-1 text-xs text-slate-400">{attack.outcome}</p>
                    </div>
                    {fraudSaved !== null && (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-ink-900/60 py-3 font-display text-lg font-700 text-coralx-400">
                        <TrendingDown className="h-5 w-5" /> −₹{fraudSaved.toLocaleString('en-IN')} lost
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* vulnerability chips */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { Icon: MessageSquare, t: 'OTP readable over call' },
              { Icon: Download, t: 'Stolen via fake app' },
              { Icon: Eye, t: 'Visible on screen' },
              { Icon: UserX, t: 'No identity proof' },
            ].map((v) => (
              <div key={v.t} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300 ring-1 ring-white/10">
                <XCircle className="h-3.5 w-3.5 shrink-0 text-coralx-400" /> {v.t}
              </div>
            ))}
          </div>
        </div>

        {/* ============ BIOPAY SIDE ============ */}
        <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-emeraldx-600/10 to-ink-700 p-6 ring-1 ring-emeraldx-500/20" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-emeraldx-500/20 text-emeraldx-400">
                <Fingerprint className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-lg font-700">BioPay Biometrics</div>
                <div className="text-xs text-emeraldx-400">Same attack · blocked</div>
              </div>
            </div>
            {!bioActive ? (
              <button onClick={playBio} className="no-tap inline-flex items-center gap-2 rounded-xl bg-emeraldx-500/15 px-3 py-2 text-sm font-600 text-emeraldx-400 ring-1 ring-emeraldx-500/30 hover:bg-emeraldx-500/25">
                <Play className="h-4 w-4" /> Run defense
              </button>
            ) : (
              <button onClick={() => { clearTimers(); setBioActive(false); setBioStep(0); sfx('whoosh'); }} className="no-tap rounded-xl bg-white/5 px-3 py-2 text-xs font-600 text-slate-300 ring-1 ring-white/10 hover:bg-white/10">
                Replay
              </button>
            )}
          </div>

          {/* scanner mock */}
          <div className="mt-5 overflow-hidden rounded-2xl bg-ink-800 p-4 ring-1 ring-white/10">
            {!bioActive ? (
              <div className="grid place-items-center py-12 text-center">
                <Fingerprint className="h-12 w-12 text-emeraldx-500/50" />
                <p className="mt-3 text-sm text-slate-500">Press "Run defense" to see the same attack fail against biometrics.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {bioSteps.map((stage, i) => {
                  const reached = i < bioStep;
                  const current = i === bioStep;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-xl p-3 transition-all duration-300 ${
                        reached ? 'bg-emeraldx-500/10 ring-1 ring-emeraldx-500/30' : current ? 'bg-emeraldx-500/15 ring-1 ring-emeraldx-500/50 animate-pulse' : 'bg-white/[0.02] opacity-40'
                      }`}
                    >
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${reached || current ? 'bg-emeraldx-500/20 text-emeraldx-400' : 'bg-white/5 text-slate-500'}`}>
                        <stage.Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-600 text-white">{stage.title}</div>
                        <div className="mt-0.5 text-xs leading-relaxed text-slate-400">{stage.desc}</div>
                      </div>
                      {reached && <CheckCircle2 className="h-5 w-5 shrink-0 text-emeraldx-400" />}
                    </div>
                  );
                })}

                {/* scammer failure callout */}
                {bioStep >= 1 && (
                  <div className="animate-pop-in rounded-xl bg-coralx-500/10 p-3 ring-1 ring-coralx-500/30">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-coralx-500/20 text-coralx-400">
                        <Skull className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-600 text-white">Scammer: "Just tell me your fingerprint code…"</div>
                      </div>
                      <XCircle className="h-5 w-5 shrink-0 text-coralx-400" />
                    </div>
                    <div className="mt-2 rounded-lg bg-ink-900/60 px-3 py-2 text-xs font-600 text-coralx-400">
                      IMPOSSIBLE — a fingerprint can't be spoken, screenshotted, or forwarded.
                    </div>
                  </div>
                )}

                {bioStep >= bioSteps.length && (
                  <div className="animate-pop-in space-y-3">
                    <div className="rounded-xl bg-emeraldx-500/15 p-4 text-center ring-1 ring-emeraldx-500/30">
                      <div className="font-display text-base font-700 text-emeraldx-400">Attack blocked · money safe</div>
                      <p className="mt-1 text-xs text-slate-400">Physical liveness was required — the scammer had no body to present.</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-ink-900/60 py-3 font-display text-lg font-700 text-emeraldx-400">
                      <CheckCircle2 className="h-5 w-5" /> ₹0 lost
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* security chips */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { Icon: Lock, t: 'Phishing impossible' },
              { Icon: ScanFace, t: 'Liveness required' },
              { Icon: Camera, t: '3D depth check' },
              { Icon: Fingerprint, t: 'Never leaves device' },
            ].map((v) => (
              <div key={v.t} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300 ring-1 ring-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emeraldx-400" /> {v.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* controls + verdict */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={reset}
          className="no-tap inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-600 text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" /> Reset both
        </button>

        <div className="animate-fade-up w-full rounded-3xl bg-gradient-to-r from-emeraldx-600/15 via-ink-700 to-skyx-500/10 p-6 text-center ring-1 ring-white/10">
          <div className="font-display text-xl font-700 sm:text-2xl">
            OTP authenticates a <span className="text-coralx-400">number</span>. BioPay authenticates a <span className="text-emeraldx-400">person</span>.
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">
            You can't social-engineer a fingerprint. You can't screenshot a heartbeat. The attack surface that powers
            most digital payment fraud simply doesn't exist with physical liveness authentication.
          </p>

          {/* stat row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: 'OTP fraud share', value: '80%+', tone: 'coral' },
              { label: 'Biometric phishing', value: '0%', tone: 'emerald' },
              { label: 'Auth time saved', value: '~8s', tone: 'emerald' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className={`font-display text-2xl font-700 ${s.tone === 'coral' ? 'text-coralx-400' : 'text-emeraldx-400'}`}>{s.value}</div>
                <div className="mt-1 text-[11px] text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
