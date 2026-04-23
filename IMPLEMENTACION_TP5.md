Implementación TP5 - Gestión de Estado con useReducer + Context

CÓMO CORRER EL PROYECTO

Backend:
1. Abrí una terminal en Backend/
2. Asegúrate de tener Python 3.10+
3. pip install -r requirements.txt
4. uvicorn app.main:app --reload
   El backend corre en http://localhost:8000

Frontend:
1. Abrí otra terminal en Frontend/
2. npm install (primera vez)
3. npm run dev
   El frontend corre en http://localhost:5173

Luego accedé a http://localhost:5173 en tu navegador.

OBJETIVO
Reemplazar la lógica dispersa de useState por useReducer centralizado y agregar funcionalidad de edición de participantes.

CAMBIOS REALIZADOS

1. FRONTEND - ParticipantesContext.tsx

Antes (TP4):
- Usaba useState para manejar el estado
- La lógica estaba dispersa con setParticipantes en varios lugares
- No había forma de editar participantes

Ahora (TP5):
- Implementa useReducer que centraliza TODA la lógica en una sola función
- Todas las acciones pasan por el reducer que decide cómo cambiar el estado
- Se agregó estado para rastrear qué participante está siendo editado

Funciones del Reducer:

GET_PARTICIPANTES: Carga todos los participantes del backend al iniciar
AGREGAR: Agrega un nuevo participante a la lista
ELIMINAR: Elimina un participante por ID
EDITAR: Actualiza un participante existente
RESET: Recarga todos los participantes
CARGAR_EDICION: Marca un participante para ser editado
LIMPIAR_EDICION: Limpia el participante en edición


2. FRONTEND - Formulario.tsx

Cambios:
- Ahora recibe participanteEnEdicion del Context
- Usa useEffect para detectar cuando se carga un participante para editar
- Si participanteEnEdicion existe, rellena el formulario con esos datos
- El botón cambia de "Registrar participante" a "Guardar cambios" cuando edita
- Se agregó botón "Cancelar" que aparece solo cuando estamos editando
- En manejarEnvio, verifica si está editando o agregando y llama a la función correcta


3. FRONTEND - ParticipanteCard.tsx

Cambios:
- Se agregó botón "Editar" junto a "Eliminar"
- El botón Editar llama a cargarEdicion() que pone el participante en el estado
- Esto causa que el Formulario se rellene automáticamente


4. FRONTEND - participantesApi.ts

Cambios:
- Se agregó función actualizarParticipante(id, datos)
- Envía PUT request al backend con los datos del participante modificado


5. BACKEND - participanteRouter.py

Cambios:
- Se agregó endpoint PUT /participantes/{participante_id}
- Recibe los datos del participante y el ID
- Llama al servicio para actualizar


6. BACKEND - participanteService.py

Cambios:
- Se agregó método actualizar_participante(participante_id, datos_participante)
- Obtiene el participante por ID
- Verifica que exista
- Actualiza todos sus campos
- Guarda los cambios en la base de datos


7. BACKEND - participanteRepository.py

Cambios:
- Se agregó método actualizar(participante)
- Es igual a crear(), ya que SQLModel maneja las actualizaciones igual que las inserciones


FLUJO DE EDICIÓN

1. Usuario hace click en botón "Editar" en una tarjeta
2. ParticipanteCard llama a cargarEdicion(participante)
3. Esto dispara acción CARGAR_EDICION en el reducer
4. El estado ahora tiene participanteEnEdicion = participante
5. Formulario detecta con useEffect que participanteEnEdicion cambió
6. Rellena todos los campos con los datos del participante
7. Usuario modifica los datos y hace click en "Guardar cambios"
8. manejarEnvio() detecta que estoyEditando = true
9. Crea objeto con los datos nuevos + el ID original
10. Llama a editar(participanteActualizado)
11. editar() hace PUT request al backend
12. Backend actualiza en base de datos
13. Reducer dispara acción EDITAR con los datos nuevos
14. Estado se actualiza, la tarjeta se re-renderiza con nuevos datos
15. limpiarEdicion() limpia el estado
16. Formulario vuelve a estado inicial


POR QUÉ REDUCER ES MEJOR QUE USESTATE

Con useState:
- setParticipantes esparcido por el código
- Difícil de trackear dónde cambia el estado
- Si la lógica crece, se vuelve un lío

Con useReducer:
- Un solo lugar donde cambia el estado (la función reducer)
- Cada acción está explícita (GET_PARTICIPANTES, AGREGAR, etc.)
- Fácil de agregar nuevas acciones sin romper nada
- La lógica es predecible y testeable


QUÉ APRENDISTE CON TP5

1. useReducer centraliza la lógica de estado
2. Las acciones son objetos explícitos con type y payload
3. El reducer es una función pura que no hace side effects
4. Context + Reducer = patrón poderoso para aplicaciones medianas
5. El editor puede ser el mismo formulario detectando si hay participanteEnEdicion
6. useEffect es útil para detectar cambios en el estado del Context


PRÓXIMOS PASOS (TP6)

- Agregar validaciones más robustas en el frontend
- Implementar estados de loading y error
- Agregar notificaciones cuando se actualiza un participante
- Tests unitarios para el reducer
