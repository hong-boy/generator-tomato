'use strict';
const fs = require('fs-extra');
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-tomato', function () {
    beforeEach(function () {
        // The object returned acts like a promise, so return it to wait until the process is done
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({appname: 'demo', apppath: 'test', install: false}); // Mock the prompt answers
    });

    it('should exist file', function () {
        assert.file([
            'package.json',
            'pm2.json',
            'config/env/base.conf.js',
            'views/index.html'
        ]);
    });
    it('shouldn\'t exist file', function () {
        assert.noFile([
            '.package.json.mustache',
            '.pm2.json.mustache',
            'config/env/.base.conf.js.mustache',
            'views/.index.html.mustache'
        ]);
    });
    it('should contain ["name":"demo"] in package.json', function () {
        assert.fileContent([
            ['package.json', /"name"\s*:\s*"demo"/]
        ]);
    });
});
