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
    }

    post {
        success {
            echo 'Netflix Cloud Docker image built successfully!'
        }

        failure {
            echo 'Netflix Cloud pipeline failed.'
        }
    }
}