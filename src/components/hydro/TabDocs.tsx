import { useState } from "react";
import { FileCode2, FileDown, FileText } from "lucide-react";
import { ActionButton, Panel, Tag } from "./primitives";
import { runRevitScript } from "@/lib/revit-api";

const DOCS = [
  {
    id: "m8_memorial.py",
    t: "Memorial Hidráulico",
    n: "NBR 5626 / NBR 7198",
    items: ["Consumo e reservação", "Barrilete e colunas", "Água quente e retorno"],
  },
  {
    id: "m8_memorial_esg.py",
    t: "Memorial Sanitário",
    n: "NBR 8160",
    items: ["UHC e prumadas", "Ventilação primária", "Caixas e tratamento"],
  },
  {
    id: "m8_memorial_pluv.py",
    t: "Memorial Pluvial",
    n: "NBR 10844 / DTU 60.11",
    items: ["Intensidade IDF", "Calhas e condutores", "Coletor enterrado"],
  },
];

export function TabDocs() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (script: string, desc: string) => {
    setLoading(desc);
    const res = await runRevitScript(script, desc);
    setLoading(null);
    if (res.status === "success") {
      alert(`✅ ${desc} gerado com sucesso!\n\n` + res.output);
    } else {
      alert(`⚠️ Aviso ao gerar ${desc}:\n` + (res.error || res.output));
    }
  };

  return (
    <div className="tab-enter flex flex-col gap-5">
      <Panel
        title="Exportador de Documentos"
        subtitle="Pré-visualização ao vivo dos memoriais de cálculo (HTML, PDF e DOCX)"
        right={<Tag tone="accent">DOC</Tag>}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {DOCS.map((d) => (
            <article
              key={d.t}
              className="glow-hover overflow-hidden rounded-xl border border-border bg-surface/60 flex flex-col justify-between"
            >
              <div className="border-b border-border bg-[oklch(0.24_0_0)] p-6 text-white">
                <div className="rounded-sm border-2 border-white/80 p-5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">
                    Memorial de Cálculo
                  </p>
                  <p className="mt-3 font-display text-lg font-semibold">{d.t}</p>
                  <p className="mt-1 text-[11px] text-white/60">{d.n}</p>
                  <p className="mt-6 text-[11px] text-white/70">Proprietária</p>
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
              <div className="p-4 pt-0">
                <button
                  type="button"
                  disabled={loading !== null}
                  onClick={() => handleAction(d.id, d.t)}
                  className="w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading === d.t ? "Gerando..." : `Gerar ${d.t}`}
                </button>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <ActionButton
          variant="emerald"
          icon={<FileCode2 className="h-4 w-4" />}
          disabled={loading !== null}
          onClick={() => handleAction("m8_memorial.py", "Todos os Memoriais")}
        >
          {loading === "Todos os Memoriais" ? "Gerando..." : "Gerar Todos os Memoriais (HTML, PDF, DOCX)"}
        </ActionButton>
        <p className="text-xs text-muted-foreground">
          Capa em tema grafite com moldura branca e dados dinâmicos do proprietário
        </p>
      </div>
    </div>
  );
}
