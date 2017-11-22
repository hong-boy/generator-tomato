'use strict';
const assert = require('power-assert');
const fs = require('fs');
const Restify = require('../../../app/util/Restify.js');

// 后端webservice地址http://localhost:8088/web
describe('app/util/Restify.js', function () {
    beforeEach(function () {
        this.restify = new Restify();
    });

    // get
    it('#get()', async function () {
        let restify = this.restify;
        restify.setPath('/echo/somebody?age=22');
        restify.addHeader('X-custom-field', 'test-header');
        try {
            let ret = await restify.get();
            assert.ok(ret);
        } catch (e) {
            assert.ifError(e);
        }
    });

    // post
    it('#post()', async function () {
        let restify = this.restify;
        restify.setPath('/echo/somebody');
        restify.addHeader('X-custom-field', 'test-header');
        restify.setBody({age: 22, gender: 'male', hobbits: ['eat', 'eat']});
        try {
            assert(await restify.post());
        } catch (e) {
            assert.ifError(e);
        }
    });

    // put
    it('#put()', async function () {
        let restify = this.restify;
        restify.setPath('/echo/somebody');
        restify.addHeader('X-custom-field', 'test-header');
        try {
            assert(await restify.put({age: 22, gender: 'male', hobbits: ['eat', 'eat']}));
        } catch (e) {
            assert.ifError(e);
        }
    });

    // delete
    it('#del()', async function () {
        let restify = this.restify;
        restify.setPath('/echo/somebody');
        restify.addHeader('X-custom-field', 'test-header');
        try {
            assert(await restify.del({age: 22, gender: 'male', hobbits: ['eat', 'eat']}));
        } catch (e) {
            assert.ifError(e);
        }
    });

    // 文件上传
    it('#upload()', async function () {
        let restify = this.restify;
        restify.setPath('/file').addHeader('X-custom-field', 'test-header');
        restify.setBody({
            my_field: 'my_value',
            my_file: fs.createReadStream('./Store.test.js'),
        });
        try {
            assert(await restify.upload());
        } catch (e) {
            assert.ifError(e);
        }
    });

});
