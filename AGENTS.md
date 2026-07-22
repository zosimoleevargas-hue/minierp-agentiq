<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Summary (Last Updated: 2026-07-22)
### Overview
Applied all PDF-required corrections (estado derivado, email obligatorio, empleado obligatorio, delete protection, DB migration) and completed comprehensive audit.
### Changes
- **Estado derivado de tareas**: Eliminado selector manual de estado en proyecto-form. Implementado `estadoDerivado` computed en fetch y POST/PUT de proyecto. Sincronización en PUT de tarea. Commit `bc1e277`, desplegado.
- **Page descriptions**: Eliminadas etiquetas `<p>` descriptivas de 14 encabezados de página. Commit `bc1e277`.
- **Email de cliente obligatorio**: Schema restaurado a `z.string().min(1).email()...`. Asterisco en label. API routes ya no normalizan `|| null`. Migración propuesta para NOT NULL.
- **Empleado en tarea obligatorio**: Schema cambiado a `z.string().uuid(...)`. Sin opción "Sin asignar". Select deshabilitado si proyecto sin empleados. Validación servidor (empleado debe pertenecer al proyecto). Sin autoselección.
- **Protección eliminación empleados**: DELETE verifica tareas → 409 si existe. Dialog descripción actualizada.
- **Migración creada**: `supabase/migrations/20260722010000_set_tareas_empleado_not_null.sql` (verifica NULLs, SET NOT NULL, recrea FK ON DELETE RESTRICT). NO ejecutada.
- **Archivos eliminados**: Normalization script, server client, SLP_ROLE_KEY de .env.example.
### Current State
- **Active**: Comprehensive audit — findings pass to user for decision.
- **Next Move**: Deliver final audit report with severity-ranked findings and verdict.
