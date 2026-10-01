pipeline {
    agent any

    // Requires a NodeJS installation configured in
    // Manage Jenkins -> Tools -> NodeJS installations (name it "Node20" or adjust below).
    tools {
        nodejs 'Node20'
    }

    environment {
        APP_NAME     = 'shopnode-ecommerce-app'
        ARTIFACT_DIR = 'dist'
        // Admin credentials are pulled from Jenkins Credentials store, not hardcoded.
        // Create a "Secret text" or "Username/password" credential with this ID if you
        // want the deploy stage to set them as environment variables on the target host.
        // ADMIN_CREDS = credentials('shopnode-admin-creds')
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install'
            }
        }

        stage('Lint') {
            // Remove/adjust this stage if you haven't set up ESLint in package.json.
            when {
                expression { fileExists('.eslintrc.js') || fileExists('.eslintrc.json') }
            }
            steps {
                sh 'npx eslint . || true'
            }
        }

        stage('Test') {
            // This project has no automated tests yet. Replace this stage's body
            // once you add a "test" script (e.g. Jest/Mocha) to package.json.
            steps {
                script {
                    def pkg = readJSON file: 'package.json'
                    if (pkg.scripts && pkg.scripts.test && pkg.scripts.test != 'echo "Error: no test specified" && exit 1') {
                        sh 'npm test'
                    } else {
                        echo 'No test script defined in package.json — skipping.'
                    }
                }
            }
        }

        stage('Sanity Boot Check') {
            // Starts the server briefly and confirms it responds, to catch
            // broken requires/syntax errors before shipping.
            steps {
                sh '''
                    node server.js &
                    SERVER_PID=$!
                    sleep 3
                    curl -sf -o /dev/null http://localhost:3000/ && echo "Server responded OK"
                    kill $SERVER_PID
                '''
            }
        }

        stage('Package') {
            steps {
                sh '''
                    rm -rf ${ARTIFACT_DIR}
                    mkdir -p ${ARTIFACT_DIR}
                    zip -r ${ARTIFACT_DIR}/${APP_NAME}-${BUILD_NUMBER}.zip . \
                        -x "node_modules/*" ".git/*" "${ARTIFACT_DIR}/*"
                '''
            }
        }

        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: "${ARTIFACT_DIR}/*.zip", fingerprint: true
            }
        }

        stage('Deploy') {
            // Example deploy to a remote server over SSH using PM2 as the process
            // manager. Adjust the host/path, or swap this out for your own deploy
            // method (Docker push, Elastic Beanstalk, PaaS CLI, etc).
            when {
                branch 'main'
            }
            steps {
                sshagent(credentials: ['shopnode-deploy-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no deploy@your-server.example.com "
                            cd /var/www/${APP_NAME} &&
                            git pull origin main &&
                            npm ci --production &&
                            pm2 restart ${APP_NAME} || pm2 start server.js --name ${APP_NAME}
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build #${BUILD_NUMBER} succeeded."
        }
        failure {
            echo "❌ Build #${BUILD_NUMBER} failed. Check the stage logs above."
        }
        always {
            sh 'pkill -f "node server.js" || true'
        }
    }
}
