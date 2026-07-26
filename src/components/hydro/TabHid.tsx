import { useMemo, useState } from "react";
import { Boxes, Calculator, LayoutTemplate } from "lucide-react";
import {
  ActionButton,
  Field,
  Metric,
  Panel,
  SelectInput,
  Tag,
  TextInput,
} from "./primitives";
import { FIXTURES, fmt } from "@/lib/hydro-data";

import { runRevitScript } from "@/lib/revit-api";

export function TabHid() {
  const [loading, setLoading] = useState<string | null>(null);
  const [pavimentos, setPavimentos] = useState(3);
  const [percapita, setPercapita] = useState(150);
  const [habitantes, setHabitantes] = useState(12);
  const [dias, setDias] = useState(2);
  const [tipo, setTipo] = useState("Recalque (inferior + superior)");

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

  const calc = useMemo(() => {
    const consumoDiario = percapita * habitantes;
    const volumeUtil = consumoDiario * dias;
    const somaPesos = FIXTURES.reduce((a, f) => a + f.peso * f.qtd, 0);
    const vazao = 0.3 * Math.sqrt(somaPesos);
    const diametro = Math.ceil((Math.sqrt((4 * (vazao / 1000)) / (Math.PI * 2.5)) * 1000) / 5) * 5;
    return { consumoDiario, volumeUtil, somaPesos, vazao, diametro };
  }, [percapita, habitantes, dias]);

  let acumulado = 0;

  return (
    <div className="tab-enter flex flex-col gap-5">
      <Panel
        title="Configuração do Projeto"
        subtitle="Parâmetros gerais de entrada — NBR 5626 / NBR 7198"
        right={<Tag tone="accent">HID</Tag>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Nome do Projeto">
            <TextInput defaultValue="Residência Unifamiliar Barreiro" />
          </Field>
          <Field label="Proprietário / Cliente">
            <TextInput defaultValue="Thayná Barreiro" />
          </Field>
          <Field label="Cidade (BR / FR)">
            <SelectInput defaultValue="Porto Alegre — BR">
              <option>Porto Alegre — BR</option>
              <option>São Paulo — BR</option>
              <option>Paris — FR</option>
              <option>Lyon — FR</option>
            </SelectInput>
          </Field>
          <Field label="Pavimentos">
            <TextInput
              type="number"
              min={1}
              value={pavimentos}
              onChange={(e) => setPavimentos(Number(e.target.value))}
            />
          </Field>
          <Field label="Habitantes (N)">
            <TextInput
              type="number"
              min={1}
              value={habitantes}
              onChange={(e) => setHabitantes(Number(e.target.value))}
            />
          </Field>
          <Field label="Consumo per capita" hint="L/hab.dia">
            <TextInput
              type="number"
              value={percapita}
              onChange={(e) => setPercapita(Number(e.target.value))}
            />
          </Field>
          <Field label="Reservação (dias)">
            <TextInput
              type="number"
              step="0.5"
              value={dias}
              onChange={(e) => setDias(Number(e.target.value))}
            />
          </Field>
          <Field label="Tipo de Reservação">
            <SelectInput value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option>Gravidade (superior único)</option>
              <option>Recalque (inferior + superior)</option>
            </SelectInput>
          </Field>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Consumo Diário Total"
          value={calc.consumoDiario}
          unit="L/dia"
          tone="accent"
        />
        <Metric
          label="Volume Útil Reservatório"
          value={calc.volumeUtil}
          unit="L"
          tone="amber"
          note={tipo.startsWith("Recalque") ? "60% inferior / 40% superior" : "100% superior"}
        />
        <Metric label="Vazão de Projeto" value={calc.vazao} unit="L/s" tone="emerald" note="Q = 0,3·√ΣP" />
        <Metric label="Diâmetro Barrilete" value={calc.diametro} unit="mm" tone="plain" note="v ≤ 3,0 m/s" />
      </div>

      <Panel
        title="Dimensionamento por Peça — NBR 5626"
        subtitle={`ΣP total = ${fmt(calc.somaPesos)} · método dos pesos relativos`}
        right={<Tag>Validado</Tag>}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-medium">Peça</th>
                <th className="pb-3 text-right font-medium">Qtd</th>
                <th className="pb-3 text-right font-medium">Peso Acum. (ΣP)</th>
                <th className="pb-3 text-right font-medium">Vazão (L/s)</th>
                <th className="pb-3 text-right font-medium">DN Adotado</th>
              </tr>
            </thead>
            <tbody>
              {FIXTURES.map((f) => {
                acumulado += f.peso * f.qtd;
                const q = 0.3 * Math.sqrt(acumulado);
                return (
                  <tr
                    key={f.peca}
                    className="border-t border-border/70 transition-colors hover:bg-surface-2/50"
                  >
                    <td className="py-2.5 pr-4">{f.peca}</td>
                    <td className="py-2.5 text-right tabular-nums">{f.qtd}</td>
                    <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                      {fmt(acumulado)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-primary">{fmt(q)}</td>
                    <td className="py-2.5 text-right tabular-nums font-semibold">{f.dn} mm</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <ActionButton
          icon={<Calculator className="h-4 w-4" />}
          disabled={loading !== null}
          onClick={() => handleAction("m2_dimensionamento.py", "Dimensionamento AF/AQ")}
        >
          {loading === "Dimensionamento AF/AQ" ? "Calculando..." : "Calcula & Dimensiona AF/AQ"}
        </ActionButton>
        <ActionButton
          variant="emerald"
          icon={<Boxes className="h-4 w-4" />}
          disabled={loading !== null}
          onClick={() => handleAction("m6g_rede_final.py", "Modelagem 3D AF/AQ")}
        >
          {loading === "Modelagem 3D AF/AQ" ? "Gerando 3D..." : "Gera Rede 3D Ortogonal no Revit"}
        </ActionButton>
        <ActionButton
          variant="secondary"
          icon={<LayoutTemplate className="h-4 w-4" />}
          disabled={loading !== null}
          onClick={() => handleAction("m7_gerar_pranchas.py", "Geração de Pranchas")}
        >
          {loading === "Geração de Pranchas" ? "Gerando Pranchas..." : "Gera Pranchas A4 por Ambiente"}
        </ActionButton>
        <p className="text-xs text-muted-foreground">
          Curvas a 90° · descidas de parede · Banheiro / Lavanderia / Cobertura
        </p>
      </div>
    </div>
  );
}
