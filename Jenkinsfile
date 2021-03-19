runBuild {
    stage('info') {
        sh('node -v');
    }

    stage ('install') {
        sh('yarn install --frozen-lockfile --non-interactive')
    }

    stage ('build') {
        sh('yarn run build')
    }

    stage('test') {
        sh('yarn run test --verbose --reporters=jest-junit')
        junit 'junit.xml'
    }

// Commenting out until I can figure out auth.
//    stage('publish') {
//         if(publish()) {
//               sh("npm version jenkins-${env.BUILD_NUMBER} --no-git-tag-version")
//               sh('npm publish --registry http://nexus:8081/repository/npm-hosted ')
//         }
//    }

}

void runBuild(Closure pipeline) {
    node('linux') {
        container('buildkit') {
            checkout(scm)

            pipeline()
        }
    }
}

boolean publish() {
  return env.BRANCH_NAME == 'master' || env.TAG_NAME
}
