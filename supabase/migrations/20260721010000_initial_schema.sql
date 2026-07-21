-- Migration: initial_schema
-- Description: Create all tables, constraints, indexes, and seed data for MiniERP

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
    estado TEXT NOT NULL,
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
    estado TEXT NOT NULL,
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
    estado TEXT NOT NULL,
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

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_proyectos_cliente_id ON proyectos(cliente_id);
CREATE INDEX idx_tareas_proyecto_id ON tareas(proyecto_id);
CREATE INDEX idx_tareas_empleado_id ON tareas(empleado_id);
CREATE INDEX idx_proyecto_empleado_proyecto_id ON proyecto_empleado(proyecto_id);
CREATE INDEX idx_proyecto_empleado_empleado_id ON proyecto_empleado(empleado_id);

CREATE INDEX idx_proyectos_estado ON proyectos(estado);
CREATE INDEX idx_tareas_estado ON tareas(estado);

CREATE INDEX idx_proyectos_fecha_inicio ON proyectos(fecha_inicio);
CREATE INDEX idx_proyectos_fecha_entrega ON proyectos(fecha_entrega);
CREATE INDEX idx_tareas_fecha_limite ON tareas(fecha_limite);

CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_empleados_rol ON empleados(rol);
CREATE INDEX idx_empleados_estado ON empleados(estado);

CREATE INDEX idx_tareas_proyecto_estado ON tareas(proyecto_id, estado);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO clientes (nombre, nit, email, telefono, direccion) VALUES
    ('TechCorp S.A.', '123456789-0', 'contacto@techcorp.com', '+57 300 111 2233', NULL),
    ('InnovaSoft Ltda.', '987654321-0', 'info@innovasoft.co', '+57 310 444 5566', NULL),
    ('GlobalBank', '456789123-0', 'proyectos@globalbank.com', '+57 320 777 8899', NULL),
    ('GreenEnergy SAS', NULL, 'ops@greenenergy.io', NULL, NULL);

INSERT INTO empleados (nombre, email, rol, estado) VALUES
    ('Carlos Méndez', 'carlos@agentiq.com', 'Desarrollador', 'Activo'),
    ('Ana Velasco', 'ana@agentiq.com', 'Diseñadora', 'Activo'),
    ('Pedro Ruiz', 'pedro@agentiq.com', 'Project Manager', 'Activo'),
    ('Laura Gómez', 'laura@agentiq.com', 'QA', 'Activo'),
    ('Sergio Mora', 'sergio@agentiq.com', 'Desarrollador', 'Activo'),
    ('Diana Reyes', 'diana@agentiq.com', 'Desarrollador', 'Inactivo');

INSERT INTO proyectos (nombre, cliente_id, descripcion, fecha_inicio, fecha_entrega, prioridad, estado)
SELECT
    p.nombre,
    c.id,
    p.descripcion,
    p.fecha_inicio,
    p.fecha_entrega,
    p.prioridad,
    p.estado
FROM (VALUES
    ('Portal Web TechCorp', 'TechCorp S.A.', 'Portal corporativo con landing page y CMS', '2026-01-15'::DATE, '2026-04-15'::DATE, 'Alta', 'En progreso'),
    ('App Móvil InnovaSoft', 'InnovaSoft Ltda.', 'Aplicación móvil para gestión de inventarios', '2026-02-01'::DATE, '2026-06-30'::DATE, 'Media', 'Planeado'),
    ('Core Banking GlobalBank', 'GlobalBank', 'Modernización del sistema bancario central', '2025-10-01'::DATE, '2026-03-01'::DATE, 'Alta', 'En progreso'),
    ('Dashboard GreenEnergy', 'GreenEnergy SAS', 'Dashboard de monitoreo de energía renovable', '2026-03-01'::DATE, '2026-05-15'::DATE, 'Baja', 'Planeado'),
    ('Rediseño Web InnovaSoft', 'InnovaSoft Ltda.', 'Rediseño completo del sitio web corporativo', '2025-08-01'::DATE, '2025-12-15'::DATE, 'Media', 'Completado')
) AS p(nombre, cliente_nombre, descripcion, fecha_inicio, fecha_entrega, prioridad, estado)
JOIN clientes c ON c.nombre = p.cliente_nombre;

INSERT INTO proyecto_empleado (proyecto_id, empleado_id)
SELECT pr.id, e.id
FROM (VALUES
    ('Portal Web TechCorp', 'Carlos Méndez'),
    ('Portal Web TechCorp', 'Ana Velasco'),
    ('Portal Web TechCorp', 'Laura Gómez'),
    ('App Móvil InnovaSoft', 'Sergio Mora'),
    ('App Móvil InnovaSoft', 'Ana Velasco'),
    ('Core Banking GlobalBank', 'Carlos Méndez'),
    ('Core Banking GlobalBank', 'Pedro Ruiz'),
    ('Dashboard GreenEnergy', 'Sergio Mora'),
    ('Rediseño Web InnovaSoft', 'Ana Velasco'),
    ('Rediseño Web InnovaSoft', 'Pedro Ruiz'),
    ('Rediseño Web InnovaSoft', 'Laura Gómez')
) AS pe(proyecto_nombre, empleado_nombre)
JOIN proyectos pr ON pr.nombre = pe.proyecto_nombre
JOIN empleados e ON e.nombre = pe.empleado_nombre;

INSERT INTO tareas (titulo, descripcion, proyecto_id, empleado_id, prioridad, fecha_limite, estado)
SELECT
    t.titulo,
    NULL,
    pr.id,
    e.id,
    t.prioridad,
    t.fecha_limite,
    t.estado
FROM (VALUES
    ('Diseñar mockups del portal', 'Portal Web TechCorp', 'Ana Velasco', 'Alta', '2026-02-01'::DATE, 'Completada'),
    ('Maquetar landing page', 'Portal Web TechCorp', 'Carlos Méndez', 'Alta', '2026-02-20'::DATE, 'En progreso'),
    ('Configurar CI/CD', 'Portal Web TechCorp', 'Carlos Méndez', 'Media', NULL, 'Pendiente'),
    ('Pruebas de humo portal', 'Portal Web TechCorp', 'Laura Gómez', 'Alta', '2026-03-15'::DATE, 'Pendiente'),
    ('Definir arquitectura app', 'App Móvil InnovaSoft', 'Sergio Mora', 'Alta', '2026-02-28'::DATE, 'Pendiente'),
    ('Diseñar onboarding', 'App Móvil InnovaSoft', 'Ana Velasco', 'Media', '2026-04-01'::DATE, 'Pendiente'),
    ('Migrar base de datos', 'Core Banking GlobalBank', 'Carlos Méndez', 'Alta', '2026-01-15'::DATE, 'Completada'),
    ('Implementar API REST', 'Core Banking GlobalBank', 'Carlos Méndez', 'Alta', '2026-02-28'::DATE, 'En progreso'),
    ('Auditoría de seguridad', 'Core Banking GlobalBank', 'Pedro Ruiz', 'Alta', '2026-03-10'::DATE, 'Pendiente'),
    ('Corregir bug en login', 'Core Banking GlobalBank', 'Carlos Méndez', 'Media', '2025-12-01'::DATE, 'Completada'),
    ('Diseñar dashboard', 'Dashboard GreenEnergy', 'Sergio Mora', 'Baja', '2026-04-30'::DATE, 'Pendiente'),
    ('Actualizar estilos web', 'Rediseño Web InnovaSoft', 'Ana Velasco', 'Media', '2025-10-15'::DATE, 'Completada'),
    ('QA del rediseño', 'Rediseño Web InnovaSoft', 'Laura Gómez', 'Media', '2025-12-01'::DATE, 'Completada')
) AS t(titulo, proyecto_nombre, empleado_nombre, prioridad, fecha_limite, estado)
JOIN proyectos pr ON pr.nombre = t.proyecto_nombre
LEFT JOIN empleados e ON e.nombre = t.empleado_nombre;
