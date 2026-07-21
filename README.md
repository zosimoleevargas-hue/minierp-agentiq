# MiniERP — Gestión de Proyectos

Herramienta interna para AGENTIQ. Stack: Next.js 16 + Supabase + Tailwind CSS + shadcn/ui.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

Copia `.env.example` a `.env.local` y completa los valores desde el dashboard de Supabase.

## Base de datos

El proyecto **no requiere autenticación**. Toda comunicación con Supabase ocurre desde el servidor.

### Ejecutar migración (crear tablas)

**Opción A — Supabase SQL Editor:**
1. Abre el dashboard de Supabase > SQL Editor.
2. Pega el contenido de `supabase/migrations/20260721010000_initial_schema.sql`.
3. Ejecuta.

**Opción B — Supabase CLI:**
```bash
supabase db push
```

### Poblar datos semilla

Después de la migración, ejecuta `supabase/seed.sql` en el SQL Editor.

### Verificar

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- Debería mostrar: clientes, empleados, proyectos, tareas, proyecto_empleado

SELECT COUNT(*) FROM clientes;      -- 4
SELECT COUNT(*) FROM empleados;     -- 6
SELECT COUNT(*) FROM proyectos;     -- 6
SELECT COUNT(*) FROM tareas;        -- 13
SELECT COUNT(*) FROM proyecto_empleado; -- 11
```

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Documentación detallada del proyecto en `docs/`.
