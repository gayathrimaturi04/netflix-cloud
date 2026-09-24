stage('Build Docker Image') {
    steps {
        bat 'docker build --build-arg VITE_TMDB_API_KEY=%TMDB_API_KEY% -t netflix-cloud:latest .'
    }
}