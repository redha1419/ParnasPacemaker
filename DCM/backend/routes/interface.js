const express = require('express');
const router = new express.Router();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const knex = require('../db/knex')

/*
router.get('/pacing_mode', function(req, res){

    const port = new SerialPort(path, { baudRate: 256000 });
    const parser = new Readline();
    port.pipe(parser);
    parser.on('data', line => console.log(`> ${line}`));
    port.write('ROBOT POWER ON\n');

});
*/

//setting the pace mode
router.post('/pace', function(req, res){
    //grab credentials from request
    let mode = req.body.mode;
    let username = req.body.username;
    let config = req.body.config;


    knex('users') //query db and retrieve user
    .where({username})
    .first()
    .then((user)=>{
        //grab the json
        //update preference
        user.config[mode] =  config; //update user config
        knex('users')
        .update('config', user.config) //set our new config
        .where({username})
        .then(()=>{
            res.status(200).json({message: "succesfully saved configs for " + mode})
        })
    })
    .catch(err =>{
        res.status(500).json({err, message: "failed to saved configs for " + mode}) //give back error for any reason
    })
});


module.exports = router;