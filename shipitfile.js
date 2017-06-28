require('dotenv').config();

module.exports = function (shipit) {
    require('shipit-deploy')(shipit);
    let tmpDir = require('os').tmpdir();
    let currentTask;

    shipit.initConfig({
        default: {
            workspace: tmpDir + '/demo-app/workspace',
            deployTo: tmpDir + '/demo-app/server',
            repositoryUrl: 'git@github.com:scott-kennedy/demo-app.git',
            branch: 'master',
            ignores: ['.git', 'node_modules'],
            keepReleases: 5,
            deleteOnRollback: true,
            key: process.env.HOME + '/.ssh/' + process.env.SSH_KEY,
            shallowClone: true
        },
        staging: {
            servers: process.env.DEPLOY_USER + '@' + process.env.STAGING_SERVER,
            deployTo: '/srv/demo-app'
        },
        production: {}
    });

    shipit.blTask('installDependencies', function () {
        const releasePath = shipit.config.deployTo + '/releases/' + shipit.releaseDirname;
        return shipit.remote('cd ' + releasePath + ' && yarn');
    });

    shipit.blTask('buildApplication', function () {
        const releasePath = shipit.config.deployTo + '/releases/' + shipit.releaseDirname;
        return shipit.remote('cd ' + releasePath + ' && ng build --bh /foo/ --environment=' + shipit.environment);
    });
    
    shipit.on('deploy', function () {
        currentTask = 'deploy';
        shipit.log(':shipit: Beginning deployment to', shipit.config, ':shipit:');
    });

    shipit.on('fetched', function () {});
    shipit.on('updated', function () {
        shipit.start(['installDependencies', 'buildApplication']);
    });
    shipit.on('published', function () {
        // happens on deploy and rollback
    });

    shipit.on('cleaned', function () {
        // happens on deploy and rollback
    });

    shipit.on('deployed', function () {
        shipit.log(":partywizard: Deployment finished! :partywizard:");
    });

    shipit.on('rollback', function () {
        currentTask = 'rollback';
        shipit.log('Beginning rollback ', shipit.config);
    });
    shipit.on('rollbacked', function () {
        shipit.log('Rollback complete.');
    });
}