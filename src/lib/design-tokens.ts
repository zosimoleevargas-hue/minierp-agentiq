export const PROYECTO_ESTADO_COLORS: Record<string, { bar: string; badge: string }> = {
  Planeado: { bar: "bg-blue-500", badge: "bg-blue-100 text-blue-800 border-transparent" },
  "En progreso": { bar: "bg-amber-500", badge: "bg-amber-100 text-amber-800 border-transparent" },
  Completado: { bar: "bg-green-500", badge: "bg-green-100 text-green-800 border-transparent" },
};

export const TAREA_ESTADO_COLORS: Record<string, { badge: string }> = {
  Pendiente: { badge: "bg-blue-100 text-blue-800 border-transparent" },
  "En progreso": { badge: "bg-amber-100 text-amber-800 border-transparent" },
  Completada: { badge: "bg-green-100 text-green-800 border-transparent" },
};

export const PRIORIDAD_COLORS: Record<string, { badge: string }> = {
  Alta: { badge: "bg-red-100 text-red-800 border-transparent" },
  Media: { badge: "bg-orange-100 text-orange-800 border-transparent" },
  Baja: { badge: "bg-slate-100 text-slate-700 border-transparent" },
};

export const KANBAN_COLORS: Record<string, { bg: string }> = {
  Pendiente: { bg: "bg-blue-50 border-blue-200" },
  "En progreso": { bg: "bg-amber-50 border-amber-200" },
  Completada: { bg: "bg-green-50 border-green-200" },
};

export const KPI_BAR_COLORS: Record<string, string> = {
  proyectosActivos: "bg-[oklch(0.62_0.1_190)]",
  proyectosCompletados: "bg-[oklch(0.55_0.1_150)]",
  tareasPendientes: "bg-[oklch(0.55_0.08_240)]",
  tareasVencidas: "bg-[oklch(0.577_0.245_27.325)]",
  totalClientes: "bg-[oklch(0.55_0.08_240)]",
  empleadosActivos: "bg-[oklch(0.62_0.1_190)]",
};
