pipeline {
    agent any

    tools {
        nodejs 'NodeJS_20'
    }

    environment {
        BACKEND_DIR = 'src/backend'
        FRONTEND_DIR = 'src/frontend'
        JWT_SECRET = 'secreto-exclusivo-para-integracion-continua'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'npm test'
                }
            }
        }

        stage('Validate Frontend') {
            steps {
                sh '''
                test -f src/frontend/index.html
                test -f src/frontend/login.html
                test -f src/frontend/register.html
                test -f src/frontend/appointments.html
                test -f src/frontend/appointments.js
                test -f src/frontend/appointments.css
                test -f src/frontend/styles.css
                echo "Archivos principales del frontend verificados correctamente"
                '''
            }
        }

        stage('Package Simulation') {
            steps {
                sh '''
                rm -rf src/backend/public
                mkdir -p src/backend/public
                cp -R src/frontend/* src/backend/public/
                cd src/backend
                npm prune --omit=dev
                echo "Paquete preparado para producción localmente"
                '''
            }
        }
    }

    post {
        success {
            echo '¡Pipeline finalizado correctamente en local!'
        }
        failure {
            echo 'El pipeline falló. Revisa los logs.'
        }
        always {
            cleanWs()
        }
    }
}
