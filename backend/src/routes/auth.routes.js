const express = require('express');
const { Router } = express;
const bcrypt = require('bcrypt');
const { createHash, isValidatePassword } = require('../utils/bcrypts');
const passport = require('passport');
const userModel = require('../models/db/models/user.model');

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
        console.log(req.user.email)
        res.redirect(`/products?email=${req.user.email}&role=${req.user.role}`);
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
router.get('/users', async (req,res)=>{
    let allusers = await userModel.find()
    res.send(allusers);
})



module.exports = router