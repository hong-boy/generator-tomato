'use strict';
'use strict';
const assert = require('power-assert');
const md5 = require('md5');
const supertest = require('supertest');
const superSession = require('supertest-session');
const app = require('../../../app.js');
var conf = require('../../../config/env.js');
// let server = app.listen(conf.port);
let agent = supertest.agent('http://localhost:3000/baasbs');

describe('app/controller/UserController.js', function () {
    beforeEach(function () {
        // this.server = server;
        // this.session = superSession(server);
        this.agent = agent;
    });

    // 获取登录页面
    // it('#login.html', function (done) {
    //     this.agent
    //         .get('/login')
    //         .set('Accept', 'text/html')
    //         .expect('Content-Type', 'text/html; charset=utf-8')
    //         .expect(res=>{
    //             assert.equal(res.res.statusCode, 200);
    //             assert(res.res.text);
    //         })
    //         .end(done);
    // });

    // 登录接口
    it('#signin()', function (done) {
        this.agent
            .post('/login')
            .set('X-Requested-With', 'Fetch')
            .set('Accept', 'application/json; charset=utf-8')
            .send({username: 'admin', password: md5('123')})
            .expect(function (res) {
                console.log(res.body);
                assert.equal(res.body.status, 200);
            })
            .end(done);
    });

});
