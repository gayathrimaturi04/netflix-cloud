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

        stage('Docker Test') {
            steps {
                bat 'docker --version'
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Netflix Cloud CI pipeline completed successfully!'
        }

        failure {
            echo 'Netflix Cloud CI pipeline failed.'
        }
    }
}