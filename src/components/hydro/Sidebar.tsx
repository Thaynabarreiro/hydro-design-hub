import { Droplets, Toilet, CloudRain, Zap, ScanSearch, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { id: "hid", label: "Água Fria & Quente", code: "HID", icon: Droplets },
  { id: "esg", label: "Esgoto & Ventilação", code: "ESG", icon: Toilet },
  { id: "pluv", label: "Pluvial & Tratamento", code: "PLUV / TRAT", icon: CloudRain },
  { id: "bomba", label: "Moto-Bomba & Recalque", code: "REC", icon: Zap },
  { id: "bcl", label: "Auditoria & Regras", code: "BCL", icon: ScanSearch },
  { id: "docs", label: "Memoriais & Exportação", code: "DOC", icon: FileText },
] as const;

export type TabId = (typeof NAV_ITEMS)[number]["id"];

export function Sidebar({
  active,
  onSelect,
  project,
  onProjectChange,
}: {
  active: TabId;
  onSelect: (id: TabId) => void;
  project: string;
  onProjectChange: (v: string) => void;
}) {
  return (
    <aside className="glass flex w-full shrink-0 flex-col gap-6 rounded-none border-y-0 border-l-0 p-5 lg:h-screen lg:w-[290px] lg:sticky lg:top-0">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
            <Droplets className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold uppercase tracking-[0.16em] accent-gradient-text">
              Hydro Designer
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              BIM · Hidrossanitário & Pluvial
            </p>
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Projeto ativo
          </span>
          <select
            value={project}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring/30"
          >
            <option>Residência Unifamiliar — Porto Alegre</option>
            <option>Edifício Aurora 12 Pav. — São Paulo</option>
            <option>Maison Lumière — Lyon (FR)</option>
          </select>
        </label>

        <div className="flex items-center gap-2 rounded-xl border border-emerald/30 bg-emerald/10 px-3 py-2">
          <span className="status-pulse h-2 w-2 shrink-0 rounded-full bg-emerald" />
          <span className="truncate text-xs font-semibold text-emerald">Revit 2027 Connected</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                isActive
                  ? "border-primary/50 bg-primary/12 shadow-[0_0_24px_-10px_var(--primary)]"
                  : "border-transparent hover:border-border hover:bg-surface-2/60",
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="min-w-0">
                <span
                  className={cn(
                    "block truncate text-sm font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
                <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                  {item.code}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <footer className="rounded-xl border border-amber/30 bg-amber/10 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber">
          Responsável Técnica
        </p>
        <p className="mt-1 truncate text-sm font-semibold">Thayná Barreiro</p>
        <p className="truncate text-[11px] text-muted-foreground">Engenharia · CREA ativo</p>
      </footer>
    </aside>
  );
}
