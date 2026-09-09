export function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="tabular-nums text-ink-soft">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-paper-3">
        <div
          className="h-full rounded-full bg-ink/80 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function AffectionBar({ value }: { value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted">好感</span>
        <span className="tabular-nums text-rose">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-paper-3">
        <div
          className="h-full rounded-full bg-rose transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
