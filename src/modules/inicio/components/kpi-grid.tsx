import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, FolderCheck, ListTodo, AlertCircle, Users, UserCircle } from "lucide-react";
import type { DashboardKPIs } from "../dashboard-data";

interface KpiItem {
  label: string;
  value: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  barColor: string;
}

const kpiDefs: KpiItem[] = [
  { label: "Proyectos activos",   value: 0, href: "/proyectos",  icon: FolderKanban, barColor: "bg-[oklch(0.62_0.1_190)]" },
  { label: "Proyectos completados", value: 0, href: "/proyectos", icon: FolderCheck, barColor: "bg-[oklch(0.55_0.1_150)]" },
  { label: "Tareas pendientes",   value: 0, href: "/tareas",     icon: ListTodo, barColor: "bg-[oklch(0.7_0.12_80)]" },
  { label: "Tareas vencidas",     value: 0, href: "/tareas",     icon: AlertCircle, barColor: "bg-[oklch(0.577_0.245_27.325)]" },
  { label: "Total clientes",      value: 0, href: "/clientes",   icon: Users, barColor: "bg-[oklch(0.55_0.08_240)]" },
  { label: "Empleados activos",   value: 0, href: "/empleados",  icon: UserCircle, barColor: "bg-[oklch(0.5_0.07_275)]" },
];

export function KpiGrid({ kpis }: { kpis: DashboardKPIs }) {
  const items: KpiItem[] = kpiDefs.map((def, i) => ({
    ...def,
    value: Object.values(kpis)[i],
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
