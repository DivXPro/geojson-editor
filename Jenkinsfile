pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: env.GIT_BUILD_REF]], 
                                            userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]])
      }
    }
    stage('构建') {
      steps {
        echo '构建中...'
        sh 'docker version'
        echo '构建完成.'
        script {
          def exists = fileExists 'README.md'
          if (!exists) {
            writeFile(file: 'README.md', text: 'Helloworld')
          }
        }

        archiveArtifacts(artifacts: 'README.md', fingerprint: true)
      }
    }
  }
}