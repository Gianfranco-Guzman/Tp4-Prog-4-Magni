PRUEBAS MANUALES TP5

Lo que debés probar para verificar que todo funciona correctamente.

PRECONDICIONES

1. Tené dos terminales abiertas:
   Terminal 1: Backend en http://localhost:8000
   Terminal 2: Frontend en http://localhost:5173

2. Navegador abierto en http://localhost:5173

TESTS A REALIZAR

Test 1: Crear un participante (TP4 - Sigue funcionando)
1. Completa el formulario con datos válidos
2. Haz click en "Registrar participante"
3. Verifica que aparezca en la lista con los datos correctos
4. Verifica que se vea en el backend: http://localhost:8000/docs (Swagger UI)

Test 2: Eliminar un participante (TP4 - Sigue funcionando)
1. Crea un participante (Test 1)
2. Haz click en botón "Eliminar" en su tarjeta
3. Verifica que desaparezca de la lista
4. Verifica que ya no existe en el backend

Test 3: Editar un participante (NUEVO en TP5)
1. Crea un participante: nombre="Juan", email="juan@mail.com"
2. Haz click en botón "Editar" en su tarjeta
3. Verifica que:
   - El formulario se llena con los datos de Juan
   - El botón cambió a "Guardar cambios"
   - Aparece botón "Cancelar"
4. Cambia el nombre a "Juan Pérez"
5. Haz click en "Guardar cambios"
6. Verifica que:
   - La tarjeta actualice el nombre a "Juan Pérez"
   - El formulario se limpie (vuelva a vacío)
   - El botón vuelva a "Registrar participante"

Test 4: Cancelar edición (NUEVO en TP5)
1. Crea un participante: nombre="María"
2. Haz click en "Editar"
3. Cambia el nombre a "María García" (pero NO hagas click en Guardar)
4. Haz click en "Cancelar"
5. Verifica que:
   - El formulario se limpie
   - La tarjeta siga con nombre "María" (sin cambios)
   - El nombre no se guardó en la base de datos

Test 5: Filtros (TP4 - Siguen funcionando)
1. Crea varios participantes con distintas modalidades
2. Usa filtros para buscar por nombre, modalidad, nivel
3. Verifica que funcione correctamente

Test 6: Resetear datos (TP4 - Sigue funcionando)
1. Crea algunos participantes
2. Haz click en "Resetear datos"
3. Verifica que se recargue la lista desde la BD

CASOS EDGE QUE DEBERÍAS PROBAR

1. Editar y luego editar otro participante sin cancelar el primero
   - El formulario debe cargarse con los nuevos datos

2. Editar un participante, cambiar tecnologías
   - Las tecnologías deben guardarse correctamente

3. Cambiar modalidad mientras estás editando
   - El radio button debe cambiar y guardarse

4. Editar participante que no existe (si lo intentas borrar y luego editar)
   - Debería haber un error (pero probablemente se recargará la lista)

CÓMO SABER SI TODO FUNCIONA

- Frontend: Compila sin errores (✓ ya verificado)
- Backend: Responde a GET /participantes, POST, PUT, DELETE
- Edición: Cargar datos → Modificar → Guardar → Se actualiza
- UI: Botones cambian, formulario se llena/limpia automáticamente

SI ALGO NO FUNCIONA

1. Abre Console (F12) en el navegador - busca errores rojos
2. Abre Network - verifica que las requests se envíen correctamente
3. Verifica que el backend esté corriendo en http://localhost:8000
4. Verifica que la BD (participantes.db) exista en Backend/

ENDPOINT A PROBAR MANUALMENTE (en Swagger UI)

GET /participantes - Obtiene todos
POST /participantes - Crea uno nuevo
PUT /participantes/{id} - Actualiza uno (NUEVO)
DELETE /participantes/{id} - Elimina uno

Ve a http://localhost:8000/docs y prueba el endpoint PUT con un ID existente.
