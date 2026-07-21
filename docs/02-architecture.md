# Arquitectura del Sistema — MiniERP (AGENTIQ)

---

## 1. Objetivo de la arquitectura

Esta arquitectura está diseñada para un **mini ERP de gestión de proyectos** interno, con un alcance acotado a 5 módulos (Inicio, Clientes, Proyectos, Tareas, Empleados) y un tiempo de desarrollo de 48–72 horas.

Se elige una **arquitectura monolítica modular** sobre Next.js 16 (App Router) porque:

- Permite desarrollar frontend y API en un mismo proyecto, acelerando la entrega.
- Next.js API Routes eliminan la necesidad de un backend separado, reduciendo la complejidad operativa.
- El dominio del problema no justifica la sobrecarga de un backend desacoplado en esta fase.
- Vercel despliega el monolito de forma nativa, simplificando el CI/CD.
- La separación por módulos dentro del monolito mantiene el código organizado sin añadir complejidad innecesaria.

Se prioriza la **simplicidad sobre la abstracción temprana**: no se introducen patrones complejos (CQRS, Event Sourcing, DDD táctico) que no sean necesarios para el alcance actual.

---

## 2. Stack tecnológico

### Next.js 16 (App Router)

- Único framework que cubre frontend y API en un mismo despliegue.
- React Server Components (RSC) permiten renderizar KPIs y listados en servidor, reduciendo la carga de JavaScript en cliente.
- API Routes (Route Handlers) manejan las operaciones CRUD sin necesidad de un servidor Express/Fastify adicional.
- App Router ofrece layouts anidados, que se alinean naturalmente con la estructura de módulos del ERP.

### TypeScript

- Tipado estático para detectar errores en tiempo de compilación.
- Mejora la legibilidad y la introspección en un equipo (o candidato) que trabaja contra tiempo.
- Las interfaces compartidas entre frontend y API garantizan consistencia de datos.

### Tailwind CSS

- Utilidad sobre componentes: permite maquetar rápido sin saltar entre archivos CSS.
- Responsive por defecto con variantes `sm:`, `md:`, `lg:`.
- Integración nativa con Next.js y shadcn/ui.

### shadcn/ui

- Colección de componentes accesibles y personalizables basados en Radix UI.
- No es una dependencia npm — los componentes se copian al proyecto, lo que permite modificarlos sin luchar contra estilos override.
- Proporciona componentes base: botones, inputs, tablas, diálogos, tarjetas, selectores, etc.

### Supabase (PostgreSQL + API)

- Backend-as-a-service que provee base de datos PostgreSQL, API REST autogenerada, y autenticación opcional.
- El cliente `@supabase/supabase-js` se usa desde las API Routes de Next.js para consultar la base de datos.
- Las Row Level Security (RLS) policies pueden implementarse si se agrega autenticación.
- La consola de Supabase permite ejecutar migrations SQL y seed data.

### React Hook Form + Zod

- React Hook Form maneja el estado de formularios con renders controlados y re-renders minimizados.
- Zod define esquemas de validación compartidos entre cliente y servidor.
- `@hookform/resolvers/zod` conecta ambos: el esquema Zod valida en cliente (feedback instantáneo) y en servidor (seguridad).

### TanStack Table

- Headless UI para tablas con ordenamiento, filtrado, paginación y selección.
- Se adapta a Tailwind CSS (el renderizado visual queda en manos del desarrollador).
- Ideal para los listados de clientes, proyectos, empleados y tareas.

### dnd-kit (opcional)

- Librería ligera de drag-and-drop para React.
- Es **punto extra no obligatorio** (según sección 9 del brief). No se incluye en la arquitectura base.
- Si el tiempo lo permite, puede integrarse en el tablero Kanban para arrastrar tareas entre columnas. Si no se implementa, el cambio de estado se hace mediante botones o selects.

### Vercel

- Plataforma de despliegue optimizada para Next.js.
- Proporciona dominio público, HTTPS, CI/CD desde Git, y variables de entorno.
- Escala automáticamente sin configuración adicional.

---

## 3. Arquitectura por capas

```
┌──────────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                              │
│                                                                   │
│  ┌─── Server Components (lecturas) ──────────────────────────┐   │
│  │  · Páginas de listado (clientes, proyectos, tareas,       │   │
│  │    empleados)                                              │   │
│  │  · Páginas de detalle (cliente, proyecto, empleado)       │   │
│  │  · Dashboard con KPIs (consultas agregadas)               │   │
│  │  · Cronograma Gantt                                       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─── Client Components (interacción) ───────────────────────┐   │
│  │  · Formularios (React Hook Form + Zod)                    │   │
│  │  · Tablero Kanban (cambio de estado)                      │   │
│  │  · Diálogos de confirmación, búsqueda, toasts             │   │
│  │  · Solo donde se necesita interactividad                  │   │
│  └───────────────────────┬────────────────────────────────────┘   │
└──────────────────────────┼────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│   LECTURAS           │    │   MUTACIONES                  │
│   Server Components  │    │   Route Handlers (API Routes) │
│   consultan a        │    │   reciben POST/PUT/DELETE,    │
│   Supabase directo   │    │   validan con Zod, ejecutan   │
│   (sin API Route)    │    │   y llaman revalidatePath()   │
└────────┬─────────────┘    └──────────────┬───────────────┘
         │                                 │
         └──────────────┬──────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                             │
│   (Cliente Supabase con anon key — solo servidor)        │
│   · Consultas de lectura desde Server Components         │
│   · Mutaciones desde Route Handlers                      │
│   · Validación Zod antes de cada operación               │
│   · Sin cliente Supabase en el navegador                 │
└───────────────────────┬─────────────────────────────────┘
                        │  SQL (cliente Supabase parametrizado)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   DATABASE                               │
│   (Supabase PostgreSQL)                                  │
│   · Tablas, relaciones, constraints, índices             │
│   · Migraciones versionadas (supabase/migrations/)       │
│   · Seed data para desarrollo                            │
└─────────────────────────────────────────────────────────┘
```

### Responsabilidad de cada capa

**Presentation Layer — Lecturas (Server Components)**
- Renderiza páginas de listado y detalle en el servidor. Consulta Supabase directamente sin pasar por API Routes, eliminando saltos de red innecesarios.
- Los KPIs del dashboard se calculan mediante consultas agregadas a Supabase desde el Server Component.
- Maneja estados de carga (`loading.tsx`), vacío (`EmptyState`) y error (`error.tsx`).

**Presentation Layer — Mutaciones (Client Components + Route Handlers)**
- Los formularios y el Kanban son Client Components (necesitan estado interactivo).
- Envían los datos a Route Handlers (API Routes) mediante fetch.
- Después de una mutación exitosa, el Route Handler ejecuta `revalidatePath()` para refrescar los Server Components.

**Data Layer**
- Cliente único de Supabase con anon key, usado exclusivamente desde código del servidor (Server Components y Route Handlers).
- No hay cliente de Supabase en el navegador. Toda comunicación con la base de datos pasa por el servidor.
- Las consultas usan el cliente nativo de Supabase (escapado, parametrizado). Sin ORM adicional.
- Para consultas complejas (KPIs agregados), se usa `.select()` con filtros y conteos, o SQL raw cuando sea necesario.

**Database**
- PostgreSQL administrado por Supabase.
- Constraints a nivel de base de datos como última capa de validación.
- Migraciones versionadas en `supabase/migrations/`.

---

## 4. Estructura de carpetas

```
src/
├── app/                          # App Router (páginas y API)
│   ├── (dashboard)/              # Ruta raíz con layout principal
│   │   ├── layout.tsx            # Layout con header, sidebar, etc.
│   │   ├── page.tsx              # Dashboard / Inicio (KPIs)
│   │   ├── loading.tsx           # Estado de carga global
│   │   ├── error.tsx             # Error boundary global
│   │   ├── not-found.tsx         # Página 404
│   │   ├── clientes/
│   │   │   ├── page.tsx          # Listado de clientes
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Detalle de cliente
│   │   │   └── nuevo/
│   │   │       └── page.tsx      # Formulario crear cliente
│   │   ├── proyectos/
│   │   │   ├── page.tsx          # Listado de proyectos
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Detalle de proyecto + tareas
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx      # Formulario crear proyecto
│   │   │   └── gantt/
│   │   │       └── page.tsx      # Cronograma Gantt
│   │   ├── tareas/
│   │   │   └── page.tsx          # Tablero Kanban global (opcional)
│   │   └── empleados/
│   │       ├── page.tsx          # Listado de empleados
│   │       ├── [id]/
│   │       │   └── page.tsx      # Detalle de empleado
│   │       └── nuevo/
│   │           └── page.tsx      # Formulario crear empleado
│   └── api/                      # API Routes (Route Handlers)
│       ├── clientes/
│       │   ├── route.ts          # GET (listar), POST (crear)
│       │   └── [id]/
│       │       └── route.ts      # GET, PUT, DELETE
│       ├── proyectos/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── tareas/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── empleados/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       └── dashboard/
│           └── route.ts          # GET (KPIs agregados)
│
├── components/                   # Componentes compartidos
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Header, Sidebar, Nav
│   ├── shared/                   # DataTable, StatusBadge, PriorityBadge
│   └── forms/                    # FormField, SelectSearch (wrappers)
│
├── modules/                      # Lógica específica por módulo
│   ├── inicio/                   # Dashboard (KPIs, gráficos)
│   │   ├── components/           # StatCard, ProyectosChart, ProximosVencimientos
│   │   └── utils/                # funciones para cálculos de KPIs
│   ├── clientes/
│   │   ├── components/           # TablaClientes, ClienteForm, ClienteDetail
│   │   ├── schemas/              # esquema Zod para cliente
│   │   └── utils/                # funciones auxiliares
│   ├── proyectos/
│   │   ├── components/           # ProyectosTable, ProyectoForm, GanttChart
│   │   ├── schemas/
│   │   └── utils/
│   ├── tareas/
│   │   ├── components/           # KanbanBoard, KanbanColumn, TaskCard, TareaForm
│   │   ├── schemas/
│   │   └── utils/
│   └── empleados/
│       ├── components/           # EmpleadosTable, EmpleadoForm, EmpleadoDetail
│       ├── schemas/
│       └── utils/
│
├── lib/                          # Utilidades globales
│   ├── supabase/
│   │   ├── client.ts             # Cliente de Supabase (anon key, solo servidor)
│   │   └── types.ts              # Tipos generados de Supabase
│   ├── validations/              # Esquemas Zod globales
│   │   └── shared.ts             # Reutilizados entre cliente y servidor
│   ├── utils.ts                  # Utilidades generales (cn, formateo)
│   └── constants.ts              # Constantes (estados, prioridades, roles)
│
└── styles/
    └── globals.css               # Tailwind directives + variables CSS

supabase/
├── migrations/                   # Archivos SQL versionados
│   └── 001_initial_schema.sql
└── seed.sql                      # Datos de prueba

README.md
.env.example
```

### Principios de organización

- **src/app/**: define rutas y layouts. No contiene lógica de negocio.
- **src/modules/**: cada módulo encapsula sus componentes, esquemas y utilidades. Esto permite que un módulo sea autocontenido y fácil de extraer si el proyecto escala. El módulo `inicio/` contiene los componentes del Dashboard (KPIs, gráficos, próximos vencimientos).
- **src/components/**: componentes compartidos entre módulos (ui primitives, layout). Si un componente es necesario en dos o más módulos, se mueve aquí.
- **src/lib/**: configuración de Supabase (un solo cliente para servidor), utilidades y validaciones globales.
- **No hay `src/hooks/` global**: los hooks específicos de cada módulo viven dentro de `src/modules/<modulo>/hooks/`.
- **supabase/**: todo lo relacionado con la base de datos (migrations, seed).

---

## 5. Estrategia de componentes

### Componentes reutilizables (src/components/)

**UI primitives (shadcn/ui)**
- `Button`, `Input`, `Label`, `Select`, `Textarea`, `Dialog`, `Card`, `Badge`, `Table`, `DropdownMenu`, `Toast`, `Skeleton`

**Shared (src/components/shared/)**
- `DataTable`: wrapper sobre TanStack Table con paginación, ordenamiento y búsqueda.
- `StatusBadge`: badge con color según estado (Planeado/En progreso/Completado, Pendiente/En progreso/Completada).
- `PriorityBadge`: badge para prioridad (Baja/Media/Alta).
- `PageHeader`: título + breadcrumb + botón de acción.
- `EmptyState`: estado vacío con mensaje y acción sugerida.
- `ConfirmDialog`: diálogo de confirmación para eliminar.
- `SearchInput`: input con debounce para búsqueda.
- `LoadingSkeleton`: esqueleto de carga reutilizable.

**Forms (src/components/forms/)**
- `FormField`: wrapper de React Hook Form + shadcn/ui Input para reducir boilerplate.
- `FormSelect`: wrapper para Select con validación.
- `FormDatePicker`: selector de fecha con validación.
- `FormMultiSelect`: selección múltiple (para asignar empleados a proyecto).

### Componentes específicos por módulo (src/modules/)

**Inicio (Dashboard)**
- `StatCard`: tarjeta individual de KPI (valor, label, ícono, color).
- `KPIGrid`: grilla de las 6 tarjetas de KPI obligatorias.
- `ProyectosChart`: gráfico de proyectos agrupados por estado (barras o dona).
- `ProximosVencimientos`: listado de las 5 tareas con fecha límite más cercana.

**Clientes**
- `ClientesTable`: tabla con buscador, acciones editar/eliminar.
- `ClienteForm`: formulario crear/editar.
- `ClienteDetail`: vista de detalle + proyectos asociados.
- `DeleteClienteDialog`: diálogo con validación de proyectos asociados.

**Proyectos**
- `ProyectosTable`: tabla con estado, % avance, acciones.
- `ProyectoForm`: formulario crear/editar con selector de cliente y empleados.
- `ProyectoDetail`: detalle + equipo + tareas.
- `GanttChart`: línea de tiempo de proyectos.

**Tareas**
- `KanbanBoard`: tablero con columnas por estado.
- `KanbanColumn`: columna individual con lista de tareas.
- `TaskCard`: tarjeta de tarea arrastrable.
- `TareaForm`: formulario crear/editar.
- `TareasTable`: vista de tabla alternativa.

**Empleados**
- `EmpleadosTable`: tabla con filtros por rol y estado.
- `EmpleadoForm`: formulario crear/editar.
- `EmpleadoDetail`: detalle con tareas activas y proyectos.

### Layouts

- `RootLayout`: HTML base, fuentes, providers globales (Toaster).
- `DashboardLayout`: sidebar con navegación por módulos + header + main content.
- `AuthLayout` (opcional): layout para páginas de login si se implementa autenticación.

Los layouts anidados de Next.js App Router permiten que el sidebar y header persistan entre páginas sin rerenderizarse.

---

## 6. Estrategia de estado

### Principio general

No se introduce estado global (Zustand, Redux, Context global). El alcance del proyecto no lo justifica. Todo el estado se maneja con mecanismos nativos de Next.js y React.

### Estado del servidor (Server State)

| Origen | Mecanismo | Descripción |
|---|---|---|
| Lecturas | Server Components | Consultan Supabase directamente en el servidor. Los datos viajan como props, nunca como estado en el cliente. |
| Mutaciones | Route Handlers + `revalidatePath()` | Después de crear, editar o eliminar, el Route Handler ejecuta `revalidatePath()` para forzar el re-renderizado del Server Component con datos frescos. |

### Estrategia de revalidación post-mutación

Después de cada operación de escritura, ocurre lo siguiente:

1. El Route Handler procesa la mutación (insert, update, delete) contra Supabase.
2. Ejecuta `revalidatePath(<ruta_afectada>)` para invalidar la caché de los Server Components involucrados.
3. Responde al cliente con `{ success: true }` y los datos actualizados si aplica.
4. El cliente (opcionalmente) ejecuta `router.refresh()` para asegurar que la UI refleje los cambios inmediatamente.

**Casos específicos:**

- **Crear cliente** → `revalidatePath('/clientes')`. Redirige al listado.
- **Editar cliente** → `revalidatePath('/clientes')` + `revalidatePath('/clientes/[id]')`.
- **Eliminar cliente** → `revalidatePath('/clientes')`. Si tiene proyectos, responde `409 Conflict` sin eliminar.
- **Crear/editar/eliminar proyecto** → `revalidatePath('/proyectos')` y rutas de detalle afectadas.
- **Crear/editar/eliminar tarea** → `revalidatePath('/proyectos/[id]')` (se ve en detalle del proyecto) + `revalidatePath('/')` (KPIs del dashboard).
- **Cambiar estado de tarea** → `revalidatePath('/proyectos/[id]')` + `revalidatePath('/')`.
- **Crear/editar/eliminar empleado** → `revalidatePath('/empleados')`.

### Estado del cliente (Client State)

| Tipo | Mecanismo | Uso |
|---|---|---|
| Formularios | React Hook Form | Maneja valores, errores, dirty, touched. Sin estado global. |
| UI efímero | `useState` local | Modales abiertos/cerrados, menús, drag-and-drop en progreso. |
| Filtros y búsqueda | URL Search Params | `useSearchParams()` o `useRouter()` para mantener estado en la URL. Permite compartir/enlazar vistas filtradas. |
| Notificaciones | Sonner (toast) | Alertas de éxito/error sin estado global. |

### Providers globales

```
Providers (layout.tsx)
└── Toaster                  (notificaciones/sonner)
```

No hay `QueryClientProvider` (no se usa TanStack Query). No hay `ThemeProvider` (modo oscuro fuera de alcance).

---

## 7. Estrategia de validaciones

### Cliente (navegador)

- Cada formulario tiene un esquema Zod definido en `src/modules/<modulo>/schemas/`.
- React Hook Form + `@hookform/resolvers/zod` valida en cada cambio (modo `onChange` o `onBlur`).
- Validaciones síncronas: campos obligatorios, formato de email, fecha posterior a otra, selección requerida.
- Feedback visual inmediato: mensajes de error debajo de cada campo, borde rojo en inputs inválidos.
- Botón de submit deshabilitado mientras haya errores o la validación no pase.

### Servidor (API Routes)

- Los mismos esquemas Zod se reutilizan en el servidor.
- En cada API Route (POST, PUT), se ejecuta `schema.parse(body)` antes de cualquier operación.
- Si la validación falla, se responde con `400 Bad Request` y los errores detallados.
- Esto garantiza que datos inválidos nunca lleguen a la base de datos, incluso si el cliente omite la validación.

### Base de datos (PostgreSQL)

- Constraints SQL: `NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`.
- Ejemplos:
  - `clientes.email` debe ser único.
  - `proyectos.fecha_fin > proyectos.fecha_inicio`.
  - `tareas.id_empleado` debe existir en `empleados` y estar asignado al proyecto.
- Las constraints actúan como última línea de defensa. No se confía exclusivamente en ellas para validación de negocio.

---

## 8. Manejo de errores

### Errores de formulario

- Capturados por React Hook Form + Zod en el cliente.
- Se muestran como texto debajo del campo correspondiente.
- Errores de servidor (duplicado, violación de constraint) se capturan en el catch del API Route y se devuelven como `{ error: string }`. El cliente los muestra como un Toast o alerta global.

### Errores de Supabase

- Timeout / red: se detectan con `try/catch` en las API Routes. Se responde con `503 Service Unavailable`.
- Violación de unique constraint (email duplicado): se captura el código de error PostgreSQL `23505` y se devuelve un mensaje legible.
- Error de conexión: se retorna `500 Internal Server Error` con un mensaje genérico (sin exponer detalles internos).
- Los errores de fetch se capturan en el cliente con try/catch y se muestran mediante Toast (sonner) o un componente `ErrorBoundary`.

### Errores 404

- Para rutas de páginas: `not-found.tsx` global con mensaje amigable y enlace al inicio.
- Para recursos individuales (cliente no encontrado por ID): la API responde con `404 Not Found`. El componente Server Component redirige a `notFound()`.
- Las páginas de detalle verifican que el recurso exista antes de renderizar. Si no existe, se muestra el `not-found.tsx`.

### Errores 500

- `error.tsx` global (Error Boundary) en `app/(dashboard)/error.tsx`.
- Captura errores no controlados en Server y Client Components.
- Muestra mensaje genérico: "Algo salió mal. Intenta de nuevo." con botón de reintento.
- Los errores de API se logean en consola (servidor) sin exponer detalles al cliente.

### Estrategia general

- Nunca exponer stack traces, detalles de base de datos o configuración interna al cliente.
- Las API Routes devuelven siempre `{ error: string, details?: unknown }` con código HTTP apropiado.
- El cliente consume los errores y muestra mensajes en español, legibles para el usuario final.

---

## 9. Seguridad

### Autenticación

- **No obligatoria** en el alcance actual (según sección 6.6 del brief).
- Si se implementa como punto extra, se usa **Supabase Auth** con email/password.
- Las API Routes protegidas verifican la sesión con `supabase.auth.getSession()`.

### Validaciones

- Validación dual (cliente + servidor) con esquemas Zod compartidos, descrito en la sección 7.
- Sanitización de entradas: Zod por defecto rechaza tipos inesperados; no hay riesgo de inyección porque el cliente Supabase parametriza las consultas.

### Protección de datos

- No se almacenan datos sensibles (contraseñas, tokens) — la autenticación es opcional.
- **No se expone Supabase al navegador.** No se crea un cliente de Supabase en el lado del cliente. Todas las operaciones pasan por el servidor (Server Components para lecturas, Route Handlers para mutaciones).
- La `anon key` se usa exclusivamente desde el servidor. Aunque técnicamente es una clave pública, al no exponerla al navegador se elimina un vector de ataque (consulta directa a la API de Supabase desde las DevTools).

### Claves de Supabase

| Variable | Prefijo | Dónde se usa | ¿Por qué? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_` | Server y cliente | Es la URL del proyecto Supabase. Es pública e inofensiva. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_` | Solo servidor | Se declara con `NEXT_PUBLIC_` para que esté disponible en Server Components y Route Handlers. Aunque es pública por diseño, **no se usa en el navegador**. |
| `SUPABASE_SERVICE_ROLE_KEY` | (sin prefijo) | **No se usa en esta arquitectura** | Esta clave bypass RLS y tiene acceso completo a la base de datos. Solo sería necesaria para: (a) operaciones administrativas (truncar tablas, migrations), (b) lógica que debe bypassear RLS en un sistema con autenticación. **Para el alcance actual, no se requiere.** Si se implementa autenticación como punto extra, se evaluará su necesidad en ese momento. |

### Regla obligatoria

La `SUPABASE_SERVICE_ROLE_KEY` **nunca debe declararse con prefijo `NEXT_PUBLIC_`** porque eso la expondría al navegador. En esta arquitectura no se usa, por lo que no hay riesgo.

### Variables de entorno

Archivo `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

- Solo dos variables necesarias. Sin service role key.
- El `.env` real se incluye en `.gitignore`.
- En Vercel, se configuran como Environment Variables en el dashboard del proyecto.

### Row Level Security (RLS)

RLS es un mecanismo de seguridad a nivel de fila en PostgreSQL. Su utilidad depende de la estrategia de acceso:

**Escenario A — Acceso desde el navegador (no recomendado para esta prueba)**
- El cliente de Supabase se inicializa en el navegador con la anon key.
- RLS es **obligatorio**: sin políticas que restrinjan el acceso, cualquier usuario de la web podría leer y escribir toda la base de datos desde las DevTools.
- Se necesitan políticas para cada tabla y operación (SELECT, INSERT, UPDATE, DELETE).
- Sin autenticación, no hay `auth.uid()` que evaluar, por lo que las políticas solo pueden permitir acceso anónimo completo, lo que anula el propósito de RLS.

**Escenario B — Acceso exclusivo desde el servidor (recomendado para esta prueba)**
- No se crea cliente de Supabase en el navegador.
- Toda consulta pasa por Server Components o Route Handlers en el servidor de Next.js.
- La anon key se usa solo desde el servidor. El navegador nunca tiene acceso directo a la API REST de Supabase.
- RLS **puede permanecer habilitado** (es el estado por defecto en tablas nuevas de Supabase), pero es irrelevante porque el acceso solo ocurre desde el servidor y la anon key tiene permisos completos en un proyecto joven.
- **Para un proyecto con autenticación**, se recomienda migrar al Escenario A con RLS policies bien definidas.

**Recomendación para esta prueba:** Escenario B. Es más simple, más seguro (sin superficie de ataque directa desde el navegador), y no requiere configurar RLS policies que serían ficticias sin autenticación.

---

## 10. Escalabilidad

El alcance del proyecto es una herramienta interna, primera versión funcional, desarrollada por una sola persona en 48–72h. La escalabilidad relevante se limita a:

### Crecimiento por nuevos módulos

La estructura basada en `src/modules/` permite agregar nuevos módulos (por ejemplo, Facturación si el negocio lo requiere) sin modificar los existentes:

1. Crear `src/modules/<nuevo-modulo>/` con sus componentes, schemas y utils.
2. Agregar rutas en `src/app/(dashboard)/<nuevo-modulo>/`.
3. Agregar Route Handlers en `src/app/api/<nuevo-modulo>/`.
4. Agregar la entrada en la navegación del sidebar.

### Performance a futuro (bajo demanda)

Si el sistema crece y se detectan cuellos de botella, se evaluarán optimizaciones específicas en ese momento. No se planifica caché distribuida, virtualización ni infraestructura adicional en esta fase.

---

## 11. Riesgos arquitectónicos

| ID | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| RA-01 | **Server Components + Supabase en el mismo proyecto** puede generar consultas N+1 si no se diseñan bien las relaciones | Alto | Usar `select` con joins en el cliente Supabase; crear vistas en PostgreSQL para consultas complejas (KPIs); revisar el plan de ejecución de consultas lentas |
| RA-02 | **El tiempo de desarrollo (48-72h) puede forzar deuda técnica** | Alto | Priorizar la funcionalidad core funcional sobre la perfección del código; documentar la deuda en el README |
| RA-03 | **Kanban con drag-and-drop puede ser complejo de integrar** | Medio | El Kanban base usa botones de cambio de estado. dnd-kit es opcional y se agrega solo si sobra tiempo |
| RA-04 | **El cronograma Gantt puede ser difícil de implementar desde cero** | Medio | Usar una librería ligera específica para Gantt (ej. Frappe Gantt) envuelta en un componente React, o implementar barras horizontales con CSS y posicionamiento basado en fechas |
| RA-05 | **React Hook Form + Zod + shadcn/ui pueden tener fricción en la integración** | Bajo | Crear un `FormField` wrapper al inicio del proyecto que encapsule la integración; estandarizar el patrón en todos los formularios |
| RA-06 | **Las variables de entorno mal configuradas en Vercel pueden romper el build** | Bajo | Probar el build localmente con `vercel build` antes de pushear; configurar las variables en Vercel inmediatamente después del primer deploy |
| RA-07 | **Sin autenticación, cualquier persona con la URL puede acceder al sistema** | Medio | Aceptado como riesgo consciente (herramienta interna, alcance no obligatorio). Se mitiga parcialmente con acceso exclusivo desde servidor (sin Supabase directo en el navegador) |
| RA-08 | **La tabla puente proyecto-empleado puede complicar consultas** | Bajo | Modelar desde el inicio con índices compuestos; las consultas con join a tabla puente son un patrón conocido y bien soportado por Supabase |

---

## 12. Decisiones adicionales y convenciones

### Convención de nombres

| Tipo | Convención | Ejemplo |
|---|---|---|
| Archivos de componentes | PascalCase | `ClienteForm.tsx`, `KanbanBoard.tsx` |
| Archivos de rutas (App Router) | kebab-case | `page.tsx`, `layout.tsx`, `not-found.tsx` |
| Archivos de ruta dinámica | `[param]` | `[id]/page.tsx` |
| Archivos de utilidad | kebab-case | `formatear-fecha.ts`, `constantes.ts` |
| Variables y funciones | camelCase | `getCliente()`, `formatearFecha()` |
| Interfaces y tipos | PascalCase | `Cliente`, `ProyectoConTareas` |
| Esquemas Zod | PascalCase + `Schema` | `ClienteSchema`, `ProyectoSchema` |
| Tablas en Supabase | snake_case | `proyectos`, `tareas`, `proyecto_empleado` |

### Organización de imports

```
1. React / Next.js
2. Librerías externas (supabase, zod, react-hook-form)
3. Componentes compartidos (src/components/)
4. Esquemas y utilidades del módulo (src/modules/<modulo>/)
5. Utilidades globales (src/lib/)
6. Tipos (src/lib/supabase/types.ts)
```

### Server Components vs Client Components

| Es Server Component por defecto | Requiere `"use client"` |
|---|---|
| Páginas de listado (`page.tsx`) | Formularios (React Hook Form) |
| Páginas de detalle | Tablero Kanban |
| Layouts (menos interactivos) | Diálogos, modales |
| Componentes que solo renderizan datos | Componentes con `useState`, `useEffect` |
| KPIs del Dashboard | Componentes con event handlers (onClick, onChange) |
| Cronograma Gantt (versión estática) | Búsqueda con debounce |

La regla: si un componente no necesita hooks de React ni event handlers, debe ser Server Component. Usar `"use client"` solo cuando sea estrictamente necesario.

### Organización de tipos compartidos

- Los tipos generados por Supabase (`supabase gen types`) se almacenan en `src/lib/supabase/types.ts`.
- Los tipos específicos de cada módulo se definen junto al módulo en `src/modules/<modulo>/types.ts`.
- Los esquemas Zod en `src/modules/<modulo>/schemas/` definen la validación y también sirven como fuente de tipos (inferencia con `z.infer`).
- No se crean interfaces duplicadas: o se usa el tipo generado de Supabase o se infiere del esquema Zod.

### Relaciones entre módulos

- **No se permite** que un módulo importe componentes de otro módulo.
- Si un componente es necesario en dos módulos, se mueve a `src/components/shared/`.
- Ejemplo: `ProyectosChart` (gráfico del Dashboard) debe estar en `src/components/shared/` o en `src/modules/inicio/`, no dentro de `proyectos/`.

---

## 13. Mejoras futuras y tecnologías opcionales

Las siguientes tecnologías y patrones **no forman parte de la arquitectura base** pero se documentan como posibles mejoras si el tiempo lo permite:

| Tecnología | ¿Por qué no se incluye? | ¿Cuándo agregarla? |
|---|---|---|
| **TanStack Query (React Query)** | Para el alcance actual no es necesario: Server Components leen datos directo de Supabase, y `revalidatePath()` refresca después de mutaciones. No hay polling, caché avanzada ni datos en tiempo real que lo justifiquen. | Si se agregan filtros complejos con refetch automático, o si se migra a un backend separado. |
| **dnd-kit** | Punto extra no obligatorio según el brief. El Kanban funciona con botones de cambio de estado. | Si se implementa la mejora de drag-and-drop en el Kanban. |
| **Modo oscuro (ThemeProvider)** | Ningún requerimiento lo solicita. | Mejora estética post-MVP. |
| **Supabase Auth + RLS** | Sin autenticación no hay usuarios que autenticar ni RLS que configurar. | Si se implementa autenticación como punto extra. |
| **Pruebas automatizadas** | Punto extra no obligatorio. | Después de la funcionalidad base, si el tiempo lo permite. |
| **Docker / Contenerización** | Punto extra no obligatorio. | Si se requiere entorno de desarrollo estandarizado. |

---

*Documento generado como parte del diseño arquitectónico — 21/07/2026*
