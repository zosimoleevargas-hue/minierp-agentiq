import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, FolderCheck, ListTodo, AlertCircle, Users, UserCircle } from "lucide-react";
import { KPI_BAR_COLORS } from "@/lib/design-tokens";
import type { DashboardKPIs } from "../dashboard-data";

interface KpiItem {
  label: string;
  value: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  barColor: string;
}

const kpiDefs: KpiItem[] = [
  { label: "Proyectos activos",   value: 0, href: "/proyectos",  icon: FolderKanban, barColor: KPI_BAR_COLORS.proyectosActivos },
  { label: "Proyectos completados", value: 0, href: "/proyectos", icon: FolderCheck, barColor: KPI_BAR_COLORS.proyectosCompletados },
  { label: "Tareas pendientes",   value: 0, href: "/tareas",     icon: ListTodo, barColor: KPI_BAR_COLORS.tareasPendientes },
  { label: "Tareas vencidas",     value: 0, href: "/tareas",     icon: AlertCircle, barColor: KPI_BAR_COLORS.tareasVencidas },
  { label: "Total clientes",      value: 0, href: "/clientes",   icon: Users, barColor: KPI_BAR_COLORS.totalClientes },
  { label: "Empleados activos",   value: 0, href: "/empleados",  icon: UserCircle, barColor: KPI_BAR_COLORS.empleadosActivos },
];

export function KpiGrid({ kpis }: { kpis: DashboardKPIs }) {
  const kpiValueMap: Record<string, number> = {
    "Proyectos activos": kpis.proyectosActivos,
    "Proyectos completados": kpis.proyectosCompletados,
    "Tareas pendientes": kpis.tareasPendientes,
    "Tareas vencidas": kpis.tareasVencidas,
    "Total clientes": kpis.totalClientes,
    "Empleados activos": kpis.empleadosActivos,
  };

  const items: KpiItem[] = kpiDefs.map((def) => ({
    ...def,
    value: kpiValueMap[def.label] ?? 0,
  }));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.label} href={item.href} className="block">
            <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
              <div className={`h-[3px] w-full ${item.barColor}`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-muted-foreground text-sm font-medium">
                    {item.label}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tabular-nums">{item.value}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
