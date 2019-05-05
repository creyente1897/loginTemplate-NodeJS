const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//User Model
const User = require('../models/User');

// Login Page
router.get('/login', (req,res) => {
    res.render("login");
});

// Register Page
router.get('/register', (req,res) => {
    res.render("register");
});

// POST Handle for Register
router.post('/register', (req,res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({ log: 'Please fill all the fields'});
    }

    //Check Password Match
    if(password !== password2){
        errors.push({ log: 'Passwords do not match'});
    }

    //Check Password Length
    if(password < 6){
        errors.push({log: 'Password should be at least 6 characters'});
    }

    //Check Error or Success
    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Registration Successful
        User.findOne({ email:email })
        .then(user => {
            if(user){
                //User Exists
                errors.push({log: 'Email Taken'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        //Set Password
                        newUser.password = hash;
                        //Save User
                        newUser.save()
                        .then(user => {
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err))
                    });
                });
            }
        });
    }
});


router.get('/logout', (req,res) => {
    res.send("Logout");
});

module.exports = router;