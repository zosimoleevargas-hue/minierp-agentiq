# Análisis de Requisitos — MiniERP (AGENTIQ)

---

## Resumen Ejecutivo

AGENTIQ es una empresa de desarrollo de software que gestiona múltiples proyectos de clientes en paralelo. Actualmente la gestión se realiza de forma manual y dispersa (hojas de cálculo, chats, notas sueltas), lo que impide tener visibilidad clara del estado de cada proyecto.

Se requiere construir un **mini ERP de gestión de proyectos** — una herramienta interna que centralice la administración de clientes, proyectos, equipos y tareas, y que proporcione visibilidad del avance de cada proyecto de principio a fin. La aplicación será web, responsiva, con persistencia real en Supabase (PostgreSQL) y desplegada en Vercel.

---

## Objetivos del negocio

### ¿Qué problema resuelve?

- Elimina la gestión dispersa en hojas de cálculo, chats y notas sueltas.
- Centraliza la información de clientes, proyectos, tareas y empleados en un solo sistema.
- Proporciona visibilidad en tiempo real del avance de cada proyecto.
- Facilita la detección de tareas vencidas y cuellos de botella.
- Permite a la dirección tener una lectura rápida del estado general de la operación mediante KPIs.

### ¿Quién lo utilizará?

- **Dirección/Gerencia**: requiere visibilidad del estado general de la empresa mediante KPIs y cronograma (Gantt).
- **Project Managers**: gestionan clientes, proyectos, asignación de empleados y seguimiento de tareas.
- **Equipo de desarrollo/operaciones**: consultan y actualizan el estado de sus tareas asignadas.
- **Área administrativa/comercial**: registra clientes y consulta la carga de trabajo del equipo.

---

## Requerimientos funcionales

### Módulo Inicio (Dashboard)

| ID | Requerimiento | Obligatorio |
|---|---|---|
| RF-01 | Mostrar tarjeta de **Proyectos activos**: cantidad de proyectos en estado "En progreso" | Sí |
| RF-02 | Mostrar tarjeta de **Proyectos completados**: total histórico (o del mes actual) de proyectos en estado "Completado" | Sí |
| RF-03 | Mostrar tarjeta de **Tareas pendientes**: suma de tareas en estado "Pendiente" + "En progreso" en todos los proyectos | Sí |
| RF-04 | Mostrar tarjeta de **Tareas vencidas**: tareas cuya fecha límite ya pasó y que no están en estado "Completada" | Sí |
| RF-05 | Mostrar tarjeta de **Clientes activos**: total de clientes registrados con al menos un proyecto vigente | Sí |
| RF-06 | Mostrar tarjeta de **Empleados activos**: total de miembros del equipo disponibles para asignación | Sí |
| RF-07 | Mostrar un **gráfico de proyectos agrupados por estado** (barras o dona) | Recomendado |
| RF-08 | Mostrar un listado de **"Próximos vencimientos"**: las 5 tareas con fecha límite más cercana | Recomendado |

### Módulo Clientes

| ID | Requerimiento | Obligatorio |
|---|---|---|
| RF-09 | Formulario de registro de cliente con campos: Nombre o razón social (obligatorio) | Sí |
| RF-10 | Campo Identificación/NIT (opcional) | Sí |
| RF-11 | Campo Correo de contacto (obligatorio) | Sí |
| RF-12 | Campo Teléfono (opcional) | Sí |
| RF-13 | Campo Dirección (opcional) | Sí |
| RF-14 | Formulario de edición de cliente (mismos campos) | Sí |
| RF-15 | Listado de clientes con buscador por nombre | Sí |
| RF-16 | Eliminar un cliente con validación: si tiene proyectos asociados, mostrar advertencia antes de eliminar | Sí |
| RF-17 | Vista de detalle de cliente: datos del cliente + listado de proyectos asociados | Sí |

### Módulo Proyectos

| ID | Requerimiento | Obligatorio |
|---|---|---|
| RF-18 | Formulario de creación de proyecto con: Nombre (obligatorio) | Sí |
| RF-19 | Cliente asociado (obligatorio, seleccionable de lista de clientes existentes) | Sí |
| RF-20 | Campo Descripción (opcional) | Sí |
| RF-21 | Fecha de inicio (obligatorio) | Sí |
| RF-22 | Fecha estimada de entrega (obligatorio, debe ser posterior a la fecha de inicio) | Sí |
| RF-23 | Prioridad (opcional: Baja, Media, Alta) | Sí |
| RF-24 | Estado inicial: "Planeado" por defecto | Sí |
| RF-25 | Empleados asignados (selección múltiple de empleados ya registrados) | Sí |
| RF-26 | Estados del proyecto: Planeado → En progreso → Completado | Sí |
| RF-27 | Cambio de estado a "En progreso" automático al tener al menos una tarea activa | Sí |
| RF-28 | Cambio de estado a "Completado" automático si todas las tareas están "Completada", o manual | Sí |
| RF-29 | Listado de proyectos (tabla o tarjetas) con: nombre, cliente, estado (con color distintivo), % de avance, fecha de entrega | Sí |
| RF-30 | Vista de detalle de proyecto: información general, equipo asignado, tablero/listado de tareas | Sí |
| RF-31 | **Vista de Cronograma (Gantt)**: línea de tiempo con todos los proyectos según fecha de inicio y fecha de entrega, agrupados por estado | Sí |
| RF-32 | Editar proyecto | Implícito |
| RF-33 | Eliminar proyecto con validaciones | Implícito |

### Módulo Tareas

| ID | Requerimiento | Obligatorio |
|---|---|---|
| RF-34 | Formulario de creación de tarea con: Título (obligatorio) | Sí |
| RF-35 | Campo Descripción (opcional) | Sí |
| RF-36 | Proyecto al que pertenece (obligatorio) | Sí |
| RF-37 | Empleado asignado (obligatorio, seleccionable de empleados asignados al proyecto) | Sí |
| RF-38 | Prioridad (opcional: Baja, Media, Alta) | Sí |
| RF-39 | Fecha límite (opcional) | Sí |
| RF-40 | Estados de tarea: Pendiente → En progreso → Completada | Sí |
| RF-41 | Cambio de estado entre los tres estados posibles | Sí |
| RF-42 | Vista tipo tablero (Kanban simple) que agrupe tareas por estado | Sí |
| RF-43 | Editar tarea | Sí |
| RF-44 | Eliminar tarea | Sí |

### Módulo Empleados

| ID | Requerimiento | Obligatorio |
|---|---|---|
| RF-45 | Formulario de registro de empleado con: Nombre completo (obligatorio) | Sí |
| RF-46 | Campo Correo (obligatorio) | Sí |
| RF-47 | Campo Rol o cargo (obligatorio, ej: Desarrollador, Diseñador, Project Manager, QA) | Sí |
| RF-48 | Campo Estado (Activo / Inactivo) | Sí |
| RF-49 | Formulario de edición de empleado | Sí |
| RF-50 | Listado de empleados con filtro por rol y por estado | Sí |
| RF-51 | Vista de detalle de empleado: tareas activas asignadas y proyectos en los que participa (carga de trabajo actual) | Sí |

---

## Requerimientos no funcionales

### Performance

| ID | Requerimiento |
|---|---|
| RNF-01 | Los tiempos de carga del dashboard con KPIs deben ser aceptables (< 3 segundos en condiciones normales) |
| RNF-02 | Las consultas a Supabase deben estar optimizadas (evitar N+1, usar joins e índices adecuados) |
| RNF-03 | El listado de proyectos y tareas debe cargarse de forma eficiente incluso con volúmenes moderados de datos |

### Responsive

| ID | Requerimiento |
|---|---|
| RNF-04 | La interfaz debe ser completamente responsiva, funcionando en dispositivos móviles, tablets y desktop |
| RNF-05 | El tablero Kanban debe adaptarse a pantallas pequeñas (ej. vista de lista en móvil) |
| RNF-06 | El cronograma Gantt debe ser navegable en pantallas de cualquier tamaño |

### Seguridad

| ID | Requerimiento |
|---|---|
| RNF-07 | Las credenciales de Supabase deben manejarse exclusivamente mediante variables de entorno (.env), nunca hardcodeadas |
| RNF-08 | Validación de datos de entrada tanto en cliente como en servidor |
| RNF-09 | Las claves y secrets no deben exponerse en el repositorio (incluir .gitignore adecuado) |

### Persistencia

| ID | Requerimiento |
|---|---|
| RNF-10 | Todos los datos deben persistir en Supabase (PostgreSQL) |
| RNF-11 | No se aceptan datos únicamente en memoria o hardcodeados |
| RNF-12 | Debe incluirse script SQL o instrucciones para crear y poblar las tablas (seed) |

### Deploy

| ID | Requerimiento |
|---|---|
| RNF-13 | El proyecto completo (frontend + API) debe desplegarse en Vercel |
| RNF-14 | La URL pública debe ser funcional y accesible |
| RNF-15 | No debe haber errores de build ni de variables de entorno en producción |

### Git

| ID | Requerimiento |
|---|---|
| RNF-16 | Historial de commits claro y progresivo (no un solo commit final) |
| RNF-17 | Los commits deben reflejar el proceso de trabajo |

### README

| ID | Requerimiento |
|---|---|
| RNF-18 | README debe incluir instrucciones de instalación y ejecución local |
| RNF-19 | README debe listar las variables de entorno necesarias (sin exponer claves reales) |
| RNF-20 | README debe documentar las decisiones técnicas tomadas |
| RNF-21 | README debe incluir qué se haría distinto con más tiempo |

### Escalabilidad

| ID | Requerimiento |
|---|---|
| RNF-22 | El modelo de datos debe permitir escalar a más módulos en el futuro |
| RNF-23 | Las relaciones en la base de datos deben estar bien definidas desde el inicio (claves foráneas, restricciones) |

### Accesibilidad

| ID | Requerimiento |
|---|---|
| RNF-24 | La interfaz debe ser navegable mediante teclado en lo posible |
| RNF-25 | Los colores de estado deben ser distinguibles sin depender únicamente del color |

### Validaciones

| ID | Requerimiento |
|---|---|
| RNF-26 | Validar campos obligatorios en todos los formularios |
| RNF-27 | Validar que fecha de entrega sea posterior a fecha de inicio en proyectos |
| RNF-28 | Validar que no se pueda eliminar un cliente con proyectos asociados (mostrar advertencia) |
| RNF-29 | Validar que la tarea solo pueda asignarse a empleados que pertenecen al proyecto |
| RNF-30 | Manejar entradas inválidas con mensajes de error claros para el usuario |

---

## Actores del sistema

| Actor | Descripción |
|---|---|
| **Administrador / Director** | Accede al dashboard, visualiza KPIs, cronograma Gantt y reportes globales. Puede gestionar cualquier entidad. |
| **Project Manager** | Gestiona clientes, proyectos, asigna empleados, crea y supervisa tareas. Usa el Kanban y el Gantt. |
| **Empleado / Miembro del equipo** | Consulta sus tareas asignadas, cambia el estado de sus tareas. Visualiza proyectos en los que participa. |
| **Usuario no autenticado** | No está contemplado en el alcance obligatorio (la autenticación es opcional). |

> **Nota:** El documento no especifica si hay roles con permisos diferenciados ni un sistema de autenticación. Por defecto, se asume un sistema mono-usuario o multi-usuario sin distinción de roles hasta que se defina lo contrario.

---

## Casos de uso

| ID | Caso de uso | Módulo |
|---|---|---|
| CU-01 | Ver dashboard con KPIs generales | Inicio |
| CU-02 | Ver gráfico de proyectos por estado | Inicio |
| CU-03 | Ver próximos vencimientos (top 5 tareas) | Inicio |
| CU-04 | Registrar un nuevo cliente | Clientes |
| CU-05 | Editar un cliente existente | Clientes |
| CU-06 | Eliminar un cliente | Clientes |
| CU-07 | Buscar clientes por nombre | Clientes |
| CU-08 | Ver detalle de un cliente (datos + proyectos asociados) | Clientes |
| CU-09 | Crear un nuevo proyecto | Proyectos |
| CU-10 | Editar un proyecto existente | Proyectos |
| CU-11 | Eliminar un proyecto | Proyectos |
| CU-12 | Cambiar estado de un proyecto (automático/manual) | Proyectos |
| CU-13 | Listar proyectos con indicadores | Proyectos |
| CU-14 | Ver detalle de un proyecto (info + equipo + tareas) | Proyectos |
| CU-15 | Ver cronograma Gantt de proyectos | Proyectos |
| CU-16 | Crear una nueva tarea | Tareas |
| CU-17 | Editar una tarea existente | Tareas |
| CU-18 | Eliminar una tarea | Tareas |
| CU-19 | Cambiar estado de una tarea | Tareas |
| CU-20 | Ver tablero Kanban de tareas por estado | Tareas |
| CU-21 | Registrar un nuevo empleado | Empleados |
| CU-22 | Editar un empleado existente | Empleados |
| CU-23 | Listar empleados con filtros (rol y estado) | Empleados |
| CU-24 | Ver detalle de un empleado (tareas activas + proyectos) | Empleados |

---

## Flujo principal del negocio

1. **Registro de cliente** → El usuario registra un cliente con sus datos de contacto.
2. **Registro de empleados** → El usuario registra a los miembros del equipo con su rol y estado.
3. **Creación de proyecto** → El usuario crea un proyecto, lo asocia a un cliente, define fechas y asigna empleados. El proyecto se crea en estado "Planeado".
4. **Asignación de tareas** → El usuario crea tareas dentro del proyecto, las asigna a empleados del equipo y define su prioridad y fecha límite. Las tareas se crean en estado "Pendiente".
5. **Ejecución de tareas** → Los empleados avanzan sus tareas: Pendiente → En progreso → Completada.
6. **Seguimiento** → El Project Manager supervisa el avance mediante el tablero Kanban, el cronograma Gantt y los KPIs del dashboard.
7. **Finalización del proyecto** → Cuando todas las tareas están completadas (o se marca manualmente), el proyecto pasa a estado "Completado".
8. **Consulta histórica** → Los proyectos completados quedan registrados y son visibles en los KPIs y listados históricos.

---

## Dependencias entre módulos

| Módulo | Depende de | Tipo de dependencia |
|---|---|---|
| **Proyectos** | Clientes | Un proyecto debe pertenecer a un cliente existente |
| **Proyectos** | Empleados | Un proyecto debe tener empleados asignados (ya registrados) |
| **Tareas** | Proyectos | Una tarea debe pertenecer a un proyecto existente |
| **Tareas** | Empleados | Una tarea debe asignarse a un empleado que pertenezca al proyecto |
| **Inicio (Dashboard)** | Proyectos, Tareas, Clientes, Empleados | Los KPIs agregan datos de todos los módulos |
| **Cronograma Gantt** | Proyectos | Depende de fechas de inicio y fin de proyectos |

**Orden lógico de implementación:**
1. Empleados (no depende de nadie)
2. Clientes (no depende de nadie)
3. Proyectos (depende de Clientes y Empleados)
4. Tareas (depende de Proyectos y Empleados)
5. Inicio / Dashboard (depende de todos los anteriores)

---

## Riesgos técnicos

| ID | Riesgo | Impacto | Mitigación propuesta |
|---|---|---|---|
| RT-01 | **Vista Gantt compleja** | Alto | Implementar una versión simplificada al inicio (barras horizontales con CSS/SVG); evaluar librerías ligeras si es necesario |
| RT-02 | **Kanban con drag-and-drop** | Medio | Comenzar con botones de cambio de estado (más simple); drag-and-drop es punto extra no obligatorio |
| RT-03 | **Tiempo limitado (48-72h)** | Alto | Priorizar funcionalidad core funcional sobre features adicionales |
| RT-04 | **Cálculo de KPIs en tiempo real** | Bajo | Las consultas agregadas en Supabase/PostgreSQL son eficientes con índices adecuados |
| RT-05 | **Validación de fechas** | Bajo | Validar tanto en cliente (frontend) como en servidor (API Routes) |
| RT-06 | **Despliegue en Vercel con variables de entorno** | Medio | Documentar claramente las variables necesarias en el README; probar build local antes del deploy |
| RT-07 | **Relación many-to-many (proyecto-empleado)** | Bajo | Modelar tabla puente `proyecto_empleado` desde el inicio |

---

## Supuestos

| ID | Supuesto | Decisión implícita |
|---|---|---|
| S-01 | **No hay autenticación obligatoria** | El sistema funcionará sin login en su versión inicial. Si se implementa, será opcional y con Supabase Auth. |
| S-02 | **No hay roles de usuario** | Todos los usuarios tienen acceso completo a todas las funcionalidades. No hay permisos diferenciados. |
| S-03 | **Un empleado puede estar en múltiples proyectos** | Se modelará como relación muchos-a-muchos. |
| S-04 | **Una tarea tiene un solo empleado asignado** | El documento dice "Empleado asignado" en singular, se asume asignación individual. |
| S-05 | **No se requiere historial de cambios** | No se necesita auditoría de cambios de estado ni log de actividades. |
| S-06 | **Las fechas se manejan sin zona horaria** | Se usará DATE o TIMESTAMP sin zona horaria a menos que se especifique lo contrario. |
| S-07 | **El % de avance del proyecto = tareas completadas / tareas totales** | Cálculo directo, sin ponderación por prioridad o complejidad. |
| S-08 | **"Proyectos completados" en KPIs puede ser total histórico o del mes actual** | Se implementará una opción (total histórico) por defecto. |
| S-09 | **Los filtros por rol en empleados usan valores predefinidos** | Los roles sugeridos son: Desarrollador, Diseñador, Project Manager, QA. Pueden ser editables. |

---

## Preguntas abiertas

Estas son preguntas que un arquitecto debería resolver con el cliente antes de comenzar el desarrollo:

1. **Autenticación:** ¿El sistema requiere que los usuarios inicien sesión? ¿Habrá distintos roles con permisos?

2. **Multi-cliente / multi-empresa:** ¿AGENTIQ usará esta herramienta solo internamente o se planea ofrecer como SaaS a otras empresas?

3. **Definición de "proyecto vigente" para el KPI de clientes activos:** ¿Qué se considera "vigente"? ¿Proyectos en "Planeado" o "En progreso"? ¿Se excluye "Completado"?

4. **KPIs de proyectos completados:** ¿Debe ser el total histórico o solo los del mes actual? ¿Debe ser configurable?

5. **Roles de empleados:** ¿Los roles deben ser un catálogo fijo o el usuario puede crear nuevos roles?

6. **Eliminación de proyectos con tareas:** ¿Debe permitirse eliminar un proyecto que tiene tareas asociadas? ¿Debe haber advertencia o bloqueo?

7. **Tarea sin empleado asignado:** El documento dice que es obligatorio, pero ¿debería permitirse una tarea sin responsable como caso excepcional?

8. **Cronograma Gantt:** ¿Debe permitir filtrar por cliente, empleado o estado, o mostrar todos los proyectos siempre?

9. **Idioma de la interfaz:** ¿Debe estar en español, inglés o ser multilenguaje?

10. **Manejo de fechas vencidas:** Cuando una tarea se vence, ¿debe notificarse al usuario de alguna forma? ¿O solo mostrarse en el KPI de tareas vencidas?

11. **Datos de prueba (seed):** ¿El cliente proveerá datos de prueba o el desarrollador debe generarlos ficticios?

12. **Estilos visuales:** ¿Existe una guía de marca (colores, logos, tipografía) de AGENTIQ que debamos seguir?

---

*Documento generado como parte del análisis de requisitos — 21/07/2026*
