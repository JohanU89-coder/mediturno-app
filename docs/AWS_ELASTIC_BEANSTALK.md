# Preparacion para AWS Elastic Beanstalk

Esta guia prepara MediTurno para una demostracion academica en AWS Elastic Beanstalk usando Docker sobre Amazon Linux 2023. No se utiliza Amazon EKS. Kubernetes queda limitado a la demostracion local con Docker Desktop.

## Antes de desplegar

Elastic Beanstalk crea recursos facturables como instancias EC2, buckets S3, stacks de CloudFormation, grupos de seguridad y registros de logs. Antes de crear el entorno, configurar un presupuesto en AWS Budgets y alertas por correo.

## Crear la aplicacion

1. Entrar a AWS Console.
2. Buscar Elastic Beanstalk.
3. Elegir Create application.
4. Usar el nombre `mediturno-app`.

## Crear el entorno

1. Elegir Web server environment.
2. Usar el nombre `mediturno-dev`.
3. En Platform, seleccionar Docker.
4. Elegir Docker running on 64bit Amazon Linux 2023.
5. Para la practica academica, seleccionar Single instance.
6. Cargar el codigo fuente del repositorio como ZIP o desde la opcion que indique la consola.

Elastic Beanstalk puede construir la aplicacion desde el `Dockerfile` de la raiz. No se agrega `Dockerrun.aws.json` porque no es necesario para este caso.

## Variables de entorno

En Configuration, Software, Environment properties, configurar:

```text
NODE_ENV=production
PORT=5000
JWT_SECRET=<valor-seguro-configurado-en-AWS>
```

`JWT_SECRET` debe configurarse como propiedad protegida del entorno. No debe escribirse en archivos del repositorio.

## Health check

Configurar la ruta de verificacion:

```text
/api/health
```

La respuesta esperada es HTTP 200 con estado `ok`.

## Comprobaciones

Despues del despliegue:

1. Abrir la URL publica del entorno.
2. Probar `/`.
3. Probar `/api/health`.
4. Revisar Health.
5. Revisar Events.
6. Revisar Logs.

## Capturas para el informe

- Aplicacion `mediturno-app`.
- Entorno `mediturno-dev`.
- Plataforma Docker sobre Amazon Linux 2023.
- Tipo Single instance.
- Variables de entorno sin revelar el valor de `JWT_SECRET`.
- Health check configurado en `/api/health`.
- URL de la aplicacion funcionando.
- Respuesta de `/api/health`.
- Eventos del despliegue.
- Logs del entorno.
- Presupuesto o alerta de costos configurada.

## Limpieza para evitar cargos

Al terminar la demostracion:

1. Terminar el entorno `mediturno-dev`.
2. Verificar que la instancia EC2 asociada se haya eliminado.
3. Revisar el bucket S3 creado por Elastic Beanstalk.
4. Revisar el stack de CloudFormation.
5. Revisar grupos de seguridad asociados.
6. Revisar que no queden recursos activos relacionados.

## Comandos opcionales

No ejecutar estos comandos hasta tener claro que pueden crear recursos facturables:

```bash
aws elasticbeanstalk create-application --application-name mediturno-app
aws elasticbeanstalk create-environment --application-name mediturno-app --environment-name mediturno-dev
eb init
eb create mediturno-dev
eb deploy
eb terminate mediturno-dev
```

Los comandos `create-environment`, `eb create` y despliegues equivalentes pueden crear recursos con costo.

## Automatizacion futura con OIDC

La plantilla documental esta en `docs/examples/deploy-aws-elastic-beanstalk.yml`. No esta activa porque no se encuentra dentro de `.github/workflows`.

Antes de activarla:

1. Crear la aplicacion y el entorno en Elastic Beanstalk.
2. Configurar un proveedor OIDC de GitHub en AWS.
3. Crear un rol IAM para GitHub Actions.
4. Guardar `AWS_ROLE_ARN` como secret en GitHub.
5. Configurar variables `AWS_REGION`, `AWS_EB_APPLICATION` y `AWS_EB_ENVIRONMENT`.
6. No usar Access Key ID ni Secret Access Key permanentes.
