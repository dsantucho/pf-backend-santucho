const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const github = require('passport-github2')
const userModel = require('../dao/db/models/user.model');
const { createHash, isValidatePassword } = require('../utils/bcrypts')

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { usernameField: 'username', passReqToCallback: true },
        async (req, username, password, done) => {
            try {
                let newData = req.body;
                let user = await userModel.findOne({ username: newData.username });
                if (user) {
                    done('Error, usuario ya existe', false)
                }
                let newUser = {
                    username: newData.username,
                    password: createHash(newData.password),
                    rol: newData.rol
                }
                let result = await userModel.create(newUser);
                done(null, result)
                console.log('result: ', result)
            } catch (err) { done('Error al crear el usuario' + err) }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'username', passwordField: 'password' },
        async (username, password, done) => {
            try {
                let user = await userModel.findOne({ username: username });
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                if (!isValidatePassword(user, password)) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.use('github', new github.Strategy(
        {
            clientID: "Iv1.6f63f75dca38a45a",
            clientSecret: "5ffa1794537db2a5362eaa9cf5b25ad0e9fbf6fd",
            callbackURL: "http://localhost:8080/auth/callbackGithub"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let {login, name, type} = profile._json;
                let user = await userModel.findOne({ username: login });
                if(!user){
                    //registro
                    user = await userModel.create({
                        username: login,
                        //password: createHash(newData.password),
                        rol: type,
                        github: profile
                    })

                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ))

    /*     passport.serializeUser((user, done) => {
            done(null, user.id);
        });
    
        passport.deserializeUser(async (id, done) => {
            try {
                const user = await userModel.findById(id);
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }); */
    // si usamos sessions 
    passport.serializeUser((usuario, done) => {
        done(null, usuario)
    })

    passport.deserializeUser((usuario, done) => {
        done(null, usuario)
    })
}
module.exports = initializePassport