const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../dao/db/models/user.model');
const { createHash, isValidatePassword } = require('../utils/bcrypts')

const initializePassport = () =>{
    passport.use('register', new LocalStrategy(
        {usernameField:'username', passReqToCallback:true},
        async(req, username, password, done)=>{
            try{
                let newData=req.body;
                let user = await userModel.findOne({ username: newData.username});
                if(user){
                    done('Error, usuario ya existe', false)
                }
                let newUser = {
                    username: newData.username,
                    password: createHash(newData.password),
                    rol:newData.rol
                }
                let result = await userModel.create(newUser);
                done(null, result)
                console.log('result: ',result)
            }catch(err){done('Error al crear el usuario' + err)}
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

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser(async (id, done) => {
        try {
          const user = await userModel.findById(id);
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      });
}
module.exports = initializePassport