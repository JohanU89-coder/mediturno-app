# MediTurno

MediTurno es una aplicacion web academica para gestionar turnos medicos. Permite registrar usuarios, iniciar sesion, reservar turnos, consultar las citas del usuario autenticado y cancelar turnos existentes.

## Tecnologias usadas

- HTML, CSS y JavaScript
- Node.js
- Express
- JWT
- bcrypt
- Jest
- Supertest
- GitHub Actions
- Render

## Estructura del proyecto

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
|       |-- styleindex.css
|       `-- styles.css
|-- .env.example
|-- .gitignore
|-- render.yaml
`-- README.md
```

## Estrategia de ramas

- `main`: rama estable y de produccion.
- `develop`: rama de integracion.
- `feature/*`: ramas de desarrollo para nuevas funcionalidades o configuraciones.
- `release/*`: ramas de preparacion de version antes de produccion.

Flujo esperado:

```text
feature/* -> develop -> main -> Render
```

No se realizan cambios directos en `main`. El despliegue automatico ocurre solo cuando los cambios llegan a `main`.

## Flujo de trabajo

1. Crear una rama `feature/*` desde `develop`.
2. Implementar cambios y ejecutar pruebas locales.
3. Abrir Pull Request hacia `develop`.
4. GitHub Actions valida backend y frontend.
5. Abrir Pull Request de `develop` hacia `main`.
6. Al fusionar en `main`, GitHub Actions dispara el Deploy Hook de Render.

GitHub Actions valida codigo en `develop` y `main`, pero el despliegue solo ocurre al fusionar cambios en `main`.

## Ejecucion local

Crear variables de entorno antes de iniciar:

```bash
cd src/backend
npm ci
npm start
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

El servidor usa `PORT` o `5000` por defecto. En produccion sirve el frontend desde `src/backend/public`. En local, si `src/backend/public` no existe, sirve los archivos desde `src/frontend`.

## Pruebas

```bash
cd src/backend
npm ci
npm test
```

Las pruebas usan Jest y Supertest para validar registro, login, JWT, creacion, consulta y cancelacion de turnos.

## Variables de entorno

```text
PORT
JWT_SECRET
NODE_ENV
```

`JWT_SECRET` debe configurarse como variable de entorno. No debe subirse un secreto real al repositorio.

## GitHub Actions

El workflow esta en `.github/workflows/ci.yml` y se ejecuta en:

- `pull_request` hacia `develop` y `main`
- `push` hacia `develop` y `main`

El job de validacion:

- Usa Ubuntu.
- Usa Node.js 20.
- Ejecuta `npm ci` y `npm test` en `src/backend`.
- Configura un `JWT_SECRET` de prueba para CI.
- Valida que los archivos principales del frontend existan y no esten vacios con `test -s`.

Secrets necesarios en GitHub:

```text
RENDER_DEPLOY_HOOK_URL
RENDER_SERVICE_URL
```

`RENDER_DEPLOY_HOOK_URL` dispara el despliegue en Render. `RENDER_SERVICE_URL` es opcional y permite ejecutar un smoke test contra `/api/health`.

## Configuracion de Render

El repositorio incluye `render.yaml` para definir un Web Service Node. Tambien puede configurarse manualmente en Render con estos valores:

- Branch: `main`
- Runtime: Node
- Build command:

```bash
cd src/backend && npm ci --include=dev && npm test && rm -rf public && mkdir -p public && cp -R ../frontend/* public && npm prune --omit=dev
```

- Start command:

```bash
cd src/backend && npm start
```

Variables de entorno en Render:

```text
NODE_ENV=production
JWT_SECRET=<valor-secreto-configurado-en-render>
```

Render define `PORT` automaticamente para el servicio web. El Health Check Path recomendado es `/api/health`.

## Endpoints principales

| Metodo | Endpoint                 | Descripcion                         | Autenticacion |
| ------ | ------------------------ | ----------------------------------- | ------------- |
| GET    | `/`                      | Frontend de MediTurno               | No            |
| GET    | `/api/health`            | Health check del backend            | No            |
| POST   | `/api/usuarios/registro` | Registra un usuario                 | No            |
| POST   | `/api/usuarios/login`    | Inicia sesion y genera JWT          | No            |
| GET    | `/api/turnos`            | Lista turnos del usuario autenticado | Si            |
| POST   | `/api/turnos`            | Crea un turno                       | Si            |
| DELETE | `/api/turnos/:id`        | Cancela un turno                    | Si            |

## Seguridad y control de archivos

- `.env` no debe versionarse.
- `.env.example` se mantiene como referencia sin secretos reales.
- `node_modules`, logs, coverage y `src/backend/public` no se versionan.
- `src/backend/public` se genera durante el build de Render.

## Pasos manuales para produccion

1. Crear el servicio Web Service en Render conectado al repositorio.
2. Configurar `JWT_SECRET` y `NODE_ENV=production` en Render.
3. Crear el Deploy Hook en Render.
4. Agregar `RENDER_DEPLOY_HOOK_URL` como secret en GitHub.
5. Agregar `RENDER_SERVICE_URL` como secret opcional en GitHub para smoke test.
6. Crear PR de `feature/render-deploy` hacia `develop`.
7. Crear PR de `develop` hacia `main` cuando la integracion este aprobada.
