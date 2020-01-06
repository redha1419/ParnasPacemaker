const express = require('express');
const router = new express.Router();
const knex = require('../db/knex');
const SerialPort = require('serialport');

//the login route
router.post('/login', function(req, res) {
    //grab credentials from request
    let username = req.body.username;
    let password = req.body.password;

    //query db with username and password 
    knex('users')
    .where({username, password})
    .first()
    .then((user)=>{ //if we find user then success
        if(user){
            res.status(200).json({message: "succesfully logged in", auth: true})
        }
        else{
            res.status(403).json({message: "user not found", auth: false})
        }
    })
    .catch(err=>{ //catch err
        console.log(err);
        res.status(500).json(err);
    })
    
});

//the sign up route
router.post('/signup', function(req, res) {
    //grab credentials from request
    let username = req.body.username;
    let password = req.body.password;

        //make sure the credentials
        if(username.length < 1|| password.length < 1 ){
            res.status(200).json({message:"Please enter a username/password", auth: false});
            return
        }

    //before we do anything lets see if there is a pacemaker plugged in
    let device = '';
    SerialPort.list().then(devices=>{
        for(let i=0; i< devices.length; i++){
            if(devices[i].manufacturer === 'SEGGER'){
                //found devices
                device = devices[i].serialNumber;
            }
        }
        console.log(device)
        if(device === ''){
            res.status(200).json({message: "No pacemaker found", auth: false});
            return
        }

        //default configurations for new users
        let config = {
            pacemaker_id: device, //we grab a random id for now, in the future we will grab serially
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
            },
            DOO:{
                upper:"",
                lower:"",
                atrial_amp:"",
                atrail_pw:"",
                arp:""
            }
        }



        knex('users') //query db to makre sure only 10 users
        .select('*')
        .then(users=>{
            if(users.length < 10){ //if less than 10 add a new user
                knex('users')
                .insert({username, password, config})
                .then(()=>{
                    res.status(200).json({message: "succesfully signed up", auth: true})
                })
                .catch(err=>{
                    if(err.code === '23505'){ //if we see this then the username is not unique
                        res.status(200).json({message:"Username already taken", auth: false});
                    }else{
                        console.log(err);
                        res.status(500).json({err, auth: false});
                    }

                })
            }
            else{
                console.log("more than 10 users already signed up"); //give back error message when more than 10 users
                res.status(200).json({message: "more than 10 users already signed up", auth: false});
            }
        });
    });
});

//retrieve user config given username
router.post('/getConfig', function(req,res){
    //grab credentials from request body
    let username = req.body.username;
    //already authenticated if can click this button!

    knex('users')
    .where('username', username) //retrive user object from database
    .first()
    .then(user=>{

        let device = '';
        SerialPort.list().then(devices=>{
            for(let i=0; i< devices.length; i++){
                if(devices[i].manufacturer === 'SEGGER'){
                    //found devices
                    device = devices[i].serialNumber;
                }
            }
            console.log(device)
            if(device === ''){
                res.status(200).json({config: user.config, device:'X'});
                return
            }
            else{
                res.status(200).json({config: user.config, device});
            }
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({err});
    });
});

module.exports = router;
