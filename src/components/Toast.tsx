import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type ToastKind = 'success' | 'info' | 'alert';
export type Toast = { id: number; kind: ToastKind; title: string; body?: string };

let counter = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((kind: ToastKind, title: string, body?: string) => {
    const id = ++counter;
    setToasts((t) => [...t, { id, kind, title, body }]);
    return id;
  }, []);

  const autoPush = useCallback(
    (kind: ToastKind, title: string, body?: string, ttl = 3600) => {
      const id = push(kind, title, body);
      setTimeout(() => dismiss(id), ttl);
      return id;
    },
    [push, dismiss],
  );

  return { toasts, push, autoPush, dismiss };
}

export function ToastStack({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[calc(100vw-3rem)] max-w-sm flex-col gap-2.5 sm:w-96">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onClose={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { Icon: CheckCircle2, ring: 'ring-emeraldx-500/40', bar: 'bg-emeraldx-500', text: 'text-emeraldx-400' },
    info: { Icon: Info, ring: 'ring-skyx-500/40', bar: 'bg-skyx-500', text: 'text-skyx-400' },
    alert: { Icon: AlertTriangle, ring: 'ring-coralx-500/40', bar: 'bg-coralx-500', text: 'text-coralx-400' },
  }[toast.kind];
  const Icon = config.Icon;

  return (
    <div
      className={`pointer-events-auto animate-pop-in overflow-hidden rounded-2xl bg-ink-700/95 p-0 shadow-card ring-1 ${config.ring} backdrop-blur-xl`}
    >
      <div className={`h-1 w-full ${config.bar}`} />
      <div className="flex items-start gap-3 p-4">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.text}`} />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-600 text-white">{toast.title}</div>
          {toast.body && <div className="mt-0.5 text-xs leading-relaxed text-slate-400">{toast.body}</div>}
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Popup({
  open,
  onClose,
  children,
  maxW = 'max-w-md',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxW?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`animate-pop-in relative w-full ${maxW} rounded-3xl bg-ink-700 p-6 shadow-card ring-1 ring-white/10`}>
        {children}
      </div>
    </div>
  );
}
