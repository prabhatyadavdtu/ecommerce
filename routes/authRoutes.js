const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/register', (req,res)=>{
    res.render('auth/Signup');
})

// router.get('/testUser', async(req,res)=>{
//     const user = new User({username : 'dbt', email: 'dbt@gmail.com'});
    
//     const newUser = await User.register(user, 'dbt@gmail.com');
//     res.send(newUser);
// })

//register a new user

router.post('/register', async(req,res)=>{
    const{username, email, password} = req.body;
    const user = new User({username, email});
    const newUser = await User.register(user, password);
    req.flash("success", "User registered successfully");
    res.redirect('/login');

})

router.get('/login', (req,res)=>{
    res.render('auth/Login');
})

router.post('/login',
    passport.authenticate('local', {
        failureRedirect : '/login',
        failureFlash : true,
        failureMessage : true
    }),
    function(req,res){
        req.flash('success', `welcome back user ${req.user.username}`);
        res.redirect('/products');
    }
)

router.get('/logout', (req,res)=>{
    req.logOut((err)=>{
        if(err){return next(err)};
        req.flash("success", 'Good bye see you again!');
        res.redirect('/login');
    })    
})






module.exports = router;