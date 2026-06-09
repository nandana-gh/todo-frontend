pipeline {
    agent any

    environment {
        // Defines the Docker image name
        IMAGE_NAME = 'todo-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the Git repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm ci'
            }
        }

        stage('Build Angular App') {
            steps {
                echo 'Building Angular application for production...'
                bat 'npx ng build --configuration production'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    // Build the Docker image using the Dockerfile in the current directory
                    def customImage = docker.build("${IMAGE_NAME}:${env.BUILD_ID}")
                }
            }
        }

        // Optional: Add a stage to push to a Docker Registry (like Docker Hub or AWS ECR)
        /*
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials-id') {
                        def customImage = docker.image("${IMAGE_NAME}:${env.BUILD_ID}")
                        customImage.push()
                        customImage.push('latest')
                    }
                }
            }
        }
        */
    }

    post {
        always {
            echo 'Pipeline finished!'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed. Please check the logs.'
        }
    }
}
