'use strict';
let env4baas = process && process.env && process.env.NODE_ENV_BAAS;
let configFile = null;

switch (env4baas) {
    case 'production': {
        configFile = './env/prod.conf';
        break;
    }
    case 'uat': {
        configFile = './env/uat.conf';
        break;
    }
    case 'test': {
        configFile = './env/test.conf';
        break;
    }
    default: {
        configFile = './env/dev.conf';
        break;
    }
}
console.info(`Current configuration is [${configFile}]. NODE_ENV_BAAS=${env4baas}.`);

module.exports = require(configFile);
