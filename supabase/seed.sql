-- Seed: MiniERP demo data
-- Execute AFTER the migration above has been run.
-- Paste into Supabase SQL Editor or run via Supabase CLI.
-- Requirements: clientes, empleados, proyectos, tareas, proyecto_empleado tables must exist.
--
-- WARNING: This seed replaces all existing demo data. It is idempotent and safe to run
-- multiple times on a development or staging database. DO NOT run on a production
-- database with real data, as it will delete all existing rows.

-- ============================================================
-- CLEANUP — Remove existing demo data respecting FK order
-- ============================================================

TRUNCATE TABLE tareas CASCADE;
TRUNCATE TABLE proyecto_empleado CASCADE;
TRUNCATE TABLE proyectos CASCADE;
TRUNCATE TABLE empleados CASCADE;
TRUNCATE TABLE clientes CASCADE;

-- ============================================================
-- CLIENTES
-- ============================================================

INSERT INTO clientes (nombre, nit, email, telefono, direccion) VALUES
    ('TechCorp S.A.', '123456789-0', 'contacto@techcorp.com', '+57 300 111 2233', NULL),
    ('InnovaSoft Ltda.', '987654321-0', 'info@innovasoft.co', '+57 310 444 5566', NULL),
    ('GlobalBank', '456789123-0', 'proyectos@globalbank.com', '+57 320 777 8899', NULL),
    ('GreenEnergy SAS', NULL, 'ops@greenenergy.io', NULL, NULL);

-- ============================================================
-- EMPLEADOS
-- ============================================================

INSERT INTO empleados (nombre, email, rol, estado) VALUES
    ('Carlos Méndez', 'carlos@agentiq.com', 'Desarrollador', 'Activo'),
    ('Ana Velasco', 'ana@agentiq.com', 'Diseñadora', 'Activo'),
    ('Pedro Ruiz', 'pedro@agentiq.com', 'Project Manager', 'Activo'),
    ('Laura Gómez', 'laura@agentiq.com', 'QA', 'Activo'),
    ('Sergio Mora', 'sergio@agentiq.com', 'Desarrollador', 'Activo'),
    ('Diana Reyes', 'diana@agentiq.com', 'Desarrollador', 'Inactivo');

-- ============================================================
-- PROYECTOS
-- ============================================================

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
    ('Rediseño Web InnovaSoft', 'InnovaSoft Ltda.', 'Rediseño completo del sitio web corporativo', '2025-08-01'::DATE, '2025-12-15'::DATE, 'Media', 'Completado'),
    ('Consultoría TI GreenEnergy', 'GreenEnergy SAS', 'Evaluación de infraestructura tecnológica', '2026-04-01'::DATE, '2026-06-30'::DATE, 'Baja', 'Planeado')
) AS p(nombre, cliente_nombre, descripcion, fecha_inicio, fecha_entrega, prioridad, estado)
JOIN clientes c ON c.nombre = p.cliente_nombre;

-- ============================================================
-- PROYECTO_EMPLEADO (asignaciones)
-- ============================================================

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

-- ============================================================
-- TAREAS
-- ============================================================

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
