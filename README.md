# MiniERP — Sistema de Gestión de Proyectos

Aplicación web full-stack tipo ERP ligero para la gestión interna de proyectos, clientes, empleados y tareas. Desarrollada como prueba técnica para **AGENTIQ**.

El sistema permite administrar el ciclo de vida completo de proyectos: desde el registro de clientes y empleados, pasando por la planificación y asignación de proyectos, hasta el seguimiento de tareas en un tablero Kanban con transiciones de estado validadas.

## Enlaces

- Aplicación desplegada: https://minierp-seven.vercel.app
- Repositorio: <URL DEL REPOSITORIO>

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

No se utiliza autenticación. La comunicación con Supabase se realiza exclusivamente desde el servidor usando la anon key.

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

El proyecto incluye migraciones y datos semilla:

**Opción A — Supabase SQL Editor:**
1. Abre el dashboard de Supabase > SQL Editor.
2. Pega y ejecuta el contenido de `supabase/migrations/20260721010000_initial_schema.sql`.
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
CRUD completo con roles y estados. Los empleados pueden ser asignados a proyectos y tareas. Al eliminar un empleado, sus tareas quedan sin responsable y se eliminan sus asignaciones a proyectos.

### Proyectos (`/proyectos`)
CRUD completo con asignación de empleados, prioridades y estados. Incluye validación de fechas y diagrama de Gantt básico.

### Tareas (`/tareas`)
Tablero Kanban con tres columnas (Pendiente, En progreso, Completada). Las tareas se asignan a proyectos y empleados, con prioridad y fecha límite. Las transiciones de estado están validadas (no se puede retroceder ni saltar estados).

### Kanban
Interfaz drag-free con selects de transición de estado. Cada tarea muestra proyecto, asignado, prioridad y fecha límite.

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
│   │   ├── (app)/                 # Layout principal + rutas protegidas (sin auth)
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

> *(Agregar aquí capturas de las siguientes vistas)*

| Vista | Archivo |
|-------|---------|
| Dashboard | `screenshots/dashboard.png` |
| Lista de clientes | `screenshots/clientes.png` |
| Formulario de cliente | `screenshots/cliente-form.png` |
| Lista de empleados | `screenshots/empleados.png` |
| Lista de proyectos | `screenshots/proyectos.png` |
| Formulario de proyecto | `screenshots/proyecto-form.png` |
| Diagrama Gantt | `screenshots/gantt.png` |
| Tablero Kanban | `screenshots/kanban.png` |

---

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

**Prueba técnica — AGENTIQ**

Desarrollado con Next.js 16 + Supabase + Tailwind CSS + shadcn/ui.
