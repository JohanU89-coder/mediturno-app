# Kubernetes local con Docker Desktop

Esta carpeta permite demostrar MediTurno en Kubernetes local usando Docker Desktop. No usa Amazon EKS y no guarda secretos reales en Git.

## 1. Habilitar Kubernetes

1. Abrir Docker Desktop.
2. Entrar a Settings.
3. Ir a Kubernetes.
4. Activar Enable Kubernetes.
5. Aplicar los cambios y esperar a que Docker Desktop indique que Kubernetes esta iniciado.

## 2. Verificar el contexto

```bash
kubectl config use-context docker-desktop
kubectl config current-context
kubectl version --client
```

El contexto esperado para esta practica es `docker-desktop`.

## 3. Construir la imagen local

Ejecutar desde la raiz del repositorio:

```bash
docker build -t mediturno-app:local .
```

El Deployment usa `imagePullPolicy: IfNotPresent` para que Kubernetes pueda usar la imagen local disponible en Docker Desktop.

## 4. Crear el Secret

Crear el secreto directamente en Kubernetes. No guardar el valor en archivos YAML ni subirlo a Git.

```bash
kubectl create secret generic mediturno-secret --from-literal=JWT_SECRET="valor-local-de-prueba"
```

## 5. Desplegar

```bash
kubectl apply -k k8s
```

## 6. Revisar el estado

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl rollout status deployment/mediturno
kubectl logs deployment/mediturno
```

El Pod debe quedar `Ready 1/1`.

## 7. Acceder a la aplicacion

```bash
kubectl port-forward service/mediturno-service 8080:80
```

Abrir:

- http://localhost:8080/
- http://localhost:8080/api/health

## 8. Eliminar recursos locales

```bash
kubectl delete -k k8s
kubectl delete secret mediturno-secret
```

## 9. Por que se usa una replica

MediTurno almacena usuarios y turnos en memoria. Si se ejecutaran varias replicas, cada Pod tendria sus propios datos y los usuarios podrian ver informacion diferente segun el Pod que atienda la solicitud. Por eso esta demostracion usa una sola replica hasta que exista una base de datos persistente compartida.
