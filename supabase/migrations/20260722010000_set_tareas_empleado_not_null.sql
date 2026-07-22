-- Migration: 20260722010000_set_tareas_empleado_not_null
-- Description: Make tareas.empleado_id NOT NULL and change FK from SET NULL to RESTRICT
-- Prerequisites: 20260721010000_initial_schema.sql must have been executed
-- Execute: Paste into Supabase SQL Editor or run via Supabase CLI

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM tareas
    WHERE empleado_id IS NULL
  ) THEN
    RAISE EXCEPTION
      'Existen tareas con empleado_id NULL. Corrígelas antes de ejecutar esta migración.';
  END IF;
END $$;

ALTER TABLE tareas
  ALTER COLUMN empleado_id SET NOT NULL;

ALTER TABLE tareas
  DROP CONSTRAINT fk_tareas_empleado_id;

ALTER TABLE tareas
  ADD CONSTRAINT fk_tareas_empleado_id
  FOREIGN KEY (empleado_id)
  REFERENCES empleados(id)
  ON DELETE RESTRICT;
