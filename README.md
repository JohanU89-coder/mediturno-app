# MediTurno 🏥

Aplicación web para reservas de turnos médicos online.

## 📋 Descripción

MediTurno permite a pacientes registrarse, iniciar sesión y agendar citas médicas.
Los administradores pueden gestionar y confirmar los turnos del día.

## 🛠️ Tecnologías utilizadas

- HTML, CSS, JavaScript (Frontend)
- Node.js + Express (Backend)
- Git + GitHub (Control de versiones)

## 👥 Equipo de desarrollo

| Integrante     | Rol                         |
| -------------- | --------------------------- |
| Johan Gonzales | Líder del Proyecto / DevOps |
| Integrante 2   | Desarrollador Frontend      |
| Integrante 3   | Desarrollador Frontend      |
| Integrante 4   | Desarrollador Backend       |
| Integrante 5   | Backend + QA                |

## 🚀 Instalación

```bash
git clone https://github.com/TU_USUARIO/mediturno-app.git
cd mediturno-app/src/backend
npm install
node server.js
```

## 📁 Estructura del proyecto

mediturno-app/
├── src/
│ ├── frontend/
│ └── backend/
└── docs/

## 📌 Versión actual

v1.0 — Primera versión funcional

## Pruebas de Integracion Continua con Jenkins Local

Para ejecutar y probar el pipeline definido en el Jenkinsfile de forma local, siga estos pasos:

1. Levantar el servidor Jenkins en Docker:
   Ejecute el siguiente comando en su terminal (PowerShell) para iniciar el contenedor de Jenkins localmente:
   ```powershell
   docker run -d `
     --name jenkins-mediturno `
     -p 8080:8080 `
     -p 50000:50000 `
     -v jenkins_home:/var/jenkins_home `
     jenkins/jenkins:lts
   ```

2. Obtener la contrasena inicial de administrador:
   Una vez que el contenedor este corriendo, ejecute el siguiente comando para ver la clave de desbloqueo:
   ```powershell
   docker exec jenkins-mediturno cat /var/jenkins_home/secrets/initialAdminPassword
   ```

3. Configurar Jenkins en el navegador:
   * Abra http://localhost:8080 en su navegador.
   * Pegue la contrasena inicial obtenida.
   * Seleccione la opcion "Install suggested plugins" para instalar los complementos basicos.
   * Puede omitir la creacion de un usuario administrador personalizado para continuar con el usuario "admin" por defecto.

4. Instalar y configurar el plugin de NodeJS:
   * Vaya a "Administrar Jenkins" (Manage Jenkins) -> "Plugins".
   * Busque el plugin "NodeJS" en la pestaña de plugins disponibles e instalelo.
   * Vaya a "Administrar Jenkins" -> "Tools" (Herramientas).
   * Desplacese hasta "NodeJS installations" y añada una instalacion con el nombre "NodeJS_20" seleccionando la version NodeJS 20.x de la lista. Guarde los cambios.

5. Crear y ejecutar el Pipeline:
   * En la pagina de inicio de Jenkins, seleccione "Nueva Tarea" (New Item).
   * Ingrese el nombre "mediturno-app" y elija el tipo "Multibranch Pipeline".
   * En la seccion "Branch Sources", añada una fuente de tipo "Git" e ingrese la URL de su repositorio.
   * Guarde la configuracion. Jenkins escaneara las ramas del repositorio y ejecutara automaticamente el pipeline en la rama que contenga el archivo Jenkinsfile.

