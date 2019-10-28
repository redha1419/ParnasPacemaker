const express = require('express');
const router = new express.Router();
const knex = require('../db/knex')

router.post('/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    knex('users')
    .where({username, password})
    .first()
    .then((user)=>{
        if(user){
            res.status(200).json({message: "succesfully logged in", auth: true})
        }
        else{
            res.status(403).json({message: "user not found",auth: false})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
    
});

router.post('/signup', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if(username.length < 1|| password.length < 1 ){
        res.status(200).json({message:"Please enter a username/passwrod", auth: false});
    }
    let config = {
        pacemaker_id: Math.floor((Math.random() * 100000000) + 1),
        VOO: {
            upper:"",
            lower:"",
            ventricular_amp:"",
            ventricular_pw:""
        },
        AOO:{
            upper:"",
            lower:"",
            atrial_amp:"",
            atrail_pw:""
        },
        VVI:{
            upper:"",
            lower:"",
            ventricular_amp:"",
            ventricular_pw:"",
            vrp: ""
        },
        AAI:{
            upper:"",
            lower:"",
            atrial_amp:"",
            atrail_pw:"",
            arp:""
        }
    }



    knex('users')
    .select('*')
    .then(users=>{
        if(users.length < 10){
            knex('users')
            .insert({username, password, config})
            .then(()=>{
                res.status(200).json({message: "succesfully signed up", auth: true})
            })
            .catch(err=>{
                if(err.code === '23505'){
                    res.status(200).json({message:"Username already taken", auth: false});
                }else{
                    console.log(err);
                    res.status(500).json({err, auth: false});
                }

            })
        }
        else{
            console.log("more than 10 users already signed up");
            res.status(200).json({message: "more than 10 users already signed up", auth: false});
        }
    });
});

router.post('/getConfig', function(req,res){
    let username = req.body.username;
    console.log(req.body)
    //already authenticated if can click this button!
    knex('users')
    .where('username', username)
    .first()
    .then(user=>{
        res.status(200).json({config: user.config});
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err});
    });
});

module.exports = router;
