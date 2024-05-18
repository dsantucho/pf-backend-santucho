const express = require('express');
const { Router } = express;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createHash, isValidatePassword } = require('../utils/bcrypts');
const passport = require('passport');
const userModel = require('../modules/user.model');
const transporter = require('../config/email/mailing');

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

// Nueva ruta para olvidó contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).render('forgotPassword', { message: 'Usuario no encontrado' });
    }

    // Generar y almacenar el token de restablecimiento
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

    await user.save();

    const resetLink = `http://${req.headers.host}/auth/reset-password/${token}`;

    // Configurar el correo
    const mailOptions = {
        to: user.email,
        from: 'soledadsantucho@gmail.com',
        subject: 'Restablecimiento de contraseña',
        text: `Recibiste este correo porque tú (u otra persona) solicitó restablecer la contraseña de tu cuenta.\n\n
        Haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n
        ${resetLink}\n\n
        Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.\n`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.render('forgotPassword', { message: 'Revise su email para restablecer la contraseña', disableEmailInput: true });
    } catch (error) {
        console.error('Error enviando el correo:', error);
        res.status(500).render('forgotPassword', { message: 'Error enviando el correo' });
    }
});

// Ruta para manejar el formulario de restablecimiento de contraseña
router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        return res.render('forgotPassword', { message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado' });
    }

    res.render('resetPassword', { token });
});

// Ruta para manejar el restablecimiento de contraseña
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        return res.render('forgotPassword', { message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado' });
    }

    if (isValidatePassword(user, password)) {
        return res.render('resetPassword', { token, message: 'No puedes usar la misma contraseña que antes' });
    }

    user.password = createHash(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.redirect('/login-view');
});
module.exports = router;







router.get('/users', async (req,res)=>{
    let allusers = await userModel.find()
    res.send(allusers);
})



module.exports = router