-- Migration: 20260721010000_initial_schema
-- Description: Create all tables, constraints, indexes for MiniERP
-- Execute: Paste into Supabase SQL Editor or run via Supabase CLI

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    nit TEXT,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    rol TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Activo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE proyectos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    cliente_id UUID NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_entrega DATE NOT NULL,
    prioridad TEXT,
    estado TEXT NOT NULL DEFAULT 'Planeado',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tareas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    proyecto_id UUID NOT NULL,
    empleado_id UUID,
    prioridad TEXT,
    fecha_limite DATE,
    estado TEXT NOT NULL DEFAULT 'Pendiente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE proyecto_empleado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID NOT NULL,
    empleado_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- FOREIGN KEYS
-- ============================================================

ALTER TABLE proyectos
    ADD CONSTRAINT fk_proyectos_cliente_id
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT;

ALTER TABLE tareas
    ADD CONSTRAINT fk_tareas_proyecto_id
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE;

ALTER TABLE tareas
    ADD CONSTRAINT fk_tareas_empleado_id
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE SET NULL;

ALTER TABLE proyecto_empleado
    ADD CONSTRAINT fk_proyecto_empleado_proyecto_id
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE;

ALTER TABLE proyecto_empleado
    ADD CONSTRAINT fk_proyecto_empleado_empleado_id
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE;

-- ============================================================
-- UNIQUE CONSTRAINTS
-- ============================================================

ALTER TABLE clientes
    ADD CONSTRAINT uq_clientes_email UNIQUE (email);

ALTER TABLE empleados
    ADD CONSTRAINT uq_empleados_email UNIQUE (email);

ALTER TABLE proyecto_empleado
    ADD CONSTRAINT uq_proyecto_empleado_pair UNIQUE (proyecto_id, empleado_id);

-- ============================================================
-- CHECK CONSTRAINTS
-- ============================================================

ALTER TABLE proyectos
    ADD CONSTRAINT ck_proyectos_estado
    CHECK (estado IN ('Planeado', 'En progreso', 'Completado'));

ALTER TABLE proyectos
    ADD CONSTRAINT ck_proyectos_fechas
    CHECK (fecha_entrega > fecha_inicio);

ALTER TABLE proyectos
    ADD CONSTRAINT ck_proyectos_prioridad
    CHECK (prioridad IS NULL OR prioridad IN ('Baja', 'Media', 'Alta'));

ALTER TABLE tareas
    ADD CONSTRAINT ck_tareas_estado
    CHECK (estado IN ('Pendiente', 'En progreso', 'Completada'));

ALTER TABLE tareas
    ADD CONSTRAINT ck_tareas_prioridad
    CHECK (prioridad IS NULL OR prioridad IN ('Baja', 'Media', 'Alta'));

ALTER TABLE empleados
    ADD CONSTRAINT ck_empleados_estado
    CHECK (estado IN ('Activo', 'Inactivo'));

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_clientes
    BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_empleados
    BEFORE UPDATE ON empleados
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_proyectos
    BEFORE UPDATE ON proyectos
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_tareas
    BEFORE UPDATE ON tareas
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Note: proyecto_empleado does NOT have updated_at — it is an associative table
-- whose only mutable attribute is the relationship itself (no business columns).

-- ============================================================
-- INDEXES
-- ============================================================

-- FK indexes
CREATE INDEX idx_proyectos_cliente_id ON proyectos(cliente_id);
CREATE INDEX idx_tareas_proyecto_id ON tareas(proyecto_id);
CREATE INDEX idx_tareas_empleado_id ON tareas(empleado_id);
CREATE INDEX idx_proyecto_empleado_proyecto_id ON proyecto_empleado(proyecto_id);
CREATE INDEX idx_proyecto_empleado_empleado_id ON proyecto_empleado(empleado_id);

-- Estado indexes (filters)
CREATE INDEX idx_proyectos_estado ON proyectos(estado);
CREATE INDEX idx_tareas_estado ON tareas(estado);

-- Fecha indexes (sorting, Gantt, KPIs)
CREATE INDEX idx_proyectos_fecha_inicio ON proyectos(fecha_inicio);
CREATE INDEX idx_proyectos_fecha_entrega ON proyectos(fecha_entrega);
CREATE INDEX idx_tareas_fecha_limite ON tareas(fecha_limite);

-- Búsqueda indexes
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_empleados_rol ON empleados(rol);
CREATE INDEX idx_empleados_estado ON empleados(estado);

-- Compuesto (Kanban: filtrar tareas por proyecto + estado)
CREATE INDEX idx_tareas_proyecto_estado ON tareas(proyecto_id, estado);
