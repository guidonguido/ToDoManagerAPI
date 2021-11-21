'use strict';

var utils = require('../utils/writer.js');
var User = require("../service/UserService");
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login

// Login params
var jwtSecret = 'uA2EoqHgylP9LAFNK1uXCb-YS7cmBtBxW8oxJzc1Y32QsYtR7ecgxdTRW6nR9zME';
const expireTime = 1200; //seconds



/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.getUserByEmail(email)
      .then((user) => {
        console.log("Login user found", user, password);
        if (!user)
          return done(null, false, { message: 'Invalid email' });

        if( bcrypt.compareSync(password, user.hash ) ){
          return done(null, user, true)
        }
        else{
          new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() =>  { 
            console.log("Wrong psw")
            return done(null, false, { message: 'Wrong password' }) })
        }
    }).catch(err => done(err));
  }   
));

module.exports.authenticateUser = function authenticateUser (req, res, next) {
  if(req.query.type == "login"){
    passport.authenticate('local', {session: false},  (err, user, info) => {
      if (err)
          return next(err);
      if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
      }
      // if success, perform the login
      req.login(user, {session: false}, (err) => {
        if (err)
          return next(err);
  
        const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, { expiresIn: '20m' });
        res.cookie('JWT.token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
        return res.json({ id: user.id, name: user.name });
      });
    })(req, res, next);
  }
  
  else if(req.query.type == "logout"){
    req.logout();
    res.clearCookie('JWT.token').end();
  }

  else{
    utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': "Query param value must be either 'login' or 'logout'" }],}, 400);
  }

};
