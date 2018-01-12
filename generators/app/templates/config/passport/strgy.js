let guest = require('./guest.strgy');
let local = require('./local.strgy');
const passport = require('koa-passport');
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//注册策略
passport.use(guest);
passport.use(local);
