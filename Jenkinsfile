pipeline {
    agent any

    environment {
        TMDB_API_KEY = credentials('tmdb-api-key')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build React App') {
            steps {
                bat 'set VITE_TMDB_API_KEY=%TMDB_API_KEY% && npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build --build-arg VITE_TMDB_API_KEY=%TMDB_API_KEY% -t netflix-cloud:latest .'
            }
        }

        stage('Docker Test') {
            steps {
                bat 'docker --version'
                bat 'docker images'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker stop netflix-cloud || exit /b 0'
                bat 'docker rm netflix-cloud || exit /b 0'
                bat 'docker run -d --name netflix-cloud -p 8081:80 netflix-cloud:latest'
            }
        }
    }

    post {
        success {
            echo 'Netflix Cloud CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Netflix Cloud CI/CD pipeline failed.'
        }
    }
}