import { useMemo, useState } from "react";
import { Boxes, Calculator, LayoutTemplate } from "lucide-react";
import { ActionButton, Field, Metric, Panel, SelectInput, Tag, Toggle } from "./primitives";
import { FIXTURES } from "@/lib/hydro-data";

export function TabEsg() {
  const [slope, setSlope] = useState("1,0% — DN 100 (coletor / prumada)");
  const [shaft, setShaft] = useState(true);

  const uhc = useMemo(() => FIXTURES.reduce((a, f) => a + f.uhc * f.qtd, 0), []);
  const gordura = 2 * 4 * 20 + 20;

  return (
    <div className="tab-enter flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total de UHC" value={uhc} unit="UHC" tone="accent" note="NBR 8160 Tab. 3" />
        <Metric label="Prumada de Esgoto" value="DN 100" unit="mm" tone="amber" note="PVC série normal" />
        <Metric label="Coluna de Ventilação" value="DN 75" unit="mm" tone="emerald" note="Ventilação primária" />
        <Metric label="Caixa de Gordura" value={gordura} unit="L" tone="plain" note="CGD dupla — NBR 8160" />
      </div>

      <Panel
        title="Controles de Roteamento por Gravidade"
        subtitle="Declividades mínimas e estratégia de prumadas"
        right={<Tag tone="accent">ESG</Tag>}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="Declividade adotada" hint="Coletores e sub-coletores">
            <SelectInput value={slope} onChange={(e) => setSlope(e.target.value)}>
              <option>1,0% — DN 100 (coletor / prumada)</option>
              <option>2,0% — DN 50 / 40 (ramais de descarga)</option>
              <option>3,0% — DN 40 (ramal de lavatório)</option>
            </SelectInput>
          </Field>
          <Toggle
            checked={shaft}
            onChange={setShaft}
            label="Priorizar Shaft do edifício"
            description="Passar prumadas de esgoto e ventilação pelo shaft técnico vertical"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { dn: "DN 40", uso: "Lavatório / Bidê", decl: "3,0%" },
            { dn: "DN 50", uso: "Pia / Tanque / Ralo", decl: "2,0%" },
            { dn: "DN 100", uso: "Bacia / Prumada / Coletor", decl: "1,0%" },
          ].map((r) => (
            <div key={r.dn} className="rounded-xl border border-border bg-surface/60 p-4">
              <p className="font-display text-lg font-semibold text-primary">{r.dn}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.uso}</p>
              <p className="mt-2 text-xs font-semibold text-amber">i = {r.decl}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <ActionButton icon={<Calculator className="h-4 w-4" />}>Calcula Esgoto NBR 8160</ActionButton>
        <ActionButton variant="emerald" icon={<Boxes className="h-4 w-4" />}>
          Gera Rede 3D por Gravidade no Revit
        </ActionButton>
        <ActionButton variant="secondary" icon={<LayoutTemplate className="h-4 w-4" />}>
          Pranchas de Detalhes ESG
        </ActionButton>
        <p className="text-xs text-muted-foreground">Cozinha 04/001 · Banheiro 08/001</p>
      </div>
    </div>
  );
}
