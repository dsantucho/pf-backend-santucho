const express = require('express');
const {Router} = express;

const router = new Router();

let users = [{
    username:'adminCoder@coder.com',
    password:'adminCod3r123',
    rol:'admin'
},
{
    username:'test@coder.com',
    password:'123456',
    rol:'user'
}] //luego conectar con db

//REGISTRO
router.post('/register', (req,res)=>{
    let newUser = req.body;
    newUser.id=Math.random();
    users.push(newUser);

    //redirect to login
    res.redirect('/login-view')
});

//LOGIN
router.post('/login', (req,res)=>{
    let newUser = req.body;
    let userFound = users.find(user =>{
        return user.username == newUser.username && user.password == newUser.password
    })
    if (userFound){
        req.session.user = newUser.username;
        req.session.password = newUser.password;

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
})
 

module.exports = router