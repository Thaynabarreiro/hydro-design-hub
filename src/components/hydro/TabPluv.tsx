import { useMemo, useState } from "react";
import { Boxes, Calculator, Search, LayoutTemplate } from "lucide-react";
import { ActionButton, Field, Metric, Panel, Tag, TextInput } from "./primitives";
import { CITIES, fmt, type Country } from "@/lib/hydro-data";
import { runRevitScript } from "@/lib/revit-api";

export function TabPluv() {
  const [loading, setLoading] = useState<string | null>(null);
  const [country, setCountry] = useState<Country>("BR");
  const [query, setQuery] = useState("Porto Alegre");
  const [city, setCity] = useState("Porto Alegre");
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState(150);

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

  const list = useMemo(
    () =>
      CITIES.filter(
        (c) => c.country === country && c.name.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 8),
    [country, query],
  );

  const current = CITIES.find((c) => c.country === country && c.name === city) ?? CITIES[0];
  const Q = (current.i * area) / 3600;
  const condutores = Math.max(2, Math.ceil(Q / 4.5));

  const swap = (c: Country) => {
    setCountry(c);
    const first = CITIES.find((x) => x.country === c)!;
    setCity(first.name);
    setQuery(first.name);
  };

  return (
    <div className="tab-enter flex flex-col gap-5">
      <Panel
        title="Base Pluviométrica Internacional — Brasil (NBR 10844) & França (DTU 60.11)"
        subtitle="Selecione a cidade para carregar a intensidade pluviométrica i (mm/h)"
        right={<Tag tone="accent">{country === "BR" ? "🇧🇷 Brasil" : "🇫🇷 França"}</Tag>}
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => swap("BR")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              country === "BR" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:bg-surface-2"
            }`}
          >
            🇧🇷 Brasil (49 cidades)
          </button>
          <button
            type="button"
            onClick={() => swap("FR")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              country === "FR" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:bg-surface-2"
            }`}
          >
            🇫🇷 França (19 regiões)
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="Buscar Cidade / Região">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <TextInput
                className="pl-9"
                value={query}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
              />
              {open && list.length > 0 && (
                <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {list.map((c) => (
                    <li key={c.name}>
                      <button
                        type="button"
                        onClick={() => {
                          setCity(c.name);
                          setQuery(c.name);
                          setOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-surface-2"
                      >
                        {c.name} — <span className="text-primary">{c.i} mm/h</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Field>

          <Field label="Área de Contribuição (A)" hint="m²">
            <TextInput
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
            />
          </Field>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Intensidade Pluviométrica (i)"
          value={current.i}
          unit="mm/h"
          tone="accent"
          note={current.name}
        />
        <Metric label="Vazão de Projeto (Q)" value={Q} unit="L/s" tone="amber" note="Q = (i · A) / 3600" />
        <Metric
          label="Condutores Verticais"
          value={`${condutores}x DN 100`}
          unit="mm"
          tone="emerald"
          note="Vazão dividida por prumada"
        />
        <Metric label="Coletor Enterrado" value="DN 150" unit="mm" tone="plain" note="i = 0,5% declividade" />
      </div>

      <Panel
        title="Tratamento Esgoto no Lote — NBR 7229 / NBR 13969"
        subtitle="Dimensionamento de Fossa Séptica, Filtro Anaeróbio e Sumidouro"
        right={<Tag tone="amber">TRAT</Tag>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              t: "Fossa Séptica",
              v: "2000 L",
              d: "Prismática / Cilíndrica",
              n: "V = 1000 + N(CT + K Lf)",
            },
            {
              t: "Filtro Anaeróbio",
              v: "1000 L",
              d: "Brita nº 4 · h = 1,20 m",
              n: "Vf = 1,60 · N · C · T",
            },
            {
              t: "Sumidouro / Infiltração",
              v: "12,0 m²",
              d: "Cilíndrico DN 2000mm",
              n: "Taxa de infiltração do solo",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="glow-hover rounded-xl border border-border bg-surface/60 p-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {c.t}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-primary">{c.v}</p>
              <p className="mt-2 text-sm">{c.d}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{c.n}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <ActionButton
          icon={<Calculator className="h-4 w-4" />}
          disabled={loading !== null}
          onClick={() => handleAction("m2_dimensionamento_pluv.py", "Dimensionamento Pluvial")}
        >
          {loading === "Dimensionamento Pluvial" ? "Calculando..." : "Calcula Pluvial NBR 10844"}
        </ActionButton>

        <ActionButton
          variant="amber"
          icon={<Boxes className="h-4 w-4" />}
          disabled={loading !== null}
          onClick={() => handleAction("m2_dimensionamento_trat.py", "Dimensionamento Tratamento")}
        >
          {loading === "Dimensionamento Tratamento" ? "Calculando..." : "Dimensionar Tratamento (Fossa/Filtro)"}
        </ActionButton>

        <ActionButton
          variant="secondary"
          icon={<LayoutTemplate className="h-4 w-4" />}
          disabled={loading !== null}
          onClick={() => handleAction("m7_gerar_pranchas.py", "Pranchas Pluvial")}
        >
          {loading === "Pranchas Pluvial" ? "Gerando..." : "Gera Pranchas Pluvial/Cobertura"}
        </ActionButton>
      </div>
    </div>
  );
}
