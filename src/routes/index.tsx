import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NAV_ITEMS, Sidebar, type TabId } from "@/components/hydro/Sidebar";
import { TabHid } from "@/components/hydro/TabHid";
import { TabEsg } from "@/components/hydro/TabEsg";
import { TabPluv } from "@/components/hydro/TabPluv";
import { TabPump } from "@/components/hydro/TabPump";
import { TabBcl } from "@/components/hydro/TabBcl";
import { TabDocs } from "@/components/hydro/TabDocs";

const TITLE = "Revit Hydro Designer — Projeto Hidrossanitário BIM";
const DESC =
  "Painel BIM para dimensionamento hidráulico, sanitário e pluvial conforme NBR 5626, 7198, 8160, 10844 e DTU 60.11, integrado ao Revit.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<TabId>("hid");
  const [project, setProject] = useState("Residência Unifamiliar — Porto Alegre");
  const current = NAV_ITEMS.find((n) => n.id === tab)!;

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <Sidebar active={tab} onSelect={setTab} project={project} onProjectChange={setProject} />

      <main className="min-w-0 flex-1 p-5 lg:p-8">
        <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              {current.code}
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {current.label}
            </h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">{project}</p>
          </div>
          <span className="shrink-0 rounded-xl border border-border bg-surface/60 px-3 py-2 text-xs text-muted-foreground">
            Sidecar Dockable Panel
          </span>
        </header>

        {tab === "hid" && <TabHid />}
        {tab === "esg" && <TabEsg />}
        {tab === "pluv" && <TabPluv />}
        {tab === "bomba" && <TabPump />}
        {tab === "bcl" && <TabBcl />}
        {tab === "docs" && <TabDocs />}
      </main>
    </div>
  );
}
