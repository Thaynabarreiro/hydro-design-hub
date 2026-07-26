import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass glow-hover rounded-2xl p-5", className)}>
      {(title || right) && (
        <header className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-base font-semibold tracking-tight">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

const controlCls =
  "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring/30";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlCls, props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(controlCls, "appearance-none", props.className)} />;
}

export function Metric({
  label,
  value,
  unit,
  tone = "accent",
  note,
}: {
  label: string;
  value: number | string;
  unit?: string;
  tone?: "accent" | "amber" | "emerald" | "plain";
  note?: string;
}) {
  const toneCls = {
    accent: "text-primary",
    amber: "text-amber",
    emerald: "text-emerald",
    plain: "text-foreground",
  }[tone];

  return (
    <div className="glow-hover rounded-xl border border-border bg-surface/60 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-2 font-display text-2xl font-semibold tabular-nums", toneCls)}>
        {typeof value === "number" ? <Counter value={value} /> : value}
        {unit && <span className="ml-1 text-xs font-medium text-muted-foreground">{unit}</span>}
      </p>
      {note && <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}

export function Counter({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    const dur = 600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const d = Number.isInteger(value) ? 0 : decimals;
  return (
    <>
      {display.toLocaleString("pt-BR", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      })}
    </>
  );
}

export function ActionButton({
  children,
  variant = "primary",
  icon,
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "amber" | "emerald" | "danger";
  icon?: ReactNode;
  onClick?: () => void;
}) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:shadow-[0_0_28px_-6px_var(--primary)] border-transparent",
    secondary: "bg-surface-2 text-foreground border-border hover:border-primary/50",
    amber:
      "bg-amber text-amber-foreground border-transparent hover:shadow-[0_0_28px_-6px_var(--amber)]",
    emerald:
      "bg-emerald text-emerald-foreground border-transparent hover:shadow-[0_0_28px_-6px_var(--emerald)]",
    danger:
      "bg-destructive text-destructive-foreground border-transparent hover:shadow-[0_0_28px_-6px_var(--destructive)]",
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
        variants,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function Tag({
  children,
  tone = "emerald",
}: {
  children: ReactNode;
  tone?: "emerald" | "amber" | "accent";
}) {
  const toneCls = {
    emerald: "border-emerald/40 bg-emerald/10 text-emerald",
    amber: "border-amber/40 bg-amber/10 text-amber",
    accent: "border-primary/40 bg-primary/10 text-primary",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        toneCls,
      )}
    >
      {children}
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-surface/60 p-4 text-left transition hover:border-primary/40"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-surface-2",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-foreground transition-all",
            checked ? "left-6" : "left-1",
          )}
        />
      </span>
    </button>
  );
}
