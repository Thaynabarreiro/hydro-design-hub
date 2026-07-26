import { useMemo, useState } from "react";
import { Calculator, Zap } from "lucide-react";
import { ActionButton, Field, Metric, Panel, Tag, TextInput } from "./primitives";
import { fmt } from "@/lib/hydro-data";
import { runRevitScript } from "@/lib/revit-api";

export function TabPump() {
  const [loading, setLoading] = useState<string | null>(null);
  const [amt, setAmt] = useState(18);
  const [tempo, setTempo] = useState(1.5);
  const [volume, setVolume] = useState(1800);
  const [rend, setRend] = useState(55);

  const handleAction = async (script: string, desc: string) => {
    setLoading(desc);
    const res = await runRevitScript(script, desc);
    setLoading(null);
    if (res.status === "success") {
      alert(`✅ ${desc} concluído com sucesso no Revit!\n\n` + res.output);
    } else {
      alert(`⚠️ Aviso ao executar ${desc}:\n` + (res.error || res.output));
    }
  };

  const r = useMemo(() => {
    const vazaoLs = volume / (tempo * 3600);
    const potCV = (1000 * (vazaoLs / 1000) * amt) / (75 * (rend / 100));
    return { vazaoLs, potCV, potKW: potCV * 0.7355 };
  }, [volume, tempo, amt, rend]);

  return (
    <div className="tab-enter flex flex-col gap-5">
      <Panel
        title="Calculadora de Moto-Bomba de Recalque"
        subtitle="NBR 5626 — conjunto elevatório predial"
        right={<Tag tone="accent">REC</Tag>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Altura manométrica" hint="mca (geométrica + perdas)">
            <TextInput type="number" value={amt} onChange={(e) => setAmt(Number(e.target.value))} />
          </Field>
          <Field label="Tempo de enchimento" hint="horas">
            <TextInput
              type="number"
              step="0.25"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
            />
          </Field>
          <Field label="Volume superior" hint="litros">
            <TextInput
              type="number"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </Field>
          <Field label="Rendimento do conjunto" hint="%">
            <TextInput type="number" value={rend} onChange={(e) => setRend(Number(e.target.value))} />
          </Field>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric label="Vazão de Recalque" value={r.vazaoLs} unit="L/s" tone="accent" />
        <Metric label="AMT" value={amt} unit="mca" tone="amber" />
        <Metric
          label="Potência Calculada"
          value={r.potCV}
          unit="CV"
          tone="emerald"
          note={`${fmt(r.potKW)} kW · fator de serviço 1,5`}
        />
      </div>

      <Panel title="Modelo Comercial Selecionado" subtitle="Curva compatível com AMT × Q calculados">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-emerald/30 bg-emerald/10 p-5">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold text-emerald">
              Schneider BC-92S 0.50 CV
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sucção DN 25 · Recalque DN 25 · Monofásica 220V
            </p>
          </div>
          <Zap className="h-8 w-8 shrink-0 text-emerald" />
        </div>
      </Panel>

      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <ActionButton
          icon={<Calculator className="h-4 w-4" />}
          disabled={loading !== null}
          onClick={() => handleAction("m2_dimensionamento_bomba.py", "Dimensionamento Moto-Bomba")}
        >
          {loading === "Dimensionamento Moto-Bomba" ? "Calculando..." : "Dimensiona Conjunto Elevatório"}
        </ActionButton>
      </div>
    </div>
  );
}
