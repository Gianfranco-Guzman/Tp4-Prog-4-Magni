# Roadmap completo para terminar el TP N° 4 - Programación 4

## Diagnóstico general

El proyecto está encaminado, pero todavía **no cumple completo** con el enunciado del TP.

El PDF exige que la aplicación deje de depender de `localStorage`, use una API REST con persistencia en base de datos y comparta el estado de participantes mediante `Context API` y `useContext`.

Actualmente hay una base de backend creada con FastAPI y SQLModel, y un frontend React funcional de la versión anterior. El problema es que todavía falta conectar correctamente las piezas principales: endpoints reales, consumo HTTP desde React y contexto global.

---

## Qué pide el TP según el PDF

El trabajo práctico solicita:

1. Desarrollar un backend con una API REST.
2. Almacenar y recuperar participantes desde una base de datos SQL o NoSQL.
3. Comunicar frontend y backend mediante JSON.
4. Exponer los siguientes endpoints obligatorios:
   - `GET /participantes`
   - `POST /participantes`
   - `DELETE /participantes/{id}`
5. Reemplazar el uso de `localStorage` en el frontend.
6. Consumir la API usando `fetch` o `axios`.
7. Usar `Context API`.
8. Usar `useContext`.
9. Sacar el estado de participantes de la pantalla principal y llevarlo a un contexto global.
10. Compartir desde el contexto:
    - `participantes`
    - `agregar`
    - `eliminar`
    - `resetear`

---

## Estado actual del backend

El backend ya tiene una estructura inicial bastante buena:

```txt
Backend/
└── app/
    ├── main.py
    ├── Core/
    │   ├── config.py
    │   ├── database.py
    │   ├── repository.py
    │   └── unit_of_work.py
    └── Participante/
        ├── participanteModel.py
        ├── participanteRepository.py
        ├── participanteRouter.py
        ├── participanteSchema.py
        └── participanteService.py
```

### Lo que ya está encaminado

- Existe configuración de base de datos con SQLite.
- Existe `engine` de SQLModel.
- Existe `UnitOfWork` para manejar sesiones y commits.
- Existe modelo `Participante`.
- Existen schemas de creación y lectura.
- Existe una capa de service.
- Existe una capa de repository.

### Problemas actuales del backend

1. `participanteRouter.py` está vacío.
2. `main.py` todavía no registra ningún router.
3. No existen endpoints funcionales para:
   - listar participantes
   - crear participante
   - eliminar participante
4. El import de `participanteRepository.py` está inconsistente:

```py
from Backend.app.Participante.participanteModel import Participante
```

El resto del backend usa imports desde `app`, por ejemplo:

```py
from app.Core.database import engine
```

Entonces debería unificarse probablemente a:

```py
from app.Participante.participanteModel import Participante
```

5. El contrato de datos no coincide entre backend y frontend.

El backend actualmente modela algo cercano a:

```py
nombre
email
edad
telefono
modalidad
nivel
```

Pero el frontend trabaja con:

```ts
id
nombre
email
edad
pais
modalidad
tecnologias
nivel
aceptaTerminos
```

Esto es importante: si el JSON que envía React no coincide con lo que espera FastAPI, el `POST /participantes` va a fallar o va a guardar datos incompletos.

---

## Estado actual del frontend

El frontend todavía conserva la lógica de la versión anterior.

### Lo que ya está funcionando

- Hay una pantalla principal en `App.tsx`.
- Hay formulario para crear participantes.
- Hay filtros.
- Hay cards para mostrar participantes.
- Hay modelo TypeScript `Participante`.
- La UI ya permite agregar, eliminar, filtrar y resetear datos.

### Problemas actuales del frontend

1. `App.tsx` todavía usa `localStorage`.
2. El estado de participantes vive en `App.tsx`.
3. Todavía no existe `ParticipantesContext`.
4. `main.tsx` no envuelve la aplicación con `ParticipantesProvider`.
5. `Formulario` recibe `onAgregar` por props.
6. `ParticipanteCard` recibe `onEliminar` por props.
7. Todavía no se consume el backend con `fetch` o `axios`.
8. No hay integración real con base de datos.

El TP pide exactamente lo contrario: sacar esa responsabilidad de `App.tsx` y llevarla a un contexto global.

---

# Roadmap recomendado

## Paso 1 - Alinear el contrato de datos

Antes de seguir escribiendo código, hay que definir qué forma va a tener un participante en toda la aplicación.

Este paso es fundamental porque backend y frontend se comunican por JSON. Si no hablan el mismo idioma, la integración se rompe.

### Contrato actual del frontend

El frontend usa este modelo:

```ts
type DatosParticipante = {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: Modalidad;
  tecnologias: string[];
  nivel: Nivel;
  aceptaTerminos: boolean;
};
```

### Contrato actual del backend

El backend usa un modelo más simple:

```py
class Participante(SQLModel, table=True):
    id: Optional[int]
    nombre: str
    email: str
    edad: int
    telefono: str
    modalidad: str
    nivel: str
```

### Decisión recomendada

Conviene adaptar el backend al frontend, porque la interfaz ya está bastante avanzada.

El backend debería guardar, como mínimo:

```txt
id
nombre
email
edad
pais
modalidad
tecnologias
nivel
aceptaTerminos
```

### Alternativas

#### Opción A - Adaptar backend al frontend

Ventajas:

- Se toca menos código del frontend.
- Se conserva la experiencia actual de la app.
- El formulario y las cards pueden mantenerse casi igual.

Desventajas:

- Hay que decidir cómo guardar `tecnologias` en SQLite.
- Puede guardarse como texto JSON o como string separado por comas.

#### Opción B - Adaptar frontend al backend

Ventajas:

- El backend queda más simple.
- Se evita guardar arrays en SQLite.

Desventajas:

- Hay que modificar formulario, modelo, cards y datos iniciales.
- Se pierde información que hoy la UI ya maneja.

### Recomendación

Usar la **Opción A**: adaptar el backend al modelo del frontend.

---

## Paso 2 - Corregir el modelo y los schemas del backend

Modificar:

```txt
Backend/app/Participante/participanteModel.py
Backend/app/Participante/participanteSchema.py
```

El objetivo es que el backend pueda recibir y devolver el mismo JSON que usa React.

### Tareas

- Reemplazar `telefono` por `pais`, si se decide conservar el modelo actual del frontend.
- Agregar `tecnologias`.
- Agregar `aceptaTerminos`.
- Mantener `id`, `nombre`, `email`, `edad`, `modalidad`, `nivel`.
- Definir cómo se persiste `tecnologias`.

### Nota técnica sobre `tecnologias`

SQLite no guarda arrays de forma directa como una columna simple. Para este TP hay dos soluciones razonables:

#### Guardar como JSON string

Ejemplo en base de datos:

```txt
["React", "Node"]
```

Ventaja:

- Mantiene la estructura de lista.

Desventaja:

- Hay que serializar y deserializar.

#### Guardar como string separado por comas

Ejemplo en base de datos:

```txt
React,Node
```

Ventaja:

- Es más simple.

Desventaja:

- Es menos robusto si los valores contienen comas.

Para este TP, cualquiera de las dos sirve. La opción JSON string es más prolija.

---

## Paso 3 - Corregir imports del backend

Modificar `participanteRepository.py`.

Actualmente tiene:

```py
from Backend.app.Participante.participanteModel import Participante
```

Debería quedar consistente con el resto del proyecto:

```py
from app.Participante.participanteModel import Participante
```

Esto evita errores al correr el backend desde la carpeta `Backend` con comandos como:

```bash
uvicorn app.main:app --reload
```

---

## Paso 4 - Implementar el router de participantes

Completar:

```txt
Backend/app/Participante/participanteRouter.py
```

Debe exponer los tres endpoints obligatorios del TP.

### Endpoint 1 - Obtener participantes

```http
GET /participantes
```

Debe devolver la lista completa de participantes en JSON.

### Endpoint 2 - Crear participante

```http
POST /participantes
```

Debe recibir un participante en JSON y guardarlo en la base de datos.

### Endpoint 3 - Eliminar participante

```http
DELETE /participantes/{id}
```

Debe eliminar el participante cuyo ID coincida.

Si el participante no existe, debería responder con error `404`.

---

## Paso 5 - Registrar el router en `main.py`

Modificar:

```txt
Backend/app/main.py
```

Actualmente crea la aplicación y las tablas, pero no incluye rutas.

Debe importar el router de participantes e incluirlo en la app.

Conceptualmente:

```py
from app.Participante.participanteRouter import router as participante_router

app.include_router(participante_router)
```

Sin este paso, aunque el router exista, FastAPI no lo expone. Es como construir una habitación pero olvidarte de ponerle puerta.

---

## Paso 6 - Configurar CORS en el backend

Como el frontend Vite normalmente corre en un puerto distinto al backend, por ejemplo:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:8000
```

el navegador puede bloquear las requests por CORS.

Agregar middleware CORS en `main.py`.

### Tarea

Permitir, como mínimo, el origen del frontend:

```txt
http://localhost:5173
```

Para desarrollo también se puede permitir todo con `*`, aunque para producción no es lo ideal.

---

## Paso 7 - Probar backend de forma aislada

Antes de tocar React, hay que probar el backend solo.

Usar Swagger:

```txt
http://localhost:8000/docs
```

### Pruebas mínimas

1. Ejecutar `POST /participantes` con un participante válido.
2. Ejecutar `GET /participantes` y comprobar que aparece.
3. Ejecutar `DELETE /participantes/{id}`.
4. Ejecutar de nuevo `GET /participantes` y comprobar que ya no está.

Este paso es obligatorio en la práctica, aunque el PDF no lo diga textual. Si el backend no está verificado, conectar React encima solo agrega ruido.

---

## Paso 8 - Crear el contexto de participantes en React

Crear archivo:

```txt
Frontend/src/context/ParticipantesContext.tsx
```

El contexto debe concentrar la lógica de participantes.

### Debe compartir

```ts
participantes
agregar
eliminar
resetear
```

Tal como pide el PDF.

### Forma sugerida del tipo

```ts
type ParticipantesContextType = {
  participantes: Participante[];
  agregar: (participante: Participante) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  resetear: () => Promise<void>;
};
```

### Responsabilidades del provider

El `ParticipantesProvider` debería:

1. Cargar participantes desde el backend al iniciar.
2. Guardar nuevos participantes usando `POST /participantes`.
3. Eliminar participantes usando `DELETE /participantes/{id}`.
4. Actualizar el estado local después de cada operación exitosa.
5. Exponer estado y funciones al resto de la app.

---

## Paso 9 - Crear una capa simple de API en el frontend

Para no llenar el contexto de `fetch` repetidos, conviene crear un archivo separado.

Ejemplo:

```txt
Frontend/src/api/participantesApi.ts
```

### Funciones sugeridas

```ts
obtenerParticipantes()
crearParticipante(participante)
eliminarParticipante(id)
```

### Ventaja

Separás responsabilidades:

- `api/participantesApi.ts` sabe hablar HTTP.
- `ParticipantesContext.tsx` maneja estado global.
- Los componentes renderizan UI.

Esta separación hace que el código sea más fácil de mantener.

---

## Paso 10 - Envolver la aplicación con el provider

Modificar:

```txt
Frontend/src/main.tsx
```

Actualmente renderiza:

```tsx
<App />
```

Debe quedar conceptualmente:

```tsx
<ParticipantesProvider>
  <App />
</ParticipantesProvider>
```

Esto permite que cualquier componente dentro de `App` acceda al contexto.

---

## Paso 11 - Eliminar `localStorage` de `App.tsx`

Modificar:

```txt
Frontend/src/App.tsx
```

Eliminar toda la lógica relacionada con:

```ts
STORAGE_KEY
localStorage.getItem
localStorage.setItem
localStorage.removeItem
participantesIniciales
estaInicializado
```

El estado de participantes ya no debe vivir en `App.tsx`.

### Qué debería quedar en `App.tsx`

`App.tsx` puede conservar:

- estado de filtros
- cálculo de participantes filtrados
- estructura visual principal

Pero la lista real de participantes debe venir del contexto.

---

## Paso 12 - Consumir el contexto desde `App.tsx`

En `App.tsx`, usar el hook del contexto.

Conceptualmente:

```ts
const { participantes, resetear } = useParticipantes();
```

Después usar `participantes` para calcular los filtrados.

El botón de reset debería llamar a `resetear` del contexto.

---

## Paso 13 - Refactorizar `Formulario`

Modificar:

```txt
Frontend/src/components/Formulario.tsx
```

Actualmente recibe una función por props:

```tsx
<Formulario onAgregar={agregarParticipante} />
```

Eso debería eliminarse.

El formulario debería usar directamente el contexto:

```ts
const { agregar } = useParticipantes();
```

Y al enviar:

```ts
await agregar(nuevoParticipante);
```

### Importante

Si el backend genera el `id`, el frontend no debería mandar `Date.now()` como ID definitivo. Puede mandar los datos sin `id`, y usar el participante devuelto por la API.

---

## Paso 14 - Refactorizar `ParticipanteCard`

Modificar:

```txt
Frontend/src/components/ParticipanteCard.tsx
```

Actualmente recibe `onEliminar` por props.

Debería usar contexto:

```ts
const { eliminar } = useParticipantes();
```

Y el botón debería llamar:

```ts
eliminar(participante.id)
```

Así se cumple el objetivo del TP: cualquier componente puede eliminar sin que `App` le pase la función manualmente.

---

## Paso 15 - Revisar `resetear`

El PDF pide que el contexto tenga un método `resetear`.

Hay que decidir qué significa resetear en esta nueva versión.

### Alternativa A - Resetear solo estado local

No recomendado, porque la fuente de verdad ahora es la base de datos.

### Alternativa B - Volver a cargar desde API

`resetear` podría simplemente volver a ejecutar `GET /participantes`.

Ventaja:

- Simple.
- No requiere endpoints extra.
- Cumple razonablemente con el método pedido.

Desventaja:

- No restaura datos iniciales.

### Alternativa C - Borrar todos y restaurar datos iniciales

No recomendado para este TP, porque el backend no pide endpoint para borrar todo.

### Recomendación

Implementar `resetear` como recarga desde la API.

Ejemplo conceptual:

```ts
const resetear = async () => {
  const datos = await obtenerParticipantes();
  setParticipantes(datos);
};
```

---

## Paso 16 - Manejar estados de carga y error

No es el centro del TP, pero mejora la experiencia.

En el contexto se pueden agregar estados como:

```ts
cargando
error
```

No son obligatorios según el PDF, pero ayudan mucho para saber si la API falló.

### Mínimo recomendado

- Mostrar mensaje mientras carga.
- Mostrar error si el backend no responde.
- Evitar que la app falle silenciosamente.

---

## Paso 17 - Verificación funcional completa

Cuando esté todo conectado, probar el flujo completo.

### Checklist de prueba

1. Levantar backend.
2. Levantar frontend.
3. Entrar a la app.
4. Ver que carga participantes desde la API.
5. Crear participante desde el formulario.
6. Confirmar que aparece en pantalla.
7. Refrescar la página.
8. Confirmar que el participante sigue apareciendo.
9. Eliminar participante.
10. Confirmar que desaparece.
11. Refrescar otra vez.
12. Confirmar que sigue eliminado.
13. Probar filtros por nombre, modalidad y nivel.
14. Probar botón de reset.

Si después de refrescar los datos siguen estando, hay persistencia real. Si desaparecen, todavía hay lógica vieja o la API no está guardando correctamente.

---

## Paso 18 - Limpieza final para entrega

Antes de entregar, revisar:

- Que no quede `localStorage` en el frontend.
- Que `participanteRouter.py` no esté vacío.
- Que `main.py` incluya el router.
- Que backend y frontend usen el mismo contrato JSON.
- Que no haya imports inconsistentes.
- Que el código esté ordenado.
- Que el README o apuntes indiquen cómo ejecutar backend y frontend.
- Que el archivo `requirements.txt` tenga dependencias necesarias.
- Que no se suba accidentalmente `venv` si el repositorio va a compartirse.

---

# Orden de prioridad real

Si el objetivo es terminar el TP completo de forma eficiente, seguir este orden:

1. Alinear modelo de participante entre frontend y backend.
2. Corregir imports del backend.
3. Implementar router con `GET`, `POST` y `DELETE`.
4. Registrar router en `main.py`.
5. Configurar CORS.
6. Probar backend en Swagger.
7. Crear `ParticipantesContext`.
8. Crear capa API con `fetch`.
9. Envolver `App` con `ParticipantesProvider`.
10. Sacar `localStorage` de `App.tsx`.
11. Refactorizar `Formulario` para usar contexto.
12. Refactorizar `ParticipanteCard` para usar contexto.
13. Probar flujo completo frontend + backend + base de datos.
14. Limpiar archivos y preparar entrega.

---

# Pendientes obligatorios resumidos

## Backend

- [ ] Alinear modelo de datos con el frontend.
- [ ] Corregir imports inconsistentes.
- [ ] Completar `participanteRouter.py`.
- [ ] Registrar router en `main.py`.
- [ ] Configurar CORS.
- [ ] Confirmar persistencia en SQLite.
- [ ] Probar endpoints en Swagger.

## Frontend

- [ ] Crear `ParticipantesContext.tsx`.
- [ ] Crear hook de consumo del contexto, por ejemplo `useParticipantes`.
- [ ] Crear capa API con `fetch` o usar `fetch` directamente desde el contexto.
- [ ] Envolver `App` con `ParticipantesProvider`.
- [ ] Eliminar `localStorage`.
- [ ] Mover `participantes`, `agregar`, `eliminar` y `resetear` al contexto.
- [ ] Refactorizar `Formulario`.
- [ ] Refactorizar `ParticipanteCard`.
- [ ] Verificar persistencia real después de refrescar la página.

---

# Diagnóstico final

El proyecto tiene buena base, pero todavía falta la integración central del TP.

Estimación aproximada del estado actual:

- Backend funcional: 60% encaminado, pero sin endpoints expuestos.
- Frontend visual: bastante avanzado.
- Integración frontend/backend: pendiente.
- Context API: pendiente.
- Reemplazo de `localStorage`: pendiente.
- Persistencia real visible desde la app: pendiente.

La prioridad no es agregar más pantalla ni más estilos. La prioridad es conectar correctamente:

```txt
React -> Context API -> fetch -> FastAPI -> SQLite
```

Cuando ese circuito funcione, el TP va a estar realmente resuelto.
