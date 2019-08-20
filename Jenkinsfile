pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: env.GIT_BUILD_REF]],userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]])
      }
    }
    stage('构建') {
      agent {
        label 'node'
      }
      steps {
        echo '构建中...'
        sh 'npm install'
        sh 'npm run build'
        echo '构建完成.'
      }
    }
    stage('打包镜像') {
      steps {
        echo '打包中...'
        sh "docker build -t ${env.DOCKER_REPO_NAME}:${env.GIT_BUILD_REF} -t ${env.DOCKER_REPO_NAME}:latest ."
        echo '打包完成'
      }
    }
    stage('上传镜像到仓库') {
      steps {
        sh "docker login -u ${env.DOCKER_REPO_USER} -p ${env.DOCKER_REPO_PASSWORD} ${env.DOCKER_REPO_DOMAIN}"
        sh "docker tag ${env.DOCKER_REPO_NAME}:${env.GIT_BUILD_REF} ${env.DOCKER_REPO_DOMAIN}/${env.DOCKER_REPO_NAMESPACE}/${env.DOCKER_REPO_NAME}:${env.GIT_BUILD_REF}"
        sh "docker tag ${env.DOCKER_REPO_NAME}:${env.GIT_BUILD_REF} ${env.DOCKER_REPO_DOMAIN}/${env.DOCKER_REPO_NAMESPACE}/${env.DOCKER_REPO_NAME}:latest"
        sh "docker push ${env.DOCKER_REPO_DOMAIN}/${env.DOCKER_REPO_NAMESPACE}/${env.DOCKER_REPO_NAME}:${env.GIT_BUILD_REF}"
        sh "docker push ${env.DOCKER_REPO_DOMAIN}/${env.DOCKER_REPO_NAMESPACE}/${env.DOCKER_REPO_NAME}:latest"
      }
    }
  }
}