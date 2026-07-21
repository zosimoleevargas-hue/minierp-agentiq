# Prueba Técnica AGENTIQ

**PROCESO DE SELECCIÓN TÉCNICA**

| Campo | Valor |
|---|---|
| **Prueba Técnica** | Desarrollador de Software |
| **Proyecto** | ERP de Gestión de Proyectos |
| **NIVEL** | Junior |
| **Candidato** | |
| **DURACIÓN** | 48–72 horas |
| **STACK** | Node.js + Supabase + Vercel + Tailwind |
| **Fecha de entrega** | |

AGENTIQ · Documento de uso interno para procesos de selección

## 1. Introducción

Gracias por tu interés en formar parte del equipo de desarrollo de AGENTIQ. Esta prueba técnica tiene como objetivo evaluar tus habilidades de programación, tu capacidad de análisis y organización, y tu criterio para tomar decisiones técnicas al resolver un problema de negocio real y acotado.

No buscamos un producto perfecto ni terminado al 100%. Buscamos entender cómo piensas, cómo estructuras tu código y cómo priorizas cuando el tiempo es limitado.

## 2. Objetivo de la prueba

Deberás construir un mini ERP de gestión de proyectos pensado para el día a día de una empresa de software: administrar clientes, proyectos, equipos y tareas, y dar visibilidad del avance de cada proyecto de principio a fin.

## 3. Contexto del proyecto

AGENTIQ es una empresa de desarrollo de software que maneja múltiples proyectos de clientes en paralelo, cada uno con su propio equipo, tareas y plazos. Hoy esa gestión se hace de forma manual y dispersa (hojas de cálculo, chats, notas sueltas), lo que dificulta saber en qué va cada proyecto. Tu tarea es construir la primera versión funcional de una herramienta interna que centralice esta gestión: qué clientes tenemos, qué proyectos estamos ejecutando para ellos, quién está trabajando en qué, y cómo va el avance de cada tarea.

## 4. Ejemplo visual de referencia (DEMO)

A modo de referencia, así podrían verse algunas pantallas clave del sistema. Son ejemplos ilustrativos: no es obligatorio replicar este diseño exacto, colores o disposición; lo importante es que la interfaz resultante sea clara y funcional.

### 4.1 Inicio (Dashboard con KPIs)

*[Ilustración referencial del dashboard con indicadores]*

### 4.2 Proyectos — vista de Cronograma (Gantt)

Esta vista es un requisito funcional del módulo Proyectos (ver 6.3): una línea de tiempo que muestra la duración de cada proyecto según su fecha de inicio y fecha de entrega, agrupados por estado. Su objetivo es dar visibilidad a la gestión sobre la carga de proyectos en el tiempo, no un cronograma de trabajo para ti como candidato.

*[Ilustración referencial del cronograma Gantt]*

### 4.3 Tareas — tablero por estado (Kanban)

*[Ilustración referencial del tablero Kanban]*

## 5. Diagrama de flujo del proceso

El siguiente diagrama resume el flujo principal que debe soportar el sistema, desde que se registra un cliente hasta que un proyecto se cierra y se genera su resumen final:

*[Diagrama de flujo del proceso]*

## 6. Requisitos funcionales

El sistema se organiza en cinco módulos. A continuación se detalla, para cada uno, qué información debe manejar y qué debe poder hacer el usuario.

| Inicio | Clientes | Proyectos | Tareas | Empleados |
|---|---|---|---|---|
| Dashboard con KPIs generales | Registro y datos de clientes | Creación y cronograma (Gantt) | Tablero Kanban por estado | Empleados y carga de trabajo |

### 6.1 Módulo Inicio (Dashboard)

Es la pantalla de entrada al sistema. Debe darle a cualquier usuario una lectura rápida del estado general de la empresa mediante indicadores (KPIs) y un resumen visual.

**Tarjetas de KPI a mostrar:**

- **Proyectos activos:** cantidad de proyectos en estado "En progreso".
- **Proyectos completados:** total histórico (o del mes actual) de proyectos en estado "Completado".
- **Tareas pendientes:** suma de tareas en estado "Pendiente" + "En progreso" en todos los proyectos.
- **Tareas vencidas:** tareas cuya fecha límite ya pasó y que no están en estado "Completada".
- **Clientes activos:** total de clientes registrados con al menos un proyecto vigente.
- **Empleados activos:** total de miembros del equipo disponibles para asignación.

**Adicional (recomendado, no obligatorio):**

- Un gráfico simple de proyectos agrupados por estado (barras o dona).
- Un listado corto de "Próximos vencimientos": las 5 tareas con fecha límite más cercana.

### 6.2 Módulo Clientes

**Formulario de registro/edición de cliente:**

- Nombre o razón social (obligatorio).
- Identificación/NIT (opcional).
- Correo de contacto (obligatorio).
- Teléfono (opcional).
- Dirección (opcional).

**Funcionalidad esperada:**

- Listado de clientes con buscador por nombre.
- Editar y eliminar un cliente (validar que, si tiene proyectos asociados, se avise antes de eliminar).
- Vista de detalle de un cliente que muestre sus datos y el listado de proyectos asociados a él.

### 6.3 Módulo Proyectos

Este es el módulo central del sistema. Define cómo se introduce (crea) un proyecto y cómo se hace seguimiento a su avance.

**Formulario para introducir un nuevo proyecto:**

- Nombre del proyecto (obligatorio).
- Cliente asociado (obligatorio; se selecciona de la lista de clientes ya registrados).
- Descripción (opcional).
- Fecha de inicio (obligatorio).
- Fecha estimada de entrega (obligatorio; debe ser posterior a la fecha de inicio).
- Prioridad (opcional: Baja, Media, Alta).
- Estado inicial: se crea por defecto en "Planeado".
- Empleados asignados (selección múltiple de empleados ya registrados en el módulo de Empleados).

**Estados posibles de un proyecto:**

| PLANEADO | EN PROGRESO | COMPLETADO |
|---|---|---|
| Planeado: creado pero aún sin tareas en progreso. | En progreso: tiene al menos una tarea activa. | Completado: todas sus tareas están en estado "Completada" (puede marcarse manualmente también). |

**Listado y detalle de proyectos:**

- Listado (tabla o tarjetas) con: nombre, cliente, estado (con color distintivo), % de avance (tareas completadas / tareas totales) y fecha de entrega.
- Vista de detalle de un proyecto con su información general, el equipo asignado y el tablero o listado de sus tareas.
- Vista de Cronograma (Gantt): una línea de tiempo que muestre todos los proyectos según su fecha de inicio y fecha de entrega, para dar visibilidad general del estado de la operación. Ver ejemplo en el apartado 4.2.

### 6.4 Módulo Tareas

**Formulario para crear una tarea dentro de un proyecto:**

- Título (obligatorio).
- Descripción (opcional).
- Proyecto al que pertenece (obligatorio).
- Empleado asignado (obligatorio; se selecciona de los empleados asignados a ese proyecto).
- Prioridad (opcional: Baja, Media, Alta).
- Fecha límite (opcional).

**Estados posibles de una tarea:**

| PENDIENTE | EN PROGRESO | COMPLETADA |
|---|---|---|

**Funcionalidad esperada:**

- Cambiar el estado de una tarea entre los tres anteriores.
- Vista tipo tablero (Kanban simple) que agrupe visualmente las tareas por estado, similar al ejemplo del apartado 4.3.
- Editar y eliminar tareas.

### 6.5 Módulo Empleados

**Formulario de registro/edición de empleado:**

- Nombre completo (obligatorio).
- Correo (obligatorio).
- Rol o cargo (obligatorio; por ejemplo: Desarrollador, Diseñador, Project Manager, QA).
- Estado (Activo / Inactivo).

**Funcionalidad esperada:**

- Listado de empleados, con filtro por rol y por estado.
- Vista de detalle de un empleado que muestre sus tareas activas asignadas y los proyectos en los que participa (su carga de trabajo actual).

### 6.6 Alcance

No es necesario implementar autenticación de usuarios, notificaciones en tiempo real, ni reportes avanzados más allá de los KPIs del Inicio. Si te sobra tiempo, estas son mejoras bienvenidas pero no obligatorias (ver sección 9).

## 7. Requisitos técnicos

### 7.1 Stack obligatorio

- **Backend/API:** Node.js (Express, Fastify o Next.js API Routes/Route Handlers, a elección del candidato).
- **Base de datos y backend-as-a-service:** Supabase (PostgreSQL). Se debe usar Supabase para el modelado de tablas, relaciones y consultas; el uso de Supabase Auth para un login básico es opcional pero suma puntos.
- **Frontend:** se recomienda Next.js + Tailwind CSS para el maquetado de la interfaz (puede usarse otro framework de React compatible con Vercel si se justifica en el README).
- **Despliegue:** el proyecto completo (frontend y API) debe quedar publicado en Vercel, con una URL pública funcional incluida en la entrega.
- **Variables de entorno:** las credenciales de Supabase deben manejarse mediante variables de entorno (.env), nunca hardcodeadas en el código.

### 7.2 Requisitos generales

- El proyecto debe poder ejecutarse localmente siguiendo instrucciones claras (README), además de estar accesible en producción vía Vercel.
- Persistencia real de datos en Supabase; no se aceptan datos únicamente en memoria o hardcodeados.
- Interfaz web funcional y responsiva con Tailwind CSS (no tiene que ser visualmente elaborada).
- Control de versiones con Git: se espera un historial de commits claro, no un solo commit final.
- Manejo básico de errores y validaciones de datos de entrada.

## 8. Entregables

- Repositorio de código (GitHub o GitLab) con todo el proyecto fuente.
- URL pública del proyecto desplegado en Vercel, ya funcional.
- Archivo README con: instrucciones de instalación y ejecución local, variables de entorno necesarias (sin exponer claves reales), decisiones técnicas tomadas, y qué harías distinto con más tiempo.
- Script SQL o instrucciones de Supabase para crear/poblar las tablas (seed) si aplica.
- Opcional: video corto (3-5 min) o capturas de pantalla mostrando el sistema en funcionamiento.

## 9. Criterios de evaluación

Se evaluará el proyecto con base en los siguientes criterios y pesos orientativos:

| Criterio | Descripción | Peso |
|---|---|---|
| Funcionalidad | Los módulos de Inicio, Clientes, Proyectos, Tareas y Empleados funcionan según lo solicitado, incluyendo KPIs y cambio de estados. | 25% |
| Calidad de código | Organización, legibilidad, nomenclatura consistente y separación de responsabilidades en Node.js. | 20% |
| Modelado de datos en Supabase | Diseño coherente de tablas y relaciones (cliente, proyecto, tarea, empleado) en PostgreSQL/Supabase. | 15% |
| Despliegue en Vercel | El proyecto queda publicado y accesible públicamente, sin errores de build ni de variables de entorno. | 10% |
| Manejo de errores y validaciones | Control de casos borde: campos vacíos, proyecto sin empleados asignados, tarea sin responsable, entradas inválidas. | 10% |
| Documentación (README) | Claridad para instalar, ejecutar y entender las decisiones tomadas. | 10% |
| Uso de Git | Historial de commits que refleje el proceso de trabajo, no una sola entrega final. | 10% |

**Puntos extra (no obligatorios):** pruebas automatizadas, contenerización con Docker, tablero Kanban con drag-and-drop, filtros y búsqueda de proyectos/tareas, autenticación básica con Supabase Auth.

## 10. Reglas generales

- Puedes apoyarte en documentación oficial, foros y herramientas de IA como asistentes de código; lo importante es que entiendas y puedas explicar cada parte de tu solución.
- No se permite copiar un proyecto existente de ERP/gestión de proyectos de código abierto y presentarlo como propio.
- Ante cualquier duda sobre el alcance, toma la decisión que te parezca más razonable y documenta tu supuesto en el README.
- Si no alcanzas a completar todo, entrega lo que tengas funcional; es preferible menos funcionalidades bien hechas que muchas incompletas.

## 11. Modalidad y tiempo de entrega

- **Tiempo total:** 48 a 72 horas desde la recepción de esta prueba.
- **Modalidad:** individual y remota.
- **Envío:** enlace al repositorio y a la URL de Vercel al correo de contacto indicado abajo.
- **Al finalizar,** se agendará una entrevista técnica para revisar el código junto contigo.

## 12. Contacto

Cualquier duda sobre el enunciado puede enviarse al correo de contacto de AGENTIQ indicado por la persona reclutadora. ¡Mucho éxito!

AGENTIQ · Prueba Técnica ERP · Documento de uso interno para procesos de selección
