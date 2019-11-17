const express = require('express');
const router = new express.Router();
const knex = require('../db/knex')

//serial communication
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
//const path = '';        //path for K64F board
//const port = new SerialPort(path, { baudRate: 256000 }, { autoOpen: false });
var buf = Buffer.alloc(23)

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
    
    port.on('open', function() {
        getByteStream(config);
        port.write(buf);
      })


});

function getByteStream (payload){
    let sync = 1, fn = 85;

    buf.writeUInt8(sync, 0);
    buf.writeUInt8(fn, 1);

    buf.writeUInt16BE(payload.mode.upper, 2);    //upper limit - rxdata[3:4]
    buf.writeUInt16BE(payload.mode.lower, 4);    //low limit - rxdata[5:6]
    
    if (payload.mode == "AOO"){
        buf.writeUInt8(1, 6);   //mode
        buf.writeUInt16BE(0, 7);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(0, 9);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload.mode.atrial_pw, 11);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 13);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(payload.mode.atrial_amp, 15) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(0, 19) ;        //ventricular amplitude - rxdata [20:23]
    }
    else if (payload.mode == "VOO"){
        buf.writeUInt8(2, 6);   //mode
        buf.writeUInt16BE(0, 7);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(0, 9);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload.mode.ventricular_pw, 11);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 13);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(0, 15) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(payload.mode.ventricular_amp, 19) ;        //ventricular amplitude - rxdata [20:23]
    }
    else if (payload.mode == "AAI") {
        buf.writeUInt8(2, 6);   //mode
        buf.writeUInt16BE(payload.mode.arp, 7);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(0, 9);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload.mode.atrial_pw, 11);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 13);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(payload.mode.atrial_amp, 15) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(0, 19) ;        //ventricular amplitude - rxdata [20:23]
    }
    else {   // VVI
        buf.writeUInt8(2, 6);   //mode
        buf.writeUInt16BE(0, 7);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(payload.mode.vrp, 9);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload.mode.ventricular_pw, 11);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 13);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(0, 15) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(payload.mode.ventricular_amp, 19) ;        //ventricular amplitude - rxdata [20:23]
    }
}


module.exports = router;