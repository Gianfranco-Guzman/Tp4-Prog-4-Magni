# Roadmap del Trabajo Práctico

## 1. Análisis del alcance del práctico
**Descripción:**  
Lo primero es definir con precisión qué pide el TP y qué no. El trabajo exige construir un backend con una API REST que permita **almacenar y recuperar participantes desde una base de datos**, usando comunicación **JSON** entre frontend y backend. También pide exponer tres endpoints obligatorios: obtener participantes, crear participante y eliminar participante. Además, en el frontend hay que reemplazar `localStorage` y mover el estado a un contexto global usando `Context API` y `useContext`.  
**Qué hay que usar sí o sí según el TP:**  
- API REST
- Base de datos SQL o NoSQL
- JSON
- Endpoints `GET /participantes`, `POST /participantes`, `DELETE /participantes/{id}`
- `Context API`
- `useContext`
- `fetch` o `axios` :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}

---

## 2. Diseño de la arquitectura del backend
**Descripción:**  
Antes de escribir código conviene definir la estructura del proyecto. Como querés empezar por backend, esta etapa consiste en organizar carpetas y responsabilidades. La idea es separar lo reutilizable en una carpeta `Core` y lo específico del dominio en una carpeta `Participante`. Esto te permite tener el proyecto ordenado desde el inicio y facilita después agregar validaciones, servicios y acceso a datos sin mezclar todo en un solo archivo.  
**Qué conviene usar para hacerlo bien:**  
- `Core` para configuración, base de datos, repositorio base y Unit of Work
- `Participante` para modelo, schema, repositorio, service y router
- Separación por capas: router, service, repository, model/schema  
**Importancia para el TP:**  
No es algo exigido textualmente por el práctico, pero sí ayuda a resolverlo de forma prolija y escalable.

---

## 3. Configuración inicial del backend FastAPI
**Descripción:**  
En esta sección se crea el proyecto FastAPI, se instala lo necesario y se prepara el archivo principal para levantar la API. También se define cómo se va a correr el servidor en desarrollo. El objetivo es tener una base mínima funcionando antes de empezar con la lógica de participantes.  
**Qué hay que usar:**  
- `FastAPI`
- `uvicorn`
- Entorno virtual
- Archivo principal tipo `main.py`  
**Importancia para el TP:**  
Es la base para poder exponer los endpoints REST que el práctico exige. :contentReference[oaicite:4]{index=4}

---

## 4. Configuración de la persistencia y base de datos
**Descripción:**  
El práctico exige explícitamente que los participantes se almacenen y recuperen desde una **base de datos SQL o NoSQL**, así que esta etapa es obligatoria. Acá hay que elegir la tecnología y configurar la conexión. Para este TP, una opción simple y válida es usar SQLite si querés algo rápido y fácil de levantar, aunque también podría ser PostgreSQL u otra base.  
**Qué hay que usar sí o sí según el TP:**  
- Una base de datos real, no `localStorage`
- Persistencia de datos  
**Qué conviene usar para implementarlo bien:**  
- SQLModel o SQLAlchemy si vas por SQL
- archivo `database.py`
- configuración centralizada en `config.py` :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6}

---

## 5. Modelado de la entidad Participante
**Descripción:**  
En esta parte definís cómo se representa un participante en la base de datos y en la aplicación. Hay que crear el modelo de persistencia y también los esquemas de entrada y salida para la API. Esto permite validar correctamente los datos que llegan en el `POST` y devolver respuestas consistentes en JSON.  
**Qué conviene usar para hacerlo bien:**  
- `participanteModel.py` para la tabla o documento
- `participanteSchema.py` para DTOs de entrada y salida
- validación con Pydantic / SQLModel  
**Importancia para el TP:**  
Es necesario porque el endpoint `POST /participantes` recibe un participante en JSON y lo guarda en la base. :contentReference[oaicite:7]{index=7}

---

## 6. Implementación del acceso a datos
**Descripción:**  
Acá se implementa la lógica que realmente consulta, inserta y elimina participantes en la base de datos. La idea es encapsular esas operaciones en un repositorio para no meter consultas SQL o lógica de sesión directamente en el router.  
**Qué conviene usar para hacerlo bien:**  
- `participanteRepository.py`
- Métodos como `obtener_todos`, `crear`, `eliminar`
- `repository.py` base si querés reutilizar lógica
- `UnitOfWork` para manejar sesión y commit/rollback  
**Importancia para el TP:**  
Es la capa que hace posible cumplir con los tres endpoints obligatorios.

---

## 7. Implementación de la lógica de negocio
**Descripción:**  
En esta sección se crea la capa de servicios. Acá no solo llamás al repositorio, sino que también centralizás reglas de negocio, validaciones y manejo de errores. Por ejemplo, verificar si un participante existe antes de eliminarlo o devolver errores correctos si algo falla.  
**Qué conviene usar para hacerlo bien:**  
- `participanteService.py`
- `HTTPException` para errores
- `UnitOfWork` para coordinar acceso a datos  
**Importancia para el TP:**  
No lo pide explícitamente, pero mejora mucho la estructura y evita mezclar lógica en los endpoints.

---

## 8. Exposición de los endpoints REST obligatorios
**Descripción:**  
Esta es una de las partes centrales del práctico. Hay que crear los tres endpoints pedidos: uno para obtener la lista completa, otro para crear un participante y otro para eliminarlo por ID. Todos deben trabajar con JSON.  
**Qué hay que usar sí o sí según el TP:**  
- `GET /participantes`
- `POST /participantes`
- `DELETE /participantes/{id}`
- Respuestas en JSON  
**Qué conviene usar para implementarlo bien:**  
- `APIRouter`
- `response_model`
- rutas agrupadas en `participanteRouter.py` :contentReference[oaicite:8]{index=8}

---

## 9. Pruebas del backend de forma aislada
**Descripción:**  
Antes de conectar el frontend, hay que probar que el backend funcione solo. Esto implica verificar que los endpoints respondan correctamente, que el `POST` guarde en base de datos, que el `GET` recupere lo almacenado y que el `DELETE` elimine por ID.  
**Qué conviene usar para hacerlo bien:**  
- Swagger en `/docs`
- Postman o Insomnia
- pruebas manuales de creación, listado y eliminación  
**Importancia para el TP:**  
No aparece como requisito textual, pero es necesaria para asegurarte de que la parte backend ya cumple con el enunciado.

---

## 10. Reemplazo de localStorage en el frontend
**Descripción:**  
Una vez que el backend funcione, el siguiente paso es modificar el frontend para dejar de guardar participantes en `localStorage`. En su lugar, los datos deben venir de la API y enviarse a la API. Esta parte es obligatoria porque el práctico lo pide explícitamente.  
**Qué hay que usar sí o sí según el TP:**  
- Reemplazar `localStorage`
- Consumir la API mediante `fetch` o `axios` :contentReference[oaicite:9]{index=9}

---

## 11. Integración del frontend con la API
**Descripción:**  
Acá se conectan las pantallas o componentes del frontend con el backend. Eso implica pedir la lista de participantes al cargar, enviar nuevos participantes al crear, y llamar al endpoint de borrado cuando se elimina uno.  
**Qué hay que usar sí o sí según el TP:**  
- `fetch` o `axios`
- JSON en requests y responses :contentReference[oaicite:10]{index=10} :contentReference[oaicite:11]{index=11}  
**Qué conviene revisar:**  
- manejo de errores
- actualización visual luego de alta o baja
- sincronización entre estado local y respuesta de la API

---

## 12. Migración del estado global a Context API
**Descripción:**  
El TP dice explícitamente que hay que sacar los participantes de `Home` y llevarlos a un contexto. Entonces esta etapa consiste en crear un contexto global que comparta la variable `participantes` y sus métodos de actualización para que cualquier componente pueda acceder sin pasar props manualmente.  
**Qué hay que usar sí o sí según el TP:**  
- `createContext()`
- `Provider`
- `useContext`
- variable global `participantes`
- métodos `agregar`, `eliminar`, `resetear` :contentReference[oaicite:12]{index=12}  
**Importancia para el TP:**  
Es uno de los requisitos clave del frontend actualizado.

---

## 13. Refactor de componentes para consumir el contexto
**Descripción:**  
Una vez creado el contexto, hay que adaptar los componentes para que ya no reciban la lista ni las funciones por props si no hace falta. En vez de eso, deben leer y ejecutar acciones directamente desde el contexto global.  
**Qué hay que usar sí o sí según el TP:**  
- `ParticipantesProvider`
- `useContext(MiContext)` :contentReference[oaicite:13]{index=13}  
**Objetivo concreto:**  
Que cualquier componente pueda:
- leer la lista
- agregar participantes
- eliminar participantes  
tal como lo indica el práctico. :contentReference[oaicite:14]{index=14}

---

## 14. Verificación funcional completa
**Descripción:**  
En esta etapa se prueba el flujo completo, desde el frontend hasta la base de datos. El comportamiento final debe ser el mismo que en la versión anterior, pero ahora con persistencia real y estado compartido globalmente.  
**Qué hay que validar según el TP:**  
- la app sigue funcionando como antes
- ahora hay persistencia en base de datos
- ahora la lista y métodos se comparten mediante `useContext` :contentReference[oaicite:15]{index=15}

---

## 15. Preparación final para entrega
**Descripción:**  
La última parte consiste en ordenar el proyecto, limpiar código innecesario, revisar nombres, estructura y funcionamiento general. También conviene dejar claro cómo correr backend y frontend, y verificar que no quede lógica vieja con `localStorage`.  
**Qué conviene revisar:**  
- estructura ordenada
- imports limpios
- endpoints funcionando
- contexto funcionando
- frontend consumiendo backend
- datos persistiendo realmente