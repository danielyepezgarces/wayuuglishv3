# Wayuuglish - Plataforma de Aprendizaje Offline-First y Seguimiento Docente

Wayuuglish es una plataforma educativa interactiva estilo Duolingo diseñada para la preservación, enseñanza y aprendizaje multilingüe entre **Wayuunaiki, Inglés y Español** (4 combinaciones de aprendizaje: Wayuunaiki ↔ Inglés y Wayuunaiki ↔ Español). Cuenta con una arquitectura **Offline-First** con sincronización automática en la nube para comunidades con conectividad intermitente, un portal para docentes con analítica de estudiantes, códigos de aula, y un editor colaborativo de módulos entre maestros.

## User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas a partir de la fase de clarificación con el usuario:
> - **Identidad Visual y Mascota**: Cardenal Guajiro (*Waraush*) como mascota guía, con acentos y patrones textiles geométricos Wayuu (Kanaas) integrados con la frescura moderna y lúdica de Duolingo.
> - **Audio y Pronunciación**: Pronunciación con Web Speech API para Español e Inglés, acompañada de guías fonéticas interactivas y transcripción fonológica para Wayuunaiki.
> - **Sincronización Offline**: Arquitectura basada en almacenamiento local indexado (Local Cache/IndexedDB) con cola de mutaciones en segundo plano (*Background Sync Queue*) que se sincroniza automáticamente al detectar conectividad.

---

## 1. Overview & Core Concept

- **Qué hace la aplicación**:
  1. **Para Estudiantes**: Experiencia gamificada tipo Duolingo con vidas (corazones), rachas de días consecutivos (*streaks*), gemas/XP, niveles y lecciones progresivas. Múltiples formatos de ejercicios: traducción directa, banco de palabras ordenables, tarjetas de emparejamiento conceptual, selección múltiple y práctica de pronunciación guiada.
  2. **Para Docentes**: Portal de gestión donde pueden crear aulas virtuales, generar códigos de invitación (ej. `WAYUU-2026`), dar seguimiento en tiempo real al progreso, rachas, precisión y lecciones completadas por sus alumnos, y co-editar módulos colaborativos invitando a otros docentes colegas mediante correo/ID.
  3. **Cuatro Pares Lingüísticos Completos**:
     - Wayuunaiki → Inglés
     - Español → Inglés
     - Inglés → Wayuunaiki
     - Wayuunaiki → Español
- **Público Objetivo**: Comunidades educativas de La Guajira, estudiantes bilingües/trilingües, profesores etnoeducadores y entusiastas del aprendizaje de lenguas indígenas y el idioma inglés.
- **Propósito y Valor Central**: Cerrar la brecha educativa y digital permitiendo el aprendizaje continuo sin importar si hay señal de internet en la ranchería o aula rural, salvaguardando la cultura Wayuu y fomentando el bilingüismo global.

---

## 2. User Experience & Visual Design

### Flujos Clave de Usuario
1. **Onboarding & Selección de Rol**:
   - Registro de estudiante: Ingreso rápido mediante Código de Aula proporcionado por el profesor o registro libre con selección de ruta de aprendizaje (ej. *Aprender Inglés desde Wayuunaiki*).
   - Acceso docente: Panel para crear cursos, invitar docentes colaboradores y monitorear a los alumnos inscritos con su código.
2. **Experiencia de Aprendizaje (Ruta de Niveles - Path Map)**:
   - Mapa de ruta vertical interactivo con nodos de lecciones (bloqueados, en progreso, completados con corona dorada).
   - Barra superior con medidor de Vidas (❤️), Racha de días (🔥), Puntos de Experiencia (⚡ XP) y Estado de Conexión (En Línea / Sin Conexión - Sincronizado).
3. **Mecánica de Lección Gamificada**:
   - Barra de progreso superior fluida.
   - Tipos de ejercicios dinámicos:
     - *Construir oración*: Seleccionar fichas de palabras en orden correcto.
     - *Emparejar pares*: Unir términos en Wayuunaiki, Español o Inglés.
     - *Opción múltiple con contexto cultural*: Vocabulario cotidiano (fauna, tejido, familia, elementos naturales).
     - *Escucha y pronunciación fonética*: Audio nativo sintetizado con guía fonética silábica.
   - Retroalimentación auditiva y visual instantánea (panel inferior deslizable verde éxito / rojo error con explicación cultural).
   - Pantalla de victoria con XP ganados, incremento de racha y animación de felicitación.
4. **Panel Docente & Editor de Módulos Colaborativo**:
   - **Gestor de Clases**: Lista de alumnos inscritos con su código, última conexión, porcentaje de avance, lecciones completadas y alertas de estudiantes con rachas en riesgo.
   - **Editor Intuitivo de Cursos**: Creación visual de unidades, lecciones y preguntas sin necesidad de código (agregar palabras, distractores, traducciones y notas fonéticas).
   - **Colaboración Docente**: Compartir cursos con otros profesores (modo co-autor / colaborador con roles de edición compartida).

### Identidad Visual y Paleta de Colores
- **Dirección Estética**: Estilo lúdico moderno Duolingo enriquecido con iconografía y patrones geométricos Wayuu (*Kanaas*), colores tierra del desierto de La Guajira combinados con el plumaje rojo vivo del Cardenal Guajiro.
- **Paleta de Color (Regla 60-30-10)**:
  - *Lienzo Base (60%)*: Blanco cálido / marfil suave (`#FAFAF8`) con modo oscuro desértico profundo (`#12161A`).
  - *Superficies Estructurales (30%)*: Tarjetas suaves con bordes sutiles inspirados en arcilla y arena (`#F3F4F0` / `#1E252B`), divisores limpios de 1px.
  - *Acentos Primarios (10%)*:
    - **Rojo Cardenal Guajiro** (`#E11D48` / `#EF4444`): Botones de acción principal, botón de verificar respuesta y mascota.
    - **Ocre / Sol Guajiro** (`#F59E0B`): Contador de racha 🔥 y gemas/estrellas.
    - **Verde Éxito / Cactus** (`#10B981` / `#059669`): Respuestas correctas y lecciones aprobadas.
    - **Azul Mar Caribe / Cabo de la Vela** (`#0284C7`): Acentos de navegación y progreso.
- **Tipografía**: `Plus Jakarta Sans` para titulares amigables y limpios con `DM Sans` para el cuerpo y descripciones, y números tabulares monoespaciados para estadísticas y tiempos.

---

## 3. Key Product Decisions & Trade-Offs

1. **Estrategia Offline-First con Cola de Mutaciones**:
   - *Enfoque*: Utilizar almacenamiento estructurado en el cliente (LocalStorage / IndexedDB persistente) para guardar el catálogo completo de cursos, progreso del estudiante, rachas y lecciones. Cuando se realicen acciones sin red, se encolan en `sync_mutation_queue`.
   - *Sincronización*: Un gestor de conectividad detecta eventos `online` y procesa la cola automáticamente hacia el servidor/estado compartido, reflejando el progreso del alumno en el panel del docente.
2. **Audio Híbrido y Guía Fonética Wayuunaiki**:
   - *Enfoque*: El estándar Web Speech API cubre Inglés (`en-US`) y Español (`es-CO`/`es-ES`). Para Wayuunaiki (que carece de motor TTS nativo en navegadores estándar), se implementa un sintetizador fonético con desglose de pronunciación silábica, acentuación glotal (') y transcripción fonológica clara para que el alumno aprenda a pronunciar fielmente.
3. **Colaboración Docente y Códigos de Aula**:
   - *Enfoque*: Cada aula tiene un código alfanumérico único (ej. `WAYUU-101`). Los docentes pueden invitar a colegas como colaboradores con permisos para añadir o modificar lecciones dentro del curso compartido.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          WAYUUGLISH APP                                │
├──────────────────────────────────┬─────────────────────────────────────┤
│         STUDENT VIEW             │             TEACHER VIEW            │
│  - Path / Map Progression        │  - Classroom & Code Management      │
│  - Interactive Quiz Engine       │  - Student Analytics & Streaks      │
│  - Hearts, XP & Streak Counter   │  - Collaborative Module Editor      │
│  - Phonetic Pronunciation Guide  │  - Co-author Collaboration Hub      │
├──────────────────────────────────┴─────────────────────────────────────┤
│                      OFFLINE-FIRST SYNC ENGINE                         │
│  ┌─────────────────────────┐             ┌──────────────────────────┐  │
│  │ Local State (IndexedDB) │  ◄────────► │ Auto-Sync Queue Manager  │  │
│  │ Lessons, Progress, User │             │ (Online/Offline Monitor) │  │
│  └─────────────────────────┘             └────────────┬─────────────┘  │
└───────────────────────────────────────────────────────┼────────────────┘
                                                        │
                                                        ▼
                                         ┌─────────────────────────────┐
                                         │ Backend API / Cloud Storage │
                                         │ Classrooms, Courses, Sync   │
                                         └─────────────────────────────┘
```

### Entidades de Datos Clave
- `User`: `{ id, name, email, role: 'student' | 'teacher', classroomId?, streak, lastActiveDate, hearts, xp, avatar }`
- `Classroom`: `{ id, code, name, teacherIds: string[], studentIds: string[], courseId }`
- `Course`: `{ id, title, sourceLang, targetLang, createdBy, collaborators: string[], modules: Module[] }`
- `Module`: `{ id, title, description, order, lessons: Lesson[] }`
- `Lesson`: `{ id, title, xpReward, exercises: Exercise[] }`
- `Exercise`: `{ id, type: 'translate' | 'word-bank' | 'match' | 'choice' | 'phonetic', prompt, options?, solution, phoneticGuide?, explanation? }`
- `StudentProgress`: `{ studentId, courseId, completedLessonIds: string[], accuracy: number, lastSyncTime: number }`

---

## Plan de Verificación y Entrega
1. Validación completa de interfaz para Estudiantes (resolución de ejercicios, cálculo de rachas, pérdida de vidas y recompensas XP).
2. Validación de cambio y funcionamiento de los 4 pares lingüísticos con contenido precargado de alta calidad etnoeducativa.
3. Validación de herramientas docentes (creación de aula, código de registro, analítica de estudiantes y editor colaborativo).
4. Prueba de desconexión / reconexión para verificar el funcionamiento offline y sincronización automática.
5. Verificación de compilación (`compile_applet`) limpia y sin advertencias.
