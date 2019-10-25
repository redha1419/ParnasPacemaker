const express = require('express');
const router = new express.Router();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const knex = require('../db/knex')


router.get('/pacing_mode', function(req, res){

    const port = new SerialPort(path, { baudRate: 256000 });
    const parser = new Readline();
    port.pipe(parser);
    parser.on('data', line => console.log(`> ${line}`));
    port.write('ROBOT POWER ON\n');

});

router.post('/pace', function(req, res){
    let mode = req.body.mode;
    let username = req.body.username;
    let config = req.body.config;
    knex('users')
    .where({username})
    .first()
    .then((user)=>{
        //grab the json
        //update preference
        user.config[mode] =  config;
        knex('users')
        .update('config', user.config)
        .where({username})
        .then(()=>{
            res.status(200).json({message: "succesfully saved configs for " + mode})
        })
    })
    .catch(err =>{
        res.status(500).json({err, message: "failed to saved configs for " + mode})
    })
});


module.exports = router;