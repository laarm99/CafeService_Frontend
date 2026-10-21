Necesito implementar nuevos módulos, filtros y navegación por roles en el frontend existente del proyecto.

Antes de generar o modificar código, analiza completamente el frontend actual.

IMPORTANTE:
- No reemplaces la arquitectura existente.
- No cambies React Router, Ant Design, el cliente HTTP, el sistema de autenticación o el manejo de estado sin justificarlo.
- No crees componentes, hooks, servicios o contextos duplicados.
- Respeta el diseño visual, colores, espaciados y componentes existentes.
- Reutiliza layouts, tablas, formularios, modales, servicios y utilidades existentes.
- No implementes todavía el sistema de correos.
- No elimines las opciones actuales de Lista de Formato Múltiple y Nuevo Formato Múltiple.

Primero analiza e identifica:

1. La estructura de carpetas.
2. El sistema de rutas.
3. El layout principal.
4. La configuración del menú principal y barra lateral.
5. El componente actual de Lista de Formato Múltiple.
6. El componente actual de Nuevo Formato Múltiple.
7. El cliente HTTP o servicio usado para consumir el backend.
8. El mecanismo de autenticación.
9. La ubicación donde se guarda el usuario autenticado y sus roles.
10. Los guards o componentes de rutas protegidas existentes.
11. La forma en que se manejan formularios, tablas, paginación, filtros y mensajes.
12. Los tipos o interfaces TypeScript existentes.
13. El patrón existente para páginas de administración.

Después del análisis presenta:

- archivos que deben modificarse;
- archivos nuevos estrictamente necesarios;
- rutas nuevas;
- componentes reutilizados;
- interfaces o servicios que deben ampliarse;
- reglas de visibilidad;
- dependencias entre frontend y endpoints del backend.

No escribas código antes de presentar este plan.

REQUERIMIENTOS FUNCIONALES

1. MENÚ PRINCIPAL Y BARRA LATERAL

Actualmente existen opciones equivalentes a:

- Lista de Formato Múltiple
- Nuevo Formato Múltiple

Agrega una nueva opción principal:

- Configuración

Configuración debe contener dos opciones hijas:

- Supervisores
- Usuarios

La navegación esperada es:

Configuración
  - Supervisores
  - Usuarios

Requisitos:

- Configuración debe aparecer en el menú principal y en la barra lateral, respetando la estructura existente.
- Debe mostrarse como menú padre desplegable cuando el componente actual lo permita.
- Supervisores y Usuarios deben tener rutas independientes.
- Solo los usuarios con rol Admin pueden visualizar y acceder a Configuración.
- Si un usuario escribe manualmente la URL, una ruta protegida debe impedir el acceso.
- No basta con ocultar el elemento del menú.
- Para acceso denegado, reutiliza la página 403 o el comportamiento actual.
- No agregues librerías nuevas si React Router y Ant Design ya resuelven el requerimiento.

2. PÁGINA DE SUPERVISORES

Crea una página administrativa siguiendo el diseño existente.

Debe incluir:

- Tabla de supervisores.
- Nombre del supervisor.
- Número de empleado, si el backend lo proporciona.
- NetKey.
- Correo electrónico.
- Estatus activo/inactivo.
- Acciones.

Acciones requeridas:

- Editar NetKey.
- Editar correo electrónico.
- Habilitar o deshabilitar supervisor.

Comportamiento:

- La edición puede realizarse en modal o drawer, según el patrón existente.
- Utiliza Ant Design Form si el proyecto ya lo utiliza.
- Valida que el correo tenga formato válido.
- NetKey y correo deben ser obligatorios si así lo define el backend.
- Muestra confirmación antes de deshabilitar.
- No elimines supervisores.
- Inhabilita los botones mientras se procesa la solicitud.
- Muestra mensajes de éxito o error mediante el mecanismo actual.
- Actualiza la tabla después de una operación exitosa.
- Distingue visualmente registros activos e inactivos sin eliminar su información.

3. PÁGINA DE USUARIOS

Crea una página independiente para Usuarios.

Debe incluir:

- Tabla de usuarios.
- Nombre.
- Número de empleado, si está disponible.
- Nombre de usuario o NetKey.
- Rol actual.
- Estatus activo/inactivo.
- Acciones.

Acciones requeridas:

- Cambiar o asignar rol.
- Habilitar o deshabilitar usuario.

Los roles iniciales son:

- Admin
- Supervisor
- General

Reglas:

- El selector debe utilizar los valores exactos proporcionados por el backend.
- No hardcodees identificadores internos de roles.
- Si el backend proporciona un catálogo de roles, consúmelo.
- Muestra confirmación antes de cambiar el rol o deshabilitar el usuario.
- No elimines físicamente usuarios.
- Maneja errores 400, 401, 403, 404 y 409 de forma clara.
- Evita permitir múltiples envíos mientras una operación está en proceso.

Si se está editando al mismo usuario que inició sesión, muestra una advertencia antes de cambiar su rol o deshabilitarlo. No inventes la regla final; respeta lo que permita el backend.

4. FILTROS EN LISTA DE FORMATOS

Extiende la vista existente de Lista de Formato Múltiple.

Agrega los siguientes controles:

- Tipo: Select o Dropdown.
- Estatus: Select o Dropdown.
- Fecha: DatePicker o RangePicker.
- Campo de búsqueda general.

El campo de búsqueda debe mostrar un placeholder similar a:

"Buscar por ID de formato, nombre o número de empleado"

Comportamiento:

- Tipo y estatus deben utilizar catálogos o enums existentes.
- Para fecha, utiliza RangePicker si el backend acepta fecha inicial y final.
- Si el requerimiento final utiliza fechas predefinidas, conserva una estructura que permita agregar opciones como Hoy, Esta semana y Este mes.
- Los filtros deben poder combinarse.
- Agrega un botón Buscar solamente si el patrón actual lo requiere.
- Agrega una opción Limpiar filtros.
- Al limpiar, restablece la lista y la paginación.
- Cuando cambia un filtro, reinicia la página a 1.
- Envía los filtros al backend como parámetros de consulta.
- No filtres únicamente los registros visibles de la tabla.
- Conserva la paginación del servidor.
- Conserva el ordenamiento existente.
- Evita llamadas excesivas mientras se escribe.
- Aplica debounce al campo de búsqueda usando el mecanismo existente o una solución simple sin agregar dependencias.
- Conserva los filtros mientras el usuario cambia de página.
- Muestra estado de carga.
- Muestra estado vacío cuando no existan resultados.
- Maneja errores sin romper la tabla.

Organiza los filtros de forma responsiva utilizando Row, Col, Space, Flex o el patrón actual de Ant Design.

En escritorio:
- Los controles deben aparecer alineados y con tamaños consistentes.

En pantalla pequeña:
- Los controles deben acomodarse verticalmente o en varias filas.

5. MENÚ Y PESTAÑAS SEGÚN EL ROL

Implementa visibilidad y acceso según estos roles:

ADMIN
- Ve Lista de Formato Múltiple.
- Ve todas las solicitudes.
- Ve Configuración.
- Ve Supervisores.
- Ve Usuarios.
- No debe ver acciones de Aprobar o Rechazar.
- No debe ver opciones de aprobación aunque pueda consultar todos los registros.

SUPERVISOR
- Ve Lista de Formato Múltiple.
- La lista contiene únicamente solicitudes de empleados a su cargo, de acuerdo con la respuesta del backend.
- Puede visualizar la opción Cambio de departamento y/o turno.
- Puede ver Aprobar o Rechazar únicamente cuando la solicitud permita esas acciones.
- No ve Configuración.
- No ve Supervisores.
- No ve Usuarios.
- No agregues todavía acceso a vacaciones, permisos o ajuste de tiempos para sus empleados, porque esta regla está pendiente.

GENERAL
- Ve Lista de Formato Múltiple para consultar sus propias solicitudes.
- Ve Nuevo Formato Múltiple.
- Puede acceder a:
  - Vacaciones;
  - Permisos;
  - Ajuste de checadas.
- No ve Configuración.
- No ve opciones de aprobación.
- No ve Cambio de departamento y/o turno, salvo que exista una regla actual que indique lo contrario.

IMPORTANTE:
- Centraliza las reglas de permisos.
- No distribuyas comparaciones como user.role === "Admin" en numerosos componentes.
- Reutiliza el hook, contexto o utilidad de permisos existente.
- Si no existe, crea una solución centralizada y pequeña.
- Diferencia entre:
  - canViewConfiguration;
  - canManageSupervisors;
  - canManageUsers;
  - canCreateVacation;
  - canCreatePermission;
  - canCreateTimeAdjustment;
  - canViewDepartmentShiftChange;
  - canApproveRequests.

La interfaz nunca debe asumir que ocultar un botón sustituye la validación del backend.

6. CONSUMO DE API

Amplía los servicios existentes. No crees un segundo cliente Axios o Fetch si ya existe uno.

Se necesitan operaciones equivalentes a:

Supervisores:
- Obtener listado.
- Obtener detalle.
- Actualizar NetKey y correo.
- Habilitar o deshabilitar.

Usuarios:
- Obtener listado.
- Obtener detalle.
- Obtener roles, si existe ese endpoint.
- Cambiar rol.
- Habilitar o deshabilitar.

Formatos:
- Obtener lista paginada con:
  - tipo;
  - estatus;
  - fecha inicial;
  - fecha final;
  - texto de búsqueda;
  - página;
  - tamaño de página.

Aprobación:
- Aprobar solicitud.
- Rechazar solicitud.

Adapta los nombres y rutas a los endpoints reales del backend.

7. TIPOS TYPESCRIPT

Crea o amplía interfaces para representar:

- Supervisor.
- Usuario.
- Rol.
- Resultado paginado.
- Parámetros de filtros.
- Tipo de formato.
- Estatus.
- Respuestas de actualización.

No uses any si el tipo puede determinarse.
No dupliques interfaces existentes.
No mezcles modelos de formulario con respuestas del API si tienen necesidades diferentes.

8. SEGURIDAD Y EXPERIENCIA DE USUARIO

- Protege las rutas.
- Oculta opciones sin permiso.
- Oculta acciones sin permiso.
- Maneja respuestas 401 y 403.
- No decodifiques ni confíes ciegamente en datos del token si ya existe un endpoint de perfil.
- No muestres controles de aprobación al Admin.
- No permitas que un General vea funcionalidades administrativas.
- No alteres el estilo global sin necesidad.
- No incluyas datos sensibles en logs del navegador.
- Mantén etiquetas y mensajes de interfaz en español si esa es la convención actual.

9. PRUEBAS Y VALIDACIÓN

Incluye escenarios para validar:

- Menú visible para Admin.
- Menú oculto para Supervisor y General.
- Acceso directo por URL a Configuración.
- Edición de NetKey.
- Edición de correo.
- Correo inválido.
- NetKey duplicado.
- Deshabilitación de supervisor.
- Cambio de rol de usuario.
- Deshabilitación de usuario.
- Filtros individuales.
- Combinación de filtros.
- Limpieza de filtros.
- Cambio de página conservando filtros.
- Admin sin botones de aprobación.
- Supervisor con botones de aprobación en solicitudes válidas de su equipo.
- General sin botones de aprobación.
- Comportamiento responsivo.

10. FORMATO DE ENTREGA

Implementa los cambios por etapas:

**Etapa 0 (COMPLETADA):**
- ✅ Actualizar sistema de permisos para soportar múltiples roles
- ✅ Crear tipos TypeScript para usuario
- ✅ Crear componente RolesDisplay para mostrar roles múltiples

**Etapa 1 (COMPLETADA):**
- ✅ Rutas protegidas configuradas en src/main.jsx
- ✅ Menú Configuración con submenús Supervisores/Usuarios en src/layout/modules.js
- ✅ Páginas en src/pages/supervisorsPage/index.jsx y src/pages/usersPage/index.jsx
- ✅ Componentes SupervisorsGrid y UsersGrid en src/components/configuration/components/
- ✅ APIs en src/components/configuration/api/ConfigurationApi.js
- ✅ Permisos integrados: canManageSupervisors, canManageUsers
- ✅ Traducciones en src/locales/es.json
- ✅ Validación de acceso por ProtectedRouteComponent

Etapa 2:
- Menú Configuración y submenús.

Etapa 3:
- Página Supervisores.

Etapa 4:
- Página Usuarios.

Etapa 5:
- Filtros de Lista de Formato Múltiple.

Etapa 6:
- Acciones y visibilidad por roles.

Para cada etapa proporciona:

1. Ruta exacta del archivo.
2. Si es nuevo o existente.
3. Razón del cambio.
4. Código completo o bloque exacto que debe sustituirse.
5. Interfaces utilizadas.
6. Endpoint consumido.
7. Forma manual de probarlo.
8. Resultado esperado.

No uses pseudocódigo.
No dejes TODOs.
No inventes endpoints sin indicar que deben verificarse contra el backend.
No cambies componentes fuera del alcance.

---

## CAMBIOS ETAPA 0: Sistema de Roles Múltiples (2026-10-21)

### Archivos Modificados

#### 1. `src/utils/permissions.js` (MODIFICADO)
- **Razón:** Soportar múltiples roles por usuario
- **Cambio:** Nueva función `normalizeRoles()` que convierte `role` (string) a `roles` (array)
- **Nuevos permisos:**
  - `hasMultipleRoles`: boolean - indica múltiples roles
  - `requiresApprovalForOwnRequest`: boolean - true si Admin + Supervisor
- **Compatibilidad:** Funciona con roles actuales (string) y futuros (array)
- **Endpoint:** Compatible con cambios futuros de `/auth/login`

### Archivos Nuevos

#### 2. `src/types/user.types.js` (NUEVO)
- **Razón:** Documentar estructura de usuario con múltiples roles
- **Contenido:** Tipos JSDoc para User, Permissions, AuthContextType
- **Uso:** Referencia de tipos para IDE y documentación
- **Endpoint:** N/A

#### 3. `src/components/common/RolesDisplay.jsx` (NUEVO)
- **Razón:** Mostrar múltiples roles como tags en tablas
- **Contenido:** Componente que soporta roles como string o array
- **Uso:** En páginas de Usuarios y Supervisores
- **Endpoint:** N/A

#### 4. `docs/migracion-roles-multiples.md` (NUEVO)
- **Razón:** Especificación completa de cambios backend requeridos
- **Contenido:** 
  - Cambios en endpoints `/auth/login` y `/configuration/users`
  - Nuevo endpoint `/configuration/users/{userId}/roles`
  - Casos de uso Admin + Supervisor
  - Validaciones backend recomendadas
- **Próximos pasos:** Backend implementa según este documento

### Validación

```javascript
// Funciona con rol actual (string)
getPermissions({ role: "Admin" })
// Devuelve: { ..., hasMultipleRoles: false }

// Funciona con múltiples roles (array)
getPermissions({ roles: ["Admin", "Supervisor"] })
// Devuelve: { ..., hasMultipleRoles: true, requiresApprovalForOwnRequest: true }
```

### Próximo Paso
Implementar cambios en backend según `docs/migracion-roles-multiples.md`