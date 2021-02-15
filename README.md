# docker-jenkins-recovery-example

An example project on recovering a website after failing a healthcheck.

## crontab -e
`* * * * * /home/mydockeruser/scripts/watchdog-cron.sh`

## Requirements
* Curl
* Nodejs
* Jenkins with its API available through `127.0.0.1:8080`
* Environment variables for
  - jenkinsBuildName - this should be an url-escaped version of the Jenkins project name to queue (eg. `My%20Website%20-%20API`)
  - jenkinsUserPwd - this should be a basic-auth user:userapitoken combination (eg. `admin:12ab34cd56ef78gh`)
  - You can create an API token by logging in to Jenkins and go to your account's configuration page and click Add new token under API Token.
