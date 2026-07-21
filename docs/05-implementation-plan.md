# Plan de Implementación — MiniERP (AGENTIQ)

---

## 1. Objetivo del plan

Construir la primera versión funcional del MiniERP en 48–72 horas, organizado en fases con entregables verificables. Este documento es la guía operativa; los detalles de arquitectura, BD y UI están en `docs/02-architecture.md`, `docs/03-database.md` y `docs/04-ui.md`.

**Estimación de referencia:** 30–38 horas totales. No es un compromiso exacto. Las prioridades son:
1. MVP funcional con datos reales.
2. Validaciones y manejo de errores.
3. Estabilidad sobre cumplir una estimación individual.

---

## 2. Prioridades

| Prioridad | Descripción | Incluye |
|---|---|---|
| **P0** | Obligatorio. Sin esto no hay MVP | Configuración, BD, Clientes CRUD, Empleados CRUD, Proyectos CRUD, asignación proyecto-empleado, Tareas CRUD, cambio de estado, Dashboard con KPIs, manejo básico de errores, responsive esencial, deploy funcional |
| **P1** | Importante, pero no bloquea el deploy | Kanban sin drag-and-drop, filtros y búsqueda, estados vacíos, confirmaciones destructivas, Gantt básico |
| **P2** | Solo si queda tiempo | Drag-and-drop, gráficas, Gantt sofisticado, animaciones, paginación, optimizaciones no necesarias para el volumen de la prueba |

Una funcionalidad P2 **nunca** debe retrasar el deploy.

---

## 3. Estructura general

```
Fase 1 ─── Fundamentos técnicos (configuración + layout)
Fase 2 ─── Datos y módulos maestros (BD + Clientes + Empleados)
Fase 3 ─── Operación principal (Proyectos + Tareas)
Fase 4 ─── Visualización (Dashboard + Kanban + Gantt)
Fase 5 ─── QA y entrega (responsive, build, README, deploy)
```

### Dependencias

```
Clientes ──┐
            ├── Proyectos ── Tareas ── Dashboard
Empleados ─┘
```

Clientes y Empleados no dependen de nadie y pueden implementarse en cualquier orden. Proyectos depende de ambos. Tareas depende de Proyectos + Empleados. Dashboard depende de todos.

---

## 4. Definition of Done global

Para considerar que una fase está completa, debe cumplir:

- [ ] Funcionalidad implementada conforme a requisitos del módulo.
- [ ] Validaciones esenciales funcionando (Zod en cliente y servidor).
- [ ] Errores controlados (toast en mutaciones fallidas, HTTP codes adecuados).
- [ ] Estados de carga (skeleton) y vacío (EmptyState) donde corresponda.
- [ ] Responsive esencial: funcional en 375px, 768px y 1280px.
- [ ] Sin errores de TypeScript (`tsc --noEmit`).
- [ ] Sin errores críticos de ESLint.
- [ ] Build exitoso (`npm run build`).
- [ ] Flujo manual principal del módulo validado.

Los criterios particularmente relevantes para cada fase se indican como "DoD extra".

---

## 5. Fase 1 — Fundamentos técnicos

### Objetivo
Tener el proyecto Next.js corriendo con Tailwind, shadcn/ui, Supabase conectado, layout navegable y componentes compartidos listos.

### Entregables
- Proyecto Next.js 16 + TypeScript + Tailwind.
- shadcn/ui inicializado con componentes base.
- Cliente Supabase en servidor (`src/lib/supabase/client.ts`).
- Variables de entorno (`.env.example`, `.env.local` en `.gitignore`).
- Layout: AppShell + Sidebar + Header con 5 rutas placeholder.
- Componentes compartidos: PageHeader, DataTable, SearchInput, FilterBar, StatusBadge, EmptyState, ErrorState, Skeleton, ConfirmDialog, FormActions, Toast (Sonner).
- Wrappers de formulario: FormField, FormSelect, FormDatePicker.
- `loading.tsx`, `error.tsx`, `not-found.tsx` globales.

### Dependencias
Ninguna.

### DoD extra
- [ ] Sidebar navega entre 5 rutas.
- [ ] Sidebar colapsable en móvil.
- [ ] Componentes compartidos se renderizan sin errores.

### Commits sugeridos
```
chore: initialize nextjs project with tailwind and shadcn
feat: configure supabase integration with env vars
feat: add application shell with sidebar navigation
feat: create shared components (table, badge, dialog, toast, empty states)
```

### Condición para avanzar
`npm run dev` funciona. Layout navegable. Componentes compartidos operativos.

---

## 6. Fase 2 — Datos y módulos maestros

### Objetivo
Base de datos poblada. Clientes y Empleados con CRUD completo, búsqueda y filtros.

### Entregables
- Migración SQL ejecutada en Supabase (5 tablas, constraints, índices, seed data).
- Cliente Supabase funcional con tipos (`src/lib/supabase/types.ts`).
- Empleados: listado (con filtros por rol y estado), crear, detalle (con tareas activas y proyectos), editar, eliminar.
- Clientes: listado (con búsqueda por nombre), crear, detalle (con proyectos asociados), editar, eliminar (con validación: bloquear si tiene proyectos).

### Dependencias
Fase 1.

### DoD extra
- [ ] Seed data insertada: 4 clientes, 6 empleados (verificar con `SELECT COUNT(*)`).
- [ ] Eliminación de cliente con proyectos → muestra advertencia y bloquea.
- [ ] Email duplicado → error legible.
- [ ] Filtros de empleados por rol y estado funcionales.
- [ ] Búsqueda de clientes por nombre funcional.

### Commits sugeridos
```
feat: run database migration with seed data
feat: implement employees module
feat: implement clients module with search and delete validation
```

### Condición para avanzar
CRUD de ambas entidades funcional. Validaciones operativas.

---

## 7. Fase 3 — Operación principal

### Objetivo
Proyectos y Tareas con todas sus relaciones: asignación de empleados a proyectos, creación de tareas dentro de proyectos, cambio de estado y Kanban básico.

### Entregables
- Proyectos: listado (con % avance), crear (con selección de cliente + multi-select empleados), detalle (con equipo y tareas), editar (sincroniza asignaciones), eliminar (con confirmación de cascada).
- Tareas: Kanban global (`/tareas`) con columnas por estado y filtros por proyecto/empleado. Kanban por proyecto (sección en detalle). Crear/editar mediante drawer. Cambio de estado mediante select (sin drag-and-drop).
- Validación RN-08: empleado asignado a tarea debe estar en el proyecto.

### Dependencias
Fase 2 (Clientes + Empleados).

### DoD extra
- [ ] % de avance del proyecto calculado correctamente.
- [ ] Crear proyecto persiste en proyecto_empleado.
- [ ] Editar proyecto sincroniza asignaciones (insert/delete en proyecto_empleado).
- [ ] Kanban con 3 columnas y cambio de estado funcional.
- [ ] Validación RN-08: error si empleado no pertenece al proyecto.
- [ ] Drawer de crear/editar tarea mantiene contexto del Kanban.

### Commits sugeridos
```
feat: implement projects module with employee assignment
feat: implement tasks kanban with state management
feat: add task create and edit drawers
```

### Condición para avanzar
Proyectos y Tareas funcionales. Relaciones operativas.

---

## 8. Fase 4 — Visualización

### Objetivo
Dashboard con KPIs, próxima vencimientos, Kanban terminado (desde Fase 3) y Gantt básico.

### Entregables
- Dashboard (`/`): 6 StatCards (Proyectos activos, Completados, Tareas pendientes, Tareas vencidas, Total clientes, Empleados activos) + lista de próximos vencimientos (top 5 tareas).
- Kanban completado (hereda de Fase 3, se afina aquí si es necesario).
- Gantt (`/proyectos/gantt`): barras horizontales con nombre, fechas y estado, agrupado por estado. Scroll horizontal en móvil. Vista tabular alternativa accesible. Prioridad P1 (no bloquea deploy).

### Dependencias
Fase 3.

### DoD extra
- [ ] 6 KPIs con valores numéricos correctos.
- [ ] Próximos vencimientos muestra top 5 tareas.
- [ ] Gantt renderiza proyectos en timeline (si se implementa).
- [ ] Estados vacío y carga en Dashboard.

### Commits sugeridos
```
feat: add dashboard metrics and upcoming deadlines
feat: add gantt chart timeline view
```

### Condición para avanzar
Dashboard funcional. Kanban operativo desde Fase 3.

---

## 9. Fase 5 — QA y entrega

### Objetivo
Garantizar calidad mínima, desplegar en Vercel y documentar.

### Entregables
- Revisión responsive completa (375px, 768px, 1280px).
- Accesibilidad esencial (teclado, focus visible, contraste).
- Manejo de errores verificado (404, 409, 400, 500).
- Build exitoso.
- README con instrucciones de instalación, variables de entorno, decisiones técnicas y URL de deploy.
- Deploy en Vercel con URL pública funcional.
- Prueba de flujo completo (ver sección 12).

### Dependencias
Fases 1–4.

### DoD extra
- [ ] `npm run build` sin errores.
- [ ] URL de Vercel accesible públicamente.
- [ ] README completo en la raíz del repositorio.
- [ ] Flujo manual completo validado.

### Commits sugeridos
```
fix: resolve responsive layout issues
docs: add setup and deployment guide
chore: deploy to vercel
```

### Condición para avanzar
No aplica (es la última fase). El proyecto se entrega al completar esta fase.

---

## 10. Estrategia de commits

### Formato
Conventional Commits: `<tipo>: <descripción>`.

### Tipos
`feat`, `fix`, `docs`, `chore`, `refactor`, `style`.

### Reglas
- Commits pequeños, coherentes, funcionales y revisables.
- Cada commit debe poder ejecutarse (aunque falten funcionalidades).
- La cantidad final depende de la evolución real del proyecto; no hay meta numérica.
- No commits masivos ni un solo commit final.

### Ejemplos esperados
```
chore: initialize nextjs project
feat: configure supabase integration
feat: add application shell
feat: implement employees module
feat: implement clients module
feat: implement projects module
feat: implement tasks module
feat: add dashboard metrics
fix: resolve responsive layout issues
docs: add setup and deployment guide
```

---

## 11. Validación por fase

| Fase | Pruebas manuales esenciales |
|---|---|
| **F1** | `npm run dev` inicia. Sidebar navega. Componentes compartidos se renderizan. |
| **F2** | Crear/editar/eliminar empleado y cliente. Buscar cliente. Filtrar empleados. Bloquear eliminación de cliente con proyectos. |
| **F3** | Crear proyecto con cliente y empleados. Ver % avance. Crear tarea desde Kanban. Cambiar estado. Validar RN-08. |
| **F4** | KPIs reflejan datos. Próximos vencimientos listados. Gantt muestra proyectos (si implementado). |
| **F5** | Flujo completo (sección 12). Build exitoso. Deploy funcional. |

### Flujo completo de validación (Fase 5)

1. Crear 2 empleados activos.
2. Crear 1 cliente.
3. Crear 1 proyecto asignando cliente y empleados.
4. Verificar equipo en detalle del proyecto.
5. Crear 3 tareas (una por estado).
6. Ver Kanban global, filtrar por proyecto y empleado.
7. Cambiar estado de Pendiente → En progreso → Completada.
8. Verificar KPIs en Dashboard reflejan los cambios.
9. Ver Gantt (si implementado).
10. Editar proyecto (cambiar nombre, re-asignar empleados).
11. Eliminar una tarea.
12. Ver detalle de empleado (tareas activas y proyectos).

---

## 12. Estrategia ante falta de tiempo

Si el tiempo se agota, reducir en este orden:

| Orden | Qué recortar |
|---|---|
| 1 | Mantener CRUD y relaciones principales (P0 completo) |
| 2 | Mantener validaciones y manejo de errores |
| 3 | Mantener dashboard básico (6 KPIs sin gráfico) |
| 4 | Kanban funcional (sin drag-and-drop) |
| 5 | Gantt simplificado (solo tabla con fechas y duración, sin timeline gráfico) |
| 6 | Eliminar gráficas avanzadas |
| 7 | Eliminar animaciones y pulido no esencial |

**Nunca recortar:**
- Integridad de datos (FKs, constraints, validaciones).
- Variables de entorno y seguridad básica.
- Build exitoso.
- README de instalación.
- Deploy funcional en Vercel.

---

## 13. Riesgos (máximo 8)

| ID | Riesgo | Prob. | Impacto | Mitigación | Contingencia |
|---|---|---|---|---|---|
| R-01 | Tiempo insuficiente (48–72h) | Alta | Alto | Priorizar P0 sobre P1/P2. Si falta tiempo, entregar menos módulos pero funcionales | Recortar Fase 4 (Gantt, gráficos). Documentar limitaciones en README |
| R-02 | Gantt complejo de implementar | Media | Alto | Fase 1: tabla con fechas. Fase 2: barras CSS. Fase 3: Frappe Gantt si hay tiempo | No implementar timeline gráfico; solo tabla accesible con duración calculada |
| R-03 | Kanban sin drag-and-drop se siente incompleto | Baja | Bajo | Select de estado + botones como alternativa accesible. Documentar drag-and-drop como mejora | La funcionalidad base es completa y usable |
| R-04 | TypeScript estricto causa errores | Media | Medio | Correr `tsc --noEmit` después de cada archivo, no al final | Relajar reglas temporalmente en un archivo problemático (documentar) |
| R-05 | Problemas de conexión a Supabase | Baja | Alto | Verificar conexión al inicio de Fase 2. Tener script SQL listo para ejecutar manualmente | Usar SQL Editor de Supabase como fallback si el cliente falla |
| R-06 | Vercel build falla por env vars | Media | Alto | Probar `npm run build` local antes de pushear. Configurar env vars en Vercel inmediatamente | Usar archivo `.env.production` local para debug |
| R-07 | shadcn/ui + React Hook Form tienen fricción | Media | Medio | Crear wrappers (FormField) al inicio y estandarizar en todos los formularios | Usar HTML nativo para campos problemáticos, perder consistencia visual |
| R-08 | Enfermedad o imprevisto del desarrollador | Baja | Alto | Priorizar módulos core. Documentar decisiones incompletas en README | Si faltan >24h, entregar lo que esté funcional con nota explicativa |

---

## 14. Checklist de entrega

### Funcionalidad
- [ ] CRUD completo de Clientes.
- [ ] CRUD completo de Empleados (con filtros).
- [ ] CRUD completo de Proyectos (con % avance y asignación).
- [ ] CRUD completo de Tareas.
- [ ] Cambio de estado de tareas.
- [ ] Dashboard con 6 KPIs + próximos vencimientos.
- [ ] Kanban en `/tareas` y dentro de proyecto.
- [ ] Gantt (básico o tabla accesible).
- [ ] Validaciones: email duplicado, fechas, RN-08, eliminación con dependencias.

### Datos
- [ ] Migración SQL ejecutada (5 tablas).
- [ ] Seed data insertada.
- [ ] Todos los datos persisten en Supabase.

### Calidad
- [ ] `npm run build` sin errores.
- [ ] `tsc --noEmit` sin errores.
- [ ] `npm run lint` sin errores críticos.
- [ ] Responsive: 375px, 768px, 1280px verificados.
- [ ] Estados de carga, vacío y error visibles.

### Seguridad básica
- [ ] `.env.local` en `.gitignore`.
- [ ] Sin claves reales en el repositorio.
- [ ] Sin cliente Supabase en el navegador.

### Documentación
- [ ] README con: instalación, variables de entorno, seed, decisiones técnicas, qué haría distinto.
- [ ] `.env.example` con valores placeholder.

### Deploy
- [ ] Repositorio en GitHub con historial de commits.
- [ ] URL de Vercel pública y funcional.
- [ ] Flujo completo validado desde la URL pública.

---

*Documento generado como parte del plan de implementación — 21/07/2026*
