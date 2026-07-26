import { AlertTriangle, CheckCircle2, ScanSearch, XCircle } from "lucide-react";
import { ActionButton, Panel, Tag } from "./primitives";

const RULES = [
  {
    code: "BCL-001",
    rule: "Declividade mínima de coletores DN 100 ≥ 1,0%",
    status: "ok",
    norma: "NBR 8160",
  },
  {
    code: "BCL-002",
    rule: "Velocidade máxima em ramais de água fria ≤ 3,0 m/s",
    status: "ok",
    norma: "NBR 5626",
  },
  {
    code: "BCL-003",
    rule: "Pressão estática máxima em ponto de utilização ≤ 40 mca",
    status: "warn",
    norma: "NBR 5626",
  },
  {
    code: "BCL-004",
    rule: "Distância máxima entre caixas de inspeção ≤ 25 m",
    status: "ok",
    norma: "NBR 8160",
  },
  {
    code: "BCL-005",
    rule: "Condutor vertical pluvial sem redução de seção no percurso",
    status: "fail",
    norma: "NBR 10844",
  },
  {
    code: "BCL-006",
    rule: "Ventilação primária prolongada ≥ 30 cm acima da cobertura",
    status: "ok",
    norma: "NBR 8160",
  },
  {
    code: "BCL-007",
    rule: "Colisão tubulação × estrutura (clash hard) inexistente",
    status: "warn",
    norma: "BIM QA",
  },
];

const meta = {
  ok: { icon: CheckCircle2, cls: "text-emerald", label: "Conforme" },
  warn: { icon: AlertTriangle, cls: "text-amber", label: "Atenção" },
  fail: { icon: XCircle, cls: "text-destructive", label: "Não conforme" },
} as const;

export function TabBcl() {
  const ok = RULES.filter((r) => r.status === "ok").length;
  const warn = RULES.filter((r) => r.status === "warn").length;
  const fail = RULES.filter((r) => r.status === "fail").length;

  return (
    <div className="tab-enter flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { l: "Regras Conformes", v: ok, c: "text-emerald", b: "border-emerald/30 bg-emerald/10" },
          { l: "Pontos de Atenção", v: warn, c: "text-amber", b: "border-amber/30 bg-amber/10" },
          { l: "Não Conformidades", v: fail, c: "text-destructive", b: "border-destructive/30 bg-destructive/10" },
        ].map((s) => (
          <div key={s.l} className={`glow-hover rounded-xl border p-5 ${s.b}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {s.l}
            </p>
            <p className={`mt-2 font-display text-3xl font-semibold ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Auditoria de Regras BCL"
        subtitle="Verificação automática do modelo contra normas técnicas"
        right={<Tag tone="accent">BCL</Tag>}
      >
        <ul className="flex flex-col gap-2">
          {RULES.map((r) => {
            const m = meta[r.status as keyof typeof meta];
            const Icon = m.icon;
            return (
              <li
                key={r.code}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface/60 p-3.5 transition hover:border-primary/40"
              >
                <Icon className={`h-5 w-5 shrink-0 ${m.cls}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.rule}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {r.code} · {r.norma}
                  </p>
                </div>
                <span className={`shrink-0 text-xs font-semibold ${m.cls}`}>{m.label}</span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <ActionButton icon={<ScanSearch className="h-4 w-4" />}>Rodar Auditoria Completa</ActionButton>
        <ActionButton variant="secondary">Exportar Relatório de Não Conformidades</ActionButton>
      </div>
    </div>
  );
}
