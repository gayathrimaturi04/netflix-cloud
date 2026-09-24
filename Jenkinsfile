pipeline {
    agent any

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
                bat 'npm run build'
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
            echo 'Netflix Cloud React build and Docker test completed successfully!'
        }

        failure {
            echo 'Netflix Cloud pipeline failed.'
        }
    }
}