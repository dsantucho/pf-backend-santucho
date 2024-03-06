const express = require('express');
const { Router } = express;
const bcrypt = require('bcrypt');
const { createHash, isValidatePassword } = require('../utils/bcrypts');
const passport = require('passport');

const router = new Router();

let users = [{
    username: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    rol: 'admin'
},
{
    username: 'test@coder.com',
    password: '123456',
    rol: 'user'
}] //luego conectar con db

//REGISTRO
/* router.post('/register', (req,res)=>{
    let newUser=req.body;
    newUser.password = createHash(newUser.password);
    newUser.id=Math.random();
    users.push(newUser);
    //redirect to login
    res.redirect('/login-view')
}); */

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
        console.log(req.session)
        res.redirect(`/products?username=${req.user.username}&rol=${req.user.rol}`);
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
    return res.redirect(`/products?username=${req.user.username}&rol=${req.user.rol}`);
})


//LOGIN
/* router.post('/login', (req,res)=>{
    let passwordBcrytp = {};
    //let newUserName = req.body.username;
    //let passwordReq = req.body.password;
    console.log('newUser: ',req.body.username, 'pass: ', req.body.password)
    let userFound = users.find(user =>{
        let compare = isValidatePassword(user, req.body.password);
        console.log('compare = ', compare)
        if(user.username == req.body.username && compare == true){
            passwordBcrytp = user.password;
            return true
        }
    })
    console.log('userFound = ',userFound)
    if (userFound){
        req.session.user = req.body.username;
        req.session.password = passwordBcrytp;

        //res.redirect('/profile-view');
        //res.redirect('/products');
        res.redirect(`/products?username=${userFound.username}&rol=${userFound.rol}`)
        return console.log(req.session)
    }
    res.send ("usuario o contraseña incorrectos")
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) res.send('error en logout')
    })
    res.redirect('/login-view')
})

router.get('/users', (req,res)=>{
    res.send(users);
}) */


module.exports = router