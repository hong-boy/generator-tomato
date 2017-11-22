'use strict';
'use strict';
const assert = require('power-assert');
const md5 = require('md5');
const supertest = require('supertest');
const superSession = require('supertest-session');
var conf = require('../../../config/env.js');
let agent = superSession(conf.agent);

describe('app/controller/UserController.js', function () {
    before(function () {
        this.agent = agent;
    });

    it('#login.html', function (done) {
        this.agent
            .get('/login')
            .set('Accept', 'text/html')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(res => {
                assert.equal(res.res.statusCode, 200);
                assert(res.res.text);
            })
            .end(done);
    });

    it('#captcha()', function (done) {
        this.agent
            .get('/login/captcha')
            .set('Accept', 'image/svg+xml')
            .expect('Content-Type', 'image/svg+xml')
            .expect(res => {
                assert.equal(res.status, 200)
            })
            .end(done);
    });

    it('#signin()', function (done) {
        this.agent
            .post('/login')
            .set('X-Requested-With', 'Fetch')
            .set('Accept', 'application/json; charset=utf-8')
            .send({username: conf.user.name, password: conf.user.pwd})
            .expect(function (res) {
                console.log(res.body);
                assert.equal(res.body.status, 200);
            })
            .end(done);
    });

    it('#getInfo()', function (done) {
        this.agent
            .post('/index/user')
            .set('X-Requested-With', 'Fetch')
            .set('Accept', 'application/json; charset=utf-8')
            .expect(function (res) {
                console.log(res.body);
                assert.equal(res.body.status, 200);
            })
            .end(done);

    });

    it('#sigout()', function (done) {
        this.agent
            .post('/logout')
            .set('X-Requested-With', 'Fetch')
            .set('Accept', 'application/json; charset=utf-8')
            .expect(function (res) {
                console.log(res.body);
                assert.equal(res.body.status, 200);
            })
            .end(done);
    });

});
