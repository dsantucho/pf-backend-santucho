const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const github = require('passport-github2')
const userModel = require('../models/db/models/user.model');
const { createHash, isValidatePassword } = require('../utils/bcrypts');
const Cart = require ('../services/Carts');

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req, email, password, done) => {
            try {
                let newData = req.body;
                let newCart = new Cart();
                let user = await userModel.findOne({ email: email });
                if (user) {
                    done('Error, usuario ya existe', false)
                }
                let newUser = {
                    first_name: newData.first_name,
                    last_name: newData.last_name,
                    email: email, // Utilizamos el email proporcionado en la estrategia
                    age: newData.age,
                    password: createHash(password), // Usamos la contraseña proporcionada en la estrategia
                    cart: await newCart.createCart(),
                    role: newData.role
                }
                let result = await userModel.create(newUser);
                done(null, result);
                console.log('result: ', result);
            } catch (err) {
                done('Error al crear el usuario' + err);
            }
        }
    ));
    
    passport.use('login', new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
            console.log('entro al passport')
            try {
                let user = await userModel.findOne({ email: email });
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
                    let newCart = new Cart();
                    user = await userModel.create({
                        username: login,
                        cart: await newCart.createCart(),
                        //password: createHash(newData.password),
                        rol: type,
                        github: profile,
                        
                    })

                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ))

    passport.serializeUser((usuario, done) => {
        done(null, usuario)
    })

    passport.deserializeUser((usuario, done) => {
        done(null, usuario)
    })
}
module.exports = initializePassport