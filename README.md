# MediTurno

MediTurno es una aplicacion web academica para gestionar turnos medicos. Permite registrar usuarios, iniciar sesion, reservar turnos, consultar los turnos del usuario autenticado y cancelar turnos existentes.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Node.js
- Express
- JWT
- bcrypt
- Jest
- Supertest
- GitHub Actions
- Git y GitHub

## Estructura del repositorio

```text
.
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- docs/
|   `-- README.md
|-- src/
|   |-- backend/
|   |   |-- routes/
|   |   |   |-- appointments.js
|   |   |   `-- users.js
|   |   |-- test/
|   |   |   `-- api.test.js
|   |   |-- config.js
|   |   |-- index.js
|   |   |-- package-lock.json
|   |   `-- package.json
|   `-- frontend/
|       |-- appointments.css
|       |-- appointments.html
|       |-- appointments.js
|       |-- index.html
|       |-- login.html
|       |-- register.html
|       `-- styles.css
|-- .env.example
|-- .gitattributes
|-- .gitignore
`-- README.md
```

## Requisitos previos

- Node.js 20 o compatible
- npm
- Git

## Instalacion y ejecucion

```bash
git clone https://github.com/JohanU89-coder/mediturno-app.git
cd mediturno-app/src/backend
npm install
```

En Windows PowerShell:

```powershell
$env:JWT_SECRET="secreto-local-seguro"
$env:PORT="5000"
npm start
```

En Linux o macOS:

```bash
export JWT_SECRET="secreto-local-seguro"
export PORT="5000"
npm start
```

El backend inicia en el puerto configurado por `PORT` o en `5000` por defecto. El frontend esta compuesto por archivos HTML, CSS y JavaScript ubicados en `src/frontend/`.

## Ejecucion de pruebas

```bash
cd src/backend
npm ci
npm test
```

Las pruebas automatizadas validan registro, login, manejo de contrasenas en respuestas, autenticacion con JWT, creacion, consulta y cancelacion de turnos, ademas de validaciones de campos obligatorios.

## Endpoints

| Metodo | Endpoint                 | Descripcion                  | Autenticacion |
| ------ | ------------------------ | ---------------------------- | ------------- |
| POST   | `/api/usuarios/registro` | Registra un usuario          | No            |
| POST   | `/api/usuarios/login`    | Inicia sesion y genera JWT   | No            |
| GET    | `/api/turnos`            | Lista los turnos del usuario | Si            |
| POST   | `/api/turnos`            | Crea un turno                | Si            |
| DELETE | `/api/turnos/:id`        | Cancela un turno             | Si            |
| GET    | `/`                      | Health check del servidor    | No            |

## Flujo de ramas

El flujo de trabajo considerado para el proyecto contempla:

```text
main
develop
feature/*
release/*
bugfix/*
hotfix/*
```

Ramas verificadas en el repositorio local y remoto al momento de esta revision:

```text
main
develop
feature/registro-login
feature/api-usuarios
feature/api-turnos
feature/agendamiento-citas
feature/github-actions
frontend
release/v1.0
```

## Integracion continua

El workflow de GitHub Actions se encuentra en `.github/workflows/ci.yml`. Actualmente:

- Instala dependencias del backend con `npm ci`.
- Ejecuta las pruebas automatizadas con Jest y Supertest.
- Configura `JWT_SECRET` solo para CI.
- Verifica que existan los archivos principales del frontend.
- Se ejecuta en pushes hacia `develop`, `main`, `feature/**` y `release/**`.
- Se ejecuta en Pull Requests hacia `develop` y `main`.

Actualmente el proyecto implementa Integracion Continua. El despliegue automatico hacia produccion se considera una mejora futura.

## Seguridad

- Las contrasenas se protegen con bcrypt antes de guardarse en memoria.
- La autenticacion utiliza JWT.
- `JWT_SECRET` se obtiene desde variables de entorno.
- El archivo `.env` no debe versionarse.
- `.env.example` contiene solo valores de referencia para configuracion local.

## Limitaciones actuales y mejoras futuras

- Actualmente no existe despliegue automatico.
- Los usuarios y turnos se almacenan en memoria; se recomienda incorporar una base de datos persistente.
- Se recomienda ampliar las pruebas del frontend.
- Se recomienda implementar roles.
- Se recomienda configurar proteccion de ramas desde GitHub.
