import { useMemo, useState } from "react";
import { Boxes, Calculator, Search } from "lucide-react";
import { ActionButton, Field, Metric, Panel, Tag, TextInput } from "./primitives";
import { CITIES, fmt, type Country } from "@/lib/hydro-data";

export function TabPluv() {
  const [country, setCountry] = useState<Country>("BR");
  const [query, setQuery] = useState("Porto Alegre");
  const [city, setCity] = useState("Porto Alegre");
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState(150);

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
        title="Motor Pluviométrico"
        subtitle="NBR 10844 (Brasil) · DTU 60.11 (França)"
        right={<Tag tone="accent">PLUV</Tag>}
      >
        <div className="mb-4 inline-flex rounded-xl border border-border bg-surface/60 p-1">
          {(
            [
              { c: "BR" as const, label: "🇧🇷 Brasil · NBR 10844" },
              { c: "FR" as const, label: "🇫🇷 França · DTU 60.11" },
            ]
          ).map((o) => (
            <button
              key={o.c}
              type="button"
              onClick={() => swap(o.c)}
              className={
                "rounded-lg px-4 py-2 text-sm font-medium transition-all " +
                (country === o.c
                  ? "bg-primary text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)]"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="relative">
            <Field label="Cidade (autocomplete)" hint={`${CITIES.filter((c) => c.country === country).length} cidades disponíveis`}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <TextInput
                  className="pl-9"
                  value={query}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 150)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  }}
                  placeholder="Buscar cidade…"
                />
              </div>
            </Field>
            {open && list.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-panel)]">
                {list.map((c) => (
                  <li key={c.name}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setCity(c.name);
                        setQuery(c.name);
                        setOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-surface-2"
                    >
                      <span>{c.name}</span>
                      <span className="text-xs text-muted-foreground">{fmt(c.i, 1)} mm/h</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Field label="Área de contribuição" hint="Cobertura projetada (m²)">
            <TextInput type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} />
          </Field>
          <Field label="Norma aplicada">
            <div className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-muted-foreground">
              {country === "BR" ? "NBR 10844 — T=5 anos, t=5 min" : "DTU 60.11 — pluie de projet"}
            </div>
          </Field>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Intensidade IDF (i)" value={current.i} unit="mm/h" tone="accent" note={current.name} />
        <Metric label="Vazão de Projeto (Q)" value={Q} unit="L/s" tone="emerald" note="Q = i · A / 3600" />
        <Metric
          label="Condutores Verticais"
          value={`${condutores} x DN 100`}
          unit="mm"
          tone="amber"
        />
        <Metric label="Coletor Enterrado" value="DN 150" unit="mm" tone="plain" note="i = 1,0%" />
      </div>

      <Panel
        title="Tratamento de Esgoto no Lote"
        subtitle="NBR 7229 / NBR 13969 — V = 1000 + N(CT + K·Lf)"
        right={<Tag tone="amber">TRAT</Tag>}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              t: "Fossa Séptica",
              v: "2000 L",
              d: "Câmara única · DN 1500mm × h 2,00m",
              n: "V = 1000 + N(CT + K·Lf)",
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
        <ActionButton icon={<Calculator className="h-4 w-4" />}>Calcula Pluvial & Tratamento</ActionButton>
        <ActionButton variant="emerald" icon={<Boxes className="h-4 w-4" />}>
          Gera Condutores e Fossa no Revit
        </ActionButton>
      </div>
    </div>
  );
}
