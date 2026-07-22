import { KpiGrid } from "@/modules/inicio/components/kpi-grid";
import { UltimosProyectos } from "@/modules/inicio/components/ultimos-proyectos";
import { ProximosVencimientos } from "@/modules/inicio/components/proximos-vencimientos";
import {
  getDashboardKPIs,
  getUltimosProyectos,
  getTareasConLimites,
} from "@/modules/inicio/dashboard-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [kpis, proyectos, tareas] = await Promise.all([
    getDashboardKPIs(),
    getUltimosProyectos(),
    getTareasConLimites(),
  ]);

  return (
    <div className="space-y-8">
      <KpiGrid kpis={kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        <UltimosProyectos proyectos={proyectos} />
        <ProximosVencimientos tareas={tareas} />
      </div>
    </div>
  );
}
