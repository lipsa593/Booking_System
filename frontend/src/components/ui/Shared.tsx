import type { ReactNode } from 'react';
import { Flower2, Heart } from 'lucide-react';

type MetricProps = { label: string; value: string; note: string };
type EmptyStateProps = { title: string; copy: string; action?: ReactNode };

export function Metric({ label, value, note }: MetricProps) {
  return <div className="metric-card card"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

export function StatusBadge({ status }: { status: string }) {
  const text = status === 'checked-in'
    ? 'Checked in'
    : status === 'no-show'
      ? 'No show'
      : status === 'reassignment-required'
        ? 'Reassignment required'
        : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`status-badge status-${status}`}>{text}</span>;
}

export function EmptyState({ title, copy, action }: EmptyStateProps) {
  return <div className="empty-state"><div><Heart size={21} /></div><h3 className="serif">{title}</h3><p>{copy}</p>{action}</div>;
}

export function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <main className="wrap not-found">
      <div className="empty-state">
        <div><Flower2 size={22} /></div>
        <p className="eyebrow">OH, THIS IS A QUIET CORNER</p>
        <h1 className="serif">Nothing here just yet.</h1>
        <button className="btn" onClick={onBack}>Back to the studio</button>
      </div>
    </main>
  );
}
