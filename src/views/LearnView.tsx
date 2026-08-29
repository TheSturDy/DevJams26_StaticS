import { useState } from 'react';
import {
  GraduationCap, BookOpen, PiggyBank, TrendingUp, ShieldCheck, Calculator,
  Coins, Wallet, ArrowRight, CheckCircle2, Lock, Zap, Target, Percent,
  LineChart, AlertTriangle, Lightbulb, ChevronRight, Award, Brain,
} from 'lucide-react';
import { sfx } from '@/lib/sfx';

type Module = {
  id: string;
  title: string;
  tagline: string;
  Icon: typeof PiggyBank;
  color: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  minutes: number;
  lessons: Lesson[];
};

type Lesson = {
  title: string;
  body: string;
  takeaway: string;
};

const modules: Module[] = [
  {
    id: 'gullak',
    title: 'Digital Gullak & Round-Up Savings',
    tagline: 'How spare change becomes real wealth',
    Icon: PiggyBank,
    color: 'emeraldx',
    level: 'Beginner',
    minutes: 4,
    lessons: [
      {
        title: 'What is a Digital Gullak?',
        body: 'A Digital Gullak is a micro-savings wallet built into your payment app. Just like the clay piggy bank at home, it collects small amounts automatically — but instead of coins, it sweeps the spare change from every digital payment you make. The magic is that you never have to think about it.',
        takeaway: 'You save money without ever making a decision to save.',
      },
      {
        title: 'How round-ups work',
        body: 'Every time you pay, BioPay rounds your bill up to the nearest ₹10 and moves the difference into your Gullak. Pay ₹84 for coffee? ₹6 goes to savings. Pay ₹153 for groceries? ₹7 saved. Over a month of normal spending, that adds up to hundreds of rupees you would never have missed.',
        takeaway: 'A ₹6 round-up feels like nothing. A year of them feels like a bonus.',
      },
      {
        title: 'The math of small savings',
        body: 'Say you make 20 payments a week with an average round-up of ₹4. That\'s ₹80/week → ₹350/month → ₹4,200/year. Add the compound interest a savings account pays on top, and a painless habit turns into a meaningful emergency fund over 3-5 years — all from money you were already spending.',
        takeaway: '₹4 per transaction × 20 per week = ₹4,200+ per year, for free.',
      },
      {
        title: 'Why automatic beats willpower',
        body: 'Studies show people who rely on "I\'ll save what\'s left" save almost nothing — there\'s never anything left. Automatic round-ups flip this: the saving happens at the moment of spending, before you can spend it on something else. It\'s the same principle behind auto-investing in mutual funds (SIPs).',
        takeaway: 'Automation removes the need for discipline. That\'s why it works.',
      },
    ],
  },
  {
    id: 'biometric',
    title: 'Biometric Authentication Explained',
    tagline: 'Why your body is safer than a password',
    Icon: ShieldCheck,
    color: 'skyx',
    level: 'Intermediate',
    minutes: 5,
    lessons: [
      {
        title: 'Something you know vs. something you are',
        body: 'A password or OTP is "something you know" — a piece of information that can be copied, guessed, or stolen. A fingerprint or face is "something you are" — a physical trait that can\'t be transmitted over a phone call or copied from a screenshot. This is the core of why biometrics resist phishing.',
        takeaway: 'You can\'t accidentally read your fingerprint to a stranger.',
      },
      {
        title: 'What is liveness detection?',
        body: 'A photo of your face could fool a basic camera. Liveness detection checks that the biometric is coming from a live, present person — using 3D depth (structured light), micro-movements, blood flow, or a challenge like "turn your head." Without liveness, a stolen photo or a silicone fingerprint mold could break in.',
        takeaway: 'A picture of you is not you. Liveness proves the difference.',
      },
      {
        title: 'Where your biometric is stored',
        body: 'Your fingerprint and face data never leave your device\'s secure enclave — a hardware-isolated chip encrypted with a key only your phone can generate. BioPay only sends a one-time cryptographic proof that the scan matched, never the scan itself. So even if a server is breached, your biometric can\'t be stolen.',
        takeaway: 'Your fingerprint is never sent anywhere. Only a "yes it matched" proof is.',
      },
      {
        title: 'The duress finger concept',
        body: 'A duress finger is a biometric you register specifically for emergencies. If someone forces you to pay, scanning it looks normal to the attacker but silently alerts police, hides your real balance, and fakes a decline. It works because an attacker can\'t tell which finger is the "real" one — they all look the same.',
        takeaway: 'To an attacker, every finger looks identical. That\'s the safety.',
      },
    ],
  },
  {
    id: 'compound',
    title: 'Compound Interest & Wealth Building',
    tagline: 'The eighth wonder of the world',
    Icon: TrendingUp,
    color: 'emeraldx',
    level: 'Intermediate',
    minutes: 6,
    lessons: [
      {
        title: 'Simple vs. compound interest',
        body: 'Simple interest pays you only on your original deposit. Compound interest pays you on your deposit AND on the interest you\'ve already earned — so your money grows faster every year. ₹10,000 at 8% simple interest = ₹18,000 after 10 years. The same at compound interest = ₹21,589. The gap explodes over longer periods.',
        takeaway: 'Compound interest means your interest earns its own interest.',
      },
      {
        title: 'The power of starting early',
        body: 'Person A invests ₹2,000/month from age 20 to 30 (₹2.4L total), then stops. Person B invests ₹2,000/month from age 30 to 60 (₹7.2L total). At retirement, Person A has MORE money — because their money had 10 extra years to compound. Time matters more than amount.',
        takeaway: 'Start early. Even a small amount beats a large amount started late.',
      },
      {
        title: 'The Rule of 72',
        body: 'A quick shortcut: divide 72 by your interest rate to find how many years it takes to double your money. At 8%, 72 ÷ 8 = 9 years to double. At 12%, 72 ÷ 12 = 6 years. This is why even a small difference in returns massively changes long-term wealth.',
        takeaway: '72 ÷ interest rate = years to double your money.',
      },
      {
        title: 'How Gullak feeds compounding',
        body: 'Your round-up savings sit in an interest-bearing wallet. So the ₹4,200/year from round-ups doesn\'t just sit there — it compounds. Over 10 years at 7%, that habit grows to ~₹60,000, of which nearly ₹18,000 is pure interest earned on your spare change.',
        takeaway: 'Round-ups + compounding = your spare change becomes an emergency fund.',
      },
    ],
  },
  {
    id: 'fraud',
    title: 'Payment Fraud & How to Spot It',
    tagline: 'The scams that kill OTP — and why biometrics survive',
    Icon: AlertTriangle,
    color: 'coralx',
    level: 'Beginner',
    minutes: 5,
    lessons: [
      {
        title: 'The OTP forward scam',
        body: 'A scammer calls pretending to be from your bank or a delivery service. They create urgency ("your account will be blocked!") and ask you to read the OTP you just received. The moment you do, they complete a transaction on your account. The OTP was never meant for you — it was for their transfer.',
        takeaway: 'No legitimate bank employee will ever ask for your OTP. Ever.',
      },
      {
        title: 'Fake APK / screen-mirror attacks',
        body: 'Scammers send a link to "update your UPI app" or install a "support tool." The fake app requests permission to read SMS and screen contents — so it silently captures every OTP and PIN you enter. Screen-mirroring apps like AnyDesk are abused the same way.',
        takeaway: 'Never install an app a stranger sends you. Read SMS permissions carefully.',
      },
      {
        title: 'SIM swap / port-out fraud',
        body: 'A scammer uses your stolen ID details to convince your mobile operator to port your number to a new SIM they control. Now they receive your OTPs directly — you don\'t even know your phone lost service. This is why OTP-only auth is fragile: it trusts whoever holds the SIM.',
        takeaway: 'Your OTP is only as safe as your SIM card. Which isn\'t very safe.',
      },
      {
        title: 'Why biometrics break these attacks',
        body: 'Every attack above works by stealing a secret that can be forwarded — a number, a code, an SMS. Biometrics can\'t be forwarded. There is no "fingerprint OTP" to read aloud. Even if a scammer has your phone, your SIM, and your passwords, they still can\'t pay without your physical, live presence.',
        takeaway: 'Biometrics close the one hole every OTP scam exploits: the secret can be copied.',
      },
    ],
  },
  {
    id: 'budgeting',
    title: 'Smart Budgeting & Money Management',
    tagline: 'The 50/30/20 rule and beyond',
    Icon: Wallet,
    color: 'skyx',
    level: 'Beginner',
    minutes: 4,
    lessons: [
      {
        title: 'The 50/30/20 rule',
        body: 'A simple framework: spend 50% of income on needs (rent, food, bills), 30% on wants (dining, entertainment), and 20% on savings & debt repayment. It\'s not about strict accounting — it\'s a sanity check. If your "needs" eat 70%, something has to give.',
        takeaway: '50% needs · 30% wants · 20% savings. Adjust until it fits.',
      },
      {
        title: 'Pay yourself first',
        body: 'Instead of saving whatever\'s left at month-end (usually nothing), move your savings out the day you get paid. Treat savings like a bill you owe yourself. Auto-round-ups and auto-SIPs do this for you invisibly — the money is gone before you can spend it.',
        takeaway: 'Save the moment money arrives, not the moment it\'s left over.',
      },
      {
        title: 'The emergency fund',
        body: 'Aim for 3-6 months of expenses in an easily accessible account. This is your shock absorber for job loss, medical bills, or urgent repairs — so you don\'t have to borrow at high interest or break long-term investments. Your Gullak is the first layer; a savings account is the second.',
        takeaway: '3-6 months of expenses, liquid. Before you invest a single rupee.',
      },
      {
        title: 'Good debt vs. bad debt',
        body: 'Good debt buys an asset that grows or earns — a home loan, an education loan. Bad debt buys something that loses value — most credit card spending on lifestyle. The test: will this still be worth more than I paid for it in 5 years? If not, pay cash or don\'t buy.',
        takeaway: 'Borrow for assets, never for lifestyle.',
      },
    ],
  },
  {
    id: 'upi',
    title: 'How UPI & Digital Payments Really Work',
    tagline: 'Behind the scenes of every scan-and-pay',
    Icon: Coins,
    color: 'emeraldx',
    level: 'Advanced',
    minutes: 6,
    lessons: [
      {
        title: 'What happens when you scan a QR code',
        body: 'When you scan a merchant\'s QR, your UPI app reads a virtual payment address (like merchant@okaxis). It doesn\'t send money to a bank account number — it sends a payment instruction to a NPCI switch, which routes it through your bank and the merchant\'s bank in real time. The whole thing settles in seconds.',
        takeaway: 'UPI is an instruction network, not a wallet. Banks move the money.',
      },
      {
        title: 'Where the OTP/PIN fits in',
        body: 'To approve a UPI payment, you enter a UPI PIN — a 4 or 6 digit code that proves you authorized the transaction. The problem: like an OTP, it\'s a number you know. If someone watches you type it, or a fake app logs your keystrokes, they can pay as you. BioPay replaces this PIN with your biometric.',
        takeaway: 'A PIN is a secret. A biometric is a presence. BioPay swaps one for the other.',
      },
      {
        title: 'Settlement and reconciliation',
        body: 'Even though the payment feels instant, banks settle the actual money movement in batches through NPCI at the end of the day. For merchants, this means the payment is "approved" in seconds but the funds land in their account on a settlement cycle. BioPay POS works the same way — the biometric approval is instant, settlement follows.',
        takeaway: 'Instant approval ≠ instant settlement. The backend is batched.',
      },
      {
        title: 'Why biometrics plug in cleanly',
        body: 'Biometric auth sits at the "approve the transaction" step — it replaces the PIN/OTP, nothing else. The UPI rails, the NPCI switch, the bank settlement all stay the same. That\'s why BioPay can work with existing bank accounts and merchant infrastructure without rebuilding the whole payment system.',
        takeaway: 'Biometrics replace the PIN layer only. The payment rails stay unchanged.',
      },
    ],
  },
];

const levelStyle: Record<Module['level'], string> = {
  Beginner: 'bg-emeraldx-500/15 text-emeraldx-400',
  Intermediate: 'bg-skyx-500/15 text-skyx-400',
  Advanced: 'bg-amberx-500/15 text-amberx-400',
};

const colorMap: Record<string, { bg: string; text: string; ring: string; grad: string }> = {
  emeraldx: { bg: 'bg-emeraldx-500/15', text: 'text-emeraldx-400', ring: 'ring-emeraldx-500/30', grad: 'from-emeraldx-500/20' },
  skyx: { bg: 'bg-skyx-500/15', text: 'text-skyx-400', ring: 'ring-skyx-500/30', grad: 'from-skyx-500/20' },
  coralx: { bg: 'bg-coralx-500/15', text: 'text-coralx-400', ring: 'ring-coralx-500/30', grad: 'from-coralx-500/20' },
};

export default function LearnView() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const active = modules.find((m) => m.id === activeId) ?? null;

  const open = (m: Module) => {
    sfx('whoosh');
    setActiveId(m.id);
    setLessonIdx(0);
  };

  const close = () => {
    if (active) {
      if (lessonIdx >= active.lessons.length - 1) {
        setCompleted((c) => new Set(c).add(active.id));
      }
    }
    sfx('whoosh');
    setActiveId(null);
  };

  const next = () => {
    if (!active) return;
    sfx('beep');
    if (lessonIdx < active.lessons.length - 1) {
      setLessonIdx((i) => i + 1);
    } else {
      setCompleted((c) => new Set(c).add(active.id));
      sfx('success');
      setActiveId(null);
    }
  };

  const progress = Math.round((completed.size / modules.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-emeraldx-500/15 px-4 py-1.5 text-sm font-600 text-emeraldx-400 ring-1 ring-emeraldx-500/30">
          <GraduationCap className="h-4 w-4" /> Learning Space
        </div>
        <h1 className="mt-4 font-display text-3xl font-700 tracking-tight sm:text-4xl">
          Master your money, <span className="text-emeraldx-400">one lesson at a time</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Bite-sized, jargon-free modules on savings, biometric security, budgeting, and how digital payments really
          work. Each lesson takes 4-6 minutes and ends with a single takeaway you'll actually remember.
        </p>

        {/* progress */}
        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <Award className="h-8 w-8 shrink-0 text-emeraldx-400" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-600 text-white">Your progress</span>
              <span className="text-slate-400">{completed.size}/{modules.length} modules · {progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-emeraldx-400 to-emeraldx-600 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Module grid */}
      {!active && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => {
            const c = colorMap[m.color];
            const done = completed.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => open(m)}
                className="no-tap group animate-fade-up relative overflow-hidden rounded-3xl bg-ink-700/60 p-5 text-left ring-1 ring-white/10 backdrop-blur transition-all hover:ring-white/20"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${c.grad} to-transparent blur-2xl`} />
                <div className="relative flex items-start justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${c.bg} ${c.text}`}>
                    <m.Icon className="h-6 w-6" />
                  </div>
                  {done && (
                    <span className="flex items-center gap-1 rounded-full bg-emeraldx-500/20 px-2 py-0.5 text-[10px] font-700 uppercase text-emeraldx-400">
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </span>
                  )}
                </div>
                <h3 className="relative mt-4 font-display text-base font-700 leading-snug">{m.title}</h3>
                <p className="relative mt-1 text-xs text-slate-400">{m.tagline}</p>
                <div className="relative mt-4 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-700 uppercase tracking-wide ${levelStyle[m.level]}`}>{m.level}</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Brain className="h-3 w-3" /> {m.lessons.length} lessons · {m.minutes} min
                  </span>
                </div>
                <div className="relative mt-4 flex items-center gap-1 text-xs font-600 text-slate-300 transition-colors group-hover:text-white">
                  Start module <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Lesson reader */}
      {active && (
        <LessonReader
          module={active}
          idx={lessonIdx}
          onNext={next}
          onPrev={() => lessonIdx > 0 && (sfx('tap'), setLessonIdx((i) => i - 1))}
          onClose={close}
        />
      )}

      {/* Quick tips strip */}
      {!active && (
        <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-skyx-500/10 to-ink-700 p-6 ring-1 ring-white/10">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amberx-400" />
            <h3 className="font-display text-lg font-700">Quick tips you can use today</h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { Icon: Zap, t: 'Turn on round-ups', d: 'Enable auto round-up in your Gullak. It\'s the easiest ₹4,000/year you\'ll ever save.' },
              { Icon: Target, t: 'Set one savings goal', d: 'Pick a number — an emergency fund of 1 month\'s expenses. Aim there first.' },
              { Icon: Lock, t: 'Never share an OTP', d: 'No bank, no delivery agent, no "verification" ever needs your OTP. Hang up.' },
              { Icon: Percent, t: 'Know your interest rate', d: 'Credit cards charge 36-42%/year. Pay the full bill, always. The minimum due is a trap.' },
            ].map((tip) => (
              <div key={tip.t} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amberx-500/15 text-amberx-400">
                  <tip.Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-600 text-white">{tip.t}</div>
                  <div className="mt-0.5 text-xs leading-relaxed text-slate-400">{tip.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LessonReader({
  module: mod,
  idx,
  onNext,
  onPrev,
  onClose,
}: {
  module: Module;
  idx: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const lesson = mod.lessons[idx];
  const c = colorMap[mod.color];
  const isLast = idx >= mod.lessons.length - 1;

  return (
    <div className="animate-pop-in overflow-hidden rounded-3xl bg-ink-700/80 ring-1 ring-white/10 backdrop-blur">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${c.bg} ${c.text}`}>
            <mod.Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-700">{mod.title}</div>
            <div className="text-[11px] text-slate-400">Lesson {idx + 1} of {mod.lessons.length}</div>
          </div>
        </div>
        <button onClick={onClose} className="no-tap rounded-lg bg-white/5 px-3 py-1.5 text-xs font-600 text-slate-300 ring-1 ring-white/10 hover:bg-white/10">
          Exit
        </button>
      </div>

      {/* progress dots */}
      <div className="flex gap-1.5 px-5 pt-4">
        {mod.lessons.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= idx ? c.text.replace('text', 'bg') : 'bg-white/10'}`} />
        ))}
      </div>

      {/* content */}
      <div className="p-6">
        <h2 className="font-display text-xl font-700 leading-snug sm:text-2xl">{lesson.title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-[15px]">{lesson.body}</p>

        {/* takeaway */}
        <div className={`mt-5 flex items-start gap-3 rounded-2xl ${c.bg} p-4 ring-1 ${c.ring}`}>
          <Lightbulb className={`mt-0.5 h-5 w-5 shrink-0 ${c.text}`} />
          <div>
            <div className={`text-xs font-700 uppercase tracking-wider ${c.text}`}>Key takeaway</div>
            <div className="mt-1 text-sm font-600 text-white">{lesson.takeaway}</div>
          </div>
        </div>
      </div>

      {/* nav */}
      <div className="flex items-center justify-between border-t border-white/5 p-5">
        <button
          onClick={onPrev}
          disabled={idx === 0}
          className="no-tap rounded-xl bg-white/5 px-4 py-2.5 text-sm font-600 text-slate-300 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-xs text-slate-500">{idx + 1} / {mod.lessons.length}</span>
        <button
          onClick={onNext}
          className="no-tap inline-flex items-center gap-2 rounded-xl bg-emeraldx-500 px-5 py-2.5 text-sm font-700 text-ink-900 shadow-glow transition-all hover:bg-emeraldx-400 active:scale-95"
        >
          {isLast ? <>Complete <Award className="h-4 w-4" /></> : <>Next <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </div>
  );
}
