// passport config, using passport.js for user authentication and validation.
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = (passport) => {
    passport.use(new LocalStrategy (
        {usernameField : "email"},
        (email, password, done) => {
            User.findOne( {email: email} )
            .then(user => {
                if(!user) {
                    return done(null, false, {message: "That email is not registered."});
                }

                bcrypt.compare(password, user.password, (err, isMatched) => {
                    if(err) throw err;

                    if(isMatched) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: "password incorrect."});
                    }
                });
            })
            .catch(err => console.log(e));

        }
    ));
    passport.serializeUser( (user, done) => {
        done(null, user.id);
      });
      
    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    });
};