# Documentacion tecnica de MediTurno

Este documento resume la configuracion tecnica del proyecto. La guia completa esta en el [README principal](../README.md).

## Arquitectura

- Backend Express en `src/backend`.
- Frontend HTML, CSS y JavaScript en `src/frontend`.
- Pruebas automatizadas con Jest y Supertest en `src/backend/test`.
- CI/CD con GitHub Actions en `.github/workflows/ci.yml`.
- Despliegue en Render usando Deploy Hook y `render.yaml`.

## Flujo CI/CD

```text
feature/* -> develop -> main -> Render
```

- Los Pull Requests hacia `develop` y `main` ejecutan validaciones automaticas.
- Los pushes hacia `develop` y `main` ejecutan validaciones automaticas.
- El despliegue a Render solo se dispara con push a `main`.

## Validaciones automaticas

- Node.js 20.
- `npm ci` en `src/backend`.
- `npm test` en `src/backend`.
- Revision con `test -s` de los archivos principales del frontend.
- `JWT_SECRET` de prueba configurado solo para CI.

## Render

Configuracion esperada:

- Branch: `main`
- Runtime: Node
- Build command: `cd src/backend && npm ci && npm test && rm -rf public && mkdir -p public && cp -R ../frontend/* public && npm prune --omit=dev`
- Start command: `cd src/backend && npm start`
- Variables: `NODE_ENV=production` y `JWT_SECRET` configurado como secreto.

## Endpoints

- `GET /`
- `GET /api/health`
- `POST /api/usuarios/registro`
- `POST /api/usuarios/login`
- `GET /api/turnos`
- `POST /api/turnos`
- `DELETE /api/turnos/:id`
