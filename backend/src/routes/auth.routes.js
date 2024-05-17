const express = require('express');
const { Router } = express;
const bcrypt = require('bcrypt');
const { createHash, isValidatePassword } = require('../utils/bcrypts');
const passport = require('passport');
const userModel = require('../modules/user.model');

const router = new Router();


router.post('/register',
    passport.authenticate('register', { failureRedirect: '/error' }),
    function (req, res) {
        res.redirect('/login-view')
    });
router.get('/error', (req, res) => {
    res.send('error registro user');
})
router.post('/login',
    passport.authenticate('login', { failureRedirect: '/error' }),
    (req, res) => {
        req.session.usuario=req.user
        res.redirect(`/products`);
    });

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.send('error en logout')
    })
    res.redirect('/login-view')
});

router.get('/github', passport.authenticate("github", {}), (req,res)=>{})

router.get('/callbackGithub', passport.authenticate("github", {}), (req,res)=>{

    req.session.usuario=req.user

    //res.setHeader('Content-Type','application/json');
    //res.status(200).json({payload:req.user});
    return res.redirect(`/products?email=${req.user.email}&rol=${req.user.rol}`);
})
// ** RECUPER CONTRASENA **

// Ruta para solicitar el restablecimiento de contraseña
router.get('/forgot-password', (req, res) => {
    // Aquí renderiza la vista donde el usuario puede ingresar su correo electrónico
    res.render('forgotPassword');
});

// Ruta para manejar la solicitud de restablecimiento de contraseña
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Aquí deberías enviar el correo electrónico con el enlace de restablecimiento de contraseña
        // y manejar la lógica para generar y almacenar el token de restablecimiento en la base de datos

        res.render('passwordResetSent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// Ruta para restablecer la contraseña
router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    // Aquí deberías verificar si el token es válido y renderizar la vista de restablecimiento de contraseña
    res.render('resetPassword', { token });
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const { password } = req.body;

        // Aquí deberías verificar si el token es válido y actualizar la contraseña del usuario en la base de datos

        res.render('passwordResetSuccess');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

module.exports = router;







router.get('/users', async (req,res)=>{
    let allusers = await userModel.find()
    res.send(allusers);
})



module.exports = router