# MiniERP — Sistema de Gestión de Proyectos

Aplicación web full-stack tipo ERP ligero para la gestión interna de proyectos, clientes, empleados y tareas. Desarrollada como prueba técnica para **AGENTIQ**.

El sistema permite administrar el ciclo de vida completo de proyectos: desde el registro de clientes y empleados, pasando por la planificación y asignación de proyectos, hasta el seguimiento de tareas en un tablero Kanban.

---

## Enlaces

| | |
|---|---|
| **Aplicación** | [https://minierp-seven.vercel.app](https://minierp-seven.vercel.app) |
| **Repositorio** | [https://github.com/zosimoleevargas-hue/minierp-agentiq](https://github.com/zosimoleevargas-hue/minierp-agentiq) |

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 16.2.11 (App Router) |
| **UI** | React 19.2.4 + shadcn/ui (base-nova) |
| **Estilos** | Tailwind CSS v4 + tw-animate-css |
| **Iconos** | Lucide React |
| **Formularios** | React Hook Form + Zod v4 + @hookform/resolvers |
| **Notificaciones** | Sonner |
| **Base de datos** | Supabase (PostgreSQL) |
| **Lenguaje** | TypeScript (strict mode) |
| **Linter** | ESLint (configuración de Next.js) |

---

## Arquitectura

El proyecto sigue la arquitectura de **Next.js App Router** con una separación clara entre capas:

- **Server Components** — realizan lecturas a Supabase directamente desde el servidor y renderizan contenido.
- **Route Handlers** (`/api/*`) — gestionan todas las mutaciones (CREATE, UPDATE, DELETE) y ejecutan `revalidatePath` tras cada operación exitosa.
- **Client Components** — formularios, diálogos de confirmación y componentes interactivos que consumen los Route Handlers mediante `fetch()`.
- **Módulos** — cada entidad de negocio (clientes, empleados, proyectos, tareas) está encapsulada en `src/modules/<entidad>/` con sus propios componentes, esquemas de validación y lógica.

No se utiliza autenticación. La aplicación utiliza Supabase como base de datos PostgreSQL. La conexión se configura mediante variables de entorno (NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY), y las operaciones principales se realizan desde el entorno de servidor de Next.js.

---

## Requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Supabase** — proyecto activo (plan gratuito suficiente)

---

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd minierp

# Instalar dependencias
npm install
```

### Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores desde el dashboard de tu proyecto de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```

### Base de datos

El proyecto incluye migraciones y datos semilla.

Las migraciones se encuentran en `supabase/migrations/` y deben ejecutarse **en orden cronológico** (por prefijo de fecha):

1. `20260721010000_initial_schema.sql`
2. `20260722010000_set_tareas_empleado_not_null.sql`

**Opción A — Supabase SQL Editor:**
1. Abre el dashboard de Supabase > SQL Editor.
2. Pega y ejecuta cada archivo de `supabase/migrations/` en orden ascendente.
3. Luego, pega y ejecuta `supabase/seed.sql`.

**Opción B — Supabase CLI:**
```bash
supabase db push
```

> **Acerca del seed:** El archivo `supabase/seed.sql` es **idempotente**: elimina los datos demo existentes y los vuelve a crear. Puedes ejecutarlo cuantas veces sea necesario en desarrollo. No lo ejecutes en una base de datos de producción con información real, ya que reemplazará todos los datos.

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con TurboPack |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint en todo el proyecto |
| `npm run typecheck` | Ejecuta TypeScript sin emitir archivos |

---

## Funcionalidades

### Dashboard (`/`)
Seis tarjetas KPI con enlaces directos: total de clientes, empleados, proyectos, tareas completadas, tareas pendientes y proyectos con retraso. Incluye tabla de últimos proyectos y lista de próximos vencimientos.

### Clientes (`/clientes`)
CRUD completo con formularios validados. Permite crear, editar, visualizar y eliminar clientes. Cada cliente puede tener múltiples proyectos asociados.

### Empleados (`/empleados`)
CRUD completo con roles y estados. Los empleados pueden ser asignados a proyectos y tareas. No se puede eliminar un empleado que tenga tareas asignadas: la API devuelve HTTP 409. Las tareas deben reasignarse o resolverse antes de eliminar al empleado.

### Proyectos (`/proyectos`)
CRUD completo con asignación de empleados, prioridades y estados. Incluye validación de fechas y diagrama de Gantt básico.

### Tareas (`/tareas`)
Tablero Kanban con tres columnas (Pendiente, En progreso, Completada). Las tareas se asignan a proyectos y empleados, con prioridad y fecha límite. El cambio de estado se realiza mediante un selector en cada tarjeta del Kanban.

### Kanban
El cambio de estado se realiza mediante selectores en cada tarjeta. No se implementó funcionalidad de arrastrar y soltar (Drag & Drop).

### Gantt (`/proyectos/gantt`)
Vista de planificación que muestra proyectos y sus tareas en una línea de tiempo horizontal.

### KPIs
Seis indicadores en el dashboard con recuentos en tiempo real y semáforo de retrasos.

---

## Decisiones técnicas

### Next.js App Router
Se eligió App Router por su modelo híbrido de Server y Client Components, que permite minimizar el JavaScript enviado al cliente y maximizar el renderizado en servidor.

### Server Components
Todas las lecturas de datos se realizan en Server Components. Esto elimina la necesidad de estados de carga en el cliente, mejora el SEO y la primera impresión de carga.

### Route Handlers
Las mutaciones se centralizan en Route Handlers (`/api/*`) en lugar de usar Server Actions. Esto mantiene una API explícita, fácil de auditar y de consumir desde cualquier cliente. Tras cada mutación se ejecuta `revalidatePath` para refrescar los Server Components.

### Zod v4
Se utiliza Zod para la validación de formularios en el cliente y de los datos entrantes en los Route Handlers. Los esquemas están centralizados por módulo y son compartidos entre cliente y servidor.

### Supabase (sin auth)
El proyecto no requiere autenticación. Supabase se usa únicamente como base de datos PostgreSQL con la anon key desde el servidor. Esto simplifica la configuración y evita exponer datos sensibles.

### Tailwind CSS v4
Se adopta Tailwind en su versión 4 con configuración CSS nativa (sin `tailwind.config.*`). La paleta y los estilos base se definen en `globals.css` mediante el plugin `@tailwindcss/postcss`.

---

## Supuestos y reglas de negocio

- **Empleado responsable en tareas:** Cada tarea requiere un empleado responsable. El empleado debe pertenecer al equipo del proyecto. La regla se valida tanto en frontend (selector deshabilitado si no hay empleados en el proyecto) como en backend (validación contra `proyecto_empleado`).
- **Protección al retirar empleados:** No se puede retirar de un proyecto a un empleado que tenga tareas asignadas dentro de ese proyecto. La API devuelve HTTP 409 con el nombre del empleado. Las tareas deben reasignarse antes de retirarlo.
- **Protección al eliminar empleados:** No se puede eliminar un empleado que tenga tareas asignadas. La API devuelve HTTP 409.
- **Estados de tarea:** Los estados disponibles son Pendiente, En progreso y Completada. No se implementó una secuencia estricta de transiciones porque el requerimiento no la exige explícitamente.
- **Autenticación:** Quedó fuera del alcance obligatorio. El proyecto funciona sin login, con acceso completo a todas las funcionalidades.

---

## Estructura del proyecto

```
minierp/
├── docs/                          # Documentación del proyecto
│   ├── 00-project-brief.md
│   ├── 01-requirements.md
│   ├── 02-architecture.md
│   ├── 03-database.md
│   ├── 04-ui.md
│   └── 05-implementation-plan.md
├── public/                        # Archivos estáticos
├── src/
│   ├── app/
│   │   ├── (app)/                 # Grupo de rutas del layout principal
│   │   │   ├── clientes/          # CRUD de clientes
│   │   │   ├── empleados/         # CRUD de empleados
│   │   │   ├── proyectos/         # CRUD de proyectos + vista Gantt
│   │   │   └── tareas/            # Tablero Kanban de tareas
│   │   ├── api/                   # Route Handlers
│   │   │   ├── clientes/
│   │   │   ├── empleados/
│   │   │   ├── proyectos/
│   │   │   └── tareas/
│   │   ├── globals.css            # Estilos globales + configuración Tailwind
│   │   ├── layout.tsx             # Layout raíz
│   │   └── page.tsx               # Dashboard
│   ├── components/
│   │   ├── shared/                # Componentes compartidos (ConfirmDialog, etc.)
│   │   └── ui/                    # Componentes shadcn/ui
│   ├── lib/
│   │   ├── supabase/              # Cliente de Supabase (server-only)
│   │   └── api-error.ts           # Manejador de errores de API
│   └── modules/
│       ├── clientes/              # Módulo de clientes
│       │   ├── components/
│       │   └── schemas/
│       ├── empleados/             # Módulo de empleados
│       │   ├── components/
│       │   └── schemas/
│       ├── inicio/                # Módulo del dashboard
│       │   └── components/
│       ├── proyectos/             # Módulo de proyectos
│       │   ├── components/
│       │   └── schemas/
│       └── tareas/                # Módulo de tareas
│           ├── components/
│           └── schemas/
├── supabase/
│   ├── migrations/                # Migraciones DDL
│   └── seed.sql                   # Datos de prueba
├── .env.example                   # Plantilla de variables de entorno
├── components.json                # Configuración de shadcn/ui
├── next.config.ts                 # Configuración de Next.js
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Capturas de pantalla

## Capturas de pantalla

### Dashboard

![Dashboard]<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/847ead35-2eb3-4acc-9bb2-432422b42ea3" />


### Clientes

![Clientes]<img width="1920" height="1040" alt="image" src="https://github.com/user-attachments/assets/71a08957-ba7f-4be2-96df-4a533a2f4b39" />


### Proyectos

![Proyectos]<img width="1920" height="1040" alt="image" src="https://github.com/user-attachments/assets/f3b02c74-04c5-445e-b15a-c10d7f5ffabd" />


### Kanban

![Kanban]<img width="1920" height="1040" alt="image" src="https://github.com/user-attachments/assets/28b312b5-61c4-492a-9463-57ac40895878" />


## Mejoras futuras

- **Autenticación y roles** — Integrar Supabase Auth para gestionar permisos por usuario.
- **Paginación y búsqueda** — En listas de clientes, empleados y proyectos con filtros combinados.
- **Notificaciones en tiempo real** — Usar suscripciones de Supabase Realtime para actualizaciones de tareas.
- **Modo oscuro** — Soporte completo con Tailwind y shadcn/ui.
- **Exportación** — Exportar reportes a PDF/CSV desde cualquier módulo.
- **Drag & Drop** — Implementar Kanban con arrastre mediante librería especializada.
- **Pruebas automatizadas** — Tests unitarios con Vitest y e2e con Playwright.

---

## Despliegue en Vercel

1. Sube o conecta el repositorio a [GitHub](https://github.com).
2. Ve a [Vercel](https://vercel.com) e importa el repositorio.
3. En la sección **Environment Variables**, agrega:

   | Variable | Valor |
   |----------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de tu proyecto Supabase |

4. Antes del despliegue, ejecuta la migración y el seed en la base de datos de Supabase que usará producción (SQL Editor o Supabase CLI).
5. Haz clic en **Deploy**.
6. Una vez desplegado, verifica las rutas principales:

   - `/` — Dashboard con KPIs
   - `/clientes` — Lista de clientes
   - `/empleados` — Lista de empleados
   - `/proyectos` — Lista de proyectos
   - `/tareas` — Tablero Kanban

   Prueba operaciones CRUD en cada módulo para confirmar que la conexión a Supabase funciona correctamente.

---

## Autor

**Zosimo Lee Vargas** — Prueba técnica desarrollada para AGENTIQ.

Desarrollado con Next.js 16 + Supabase + Tailwind CSS + shadcn/ui.
