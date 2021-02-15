const http = require('http');

const jenkinsHost = '127.0.0.1';
const jenkinsPort = 8080;
const jenkinsBuildName = process.env.jenkinsBuildName;
const jenkinsBaseJobPath = '/job/' + jenkinsBuildName;
const jenkinsUserPwd = process.env.jenkinsUserPwd;

function restartViaJenkins() {
    const options = {
        method: 'POST',
        auth: jenkinsUserPwd,
        host: jenkinsHost,
        port: jenkinsPort,
        path: jenkinsBaseJobPath + '/build'
    };

    return new Promise((resolve) => {
        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });
        });
        req.end();
    });
}

function getBuildQueueInfo() {
    const options = {
        method: 'GET',
        auth: jenkinsUserPwd,
        host: jenkinsHost,
        port: jenkinsPort,
        path: jenkinsBaseJobPath + '/api/json'
    };

    return new Promise((resolve) => {
        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
        req.end();
    });
}

function isNotAlreadyQueued() {
    return new Promise((resolve) => {
        getBuildQueueInfo().then((info) => {
            const lastBuildNumber = info.lastBuild.number;

            resolve(info.lastCompletedBuild.number === lastBuildNumber);
        });
    });
}

function checkRequirements() {
    let ok = true;

    if (!jenkinsBuildName) {
        console.error('jenkinsBuildName missing');
        ok = false;
    }

    if (!jenkinsUserPwd) {
        console.error('jenkinsUserPwd missing');
        ok = false;
    }

    if (!ok) {
        process.exit(1);
    }
}

function checkAndTryToRestart() {
    checkRequirements();
    isNotAlreadyQueued().then((ok) => {
        if (ok) {
            console.log('Restarting');

            restartViaJenkins().then(() => {
                console.log('Restart scheduled');
            });
        } else {
            console.log('Already queued, not restarting');
        }
    })
}

process.argv.forEach(function (val, index, array) {
    if (val === '--restart') {
        checkAndTryToRestart();
    } else if (val === '--test') {
        checkRequirements();
    }
});
