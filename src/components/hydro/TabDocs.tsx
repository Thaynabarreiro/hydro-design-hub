import { FileCode2, FileDown, FileText } from "lucide-react";
import { ActionButton, Panel, Tag } from "./primitives";

const DOCS = [
  {
    t: "Memorial Hidráulico",
    n: "NBR 5626 / NBR 7198",
    items: ["Consumo e reservação", "Barrilete e colunas", "Água quente e retorno"],
  },
  {
    t: "Memorial Sanitário",
    n: "NBR 8160",
    items: ["UHC e prumadas", "Ventilação primária", "Caixas e tratamento"],
  },
  {
    t: "Memorial Pluvial",
    n: "NBR 10844 / DTU 60.11",
    items: ["Intensidade IDF", "Calhas e condutores", "Coletor enterrado"],
  },
];

export function TabDocs() {
  return (
    <div className="tab-enter flex flex-col gap-5">
      <Panel
        title="Exportador de Documentos"
        subtitle="Pré-visualização ao vivo dos memoriais de cálculo"
        right={<Tag tone="accent">DOC</Tag>}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {DOCS.map((d) => (
            <article
              key={d.t}
              className="glow-hover overflow-hidden rounded-xl border border-border bg-surface/60"
            >
              <div className="border-b border-border bg-[oklch(0.24_0_0)] p-6">
                <div className="rounded-sm border-2 border-foreground/80 p-5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/70">
                    Memorial de Cálculo
                  </p>
                  <p className="mt-3 font-display text-lg font-semibold">{d.t}</p>
                  <p className="mt-1 text-[11px] text-foreground/60">{d.n}</p>
                  <p className="mt-6 text-[11px] text-foreground/70">Proprietária</p>
                  <p className="text-sm font-medium">Thayná Barreiro</p>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5 p-4">
                {d.items.map((i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    · {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Panel>

      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <ActionButton variant="danger" icon={<FileDown className="h-4 w-4" />}>
          Exportar PDF
        </ActionButton>
        <ActionButton icon={<FileText className="h-4 w-4" />}>Exportar DOCX (Word)</ActionButton>
        <ActionButton variant="emerald" icon={<FileCode2 className="h-4 w-4" />}>
          Abrir HTML Interativo
        </ActionButton>
        <p className="text-xs text-muted-foreground">
          Capa em tema grafite com moldura branca e nome do proprietário
        </p>
      </div>
    </div>
  );
}
