const express = require('express');
const router = new express.Router();
const knex = require('../db/knex')

//serial communication
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const path = '/dev/tty.usbmodem0000001234561';        //path for K64F board
const port = new SerialPort(path, { baudRate: 256000 });
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
            console.log("HERE 1")
                
            /* port.on('open', function() {
                console.log("HERE 2")
                getByteStream(user.config);
                console.log(buf)
                port.write(buf);
            }) */
            getByteStream(user.config);
            //set bytes
            port.write(buf,function (err) {
                if (err) {
                  return console.log('Error opening port: ', err.message)
                }
              
                // Because there's no callback to write, write errors will be emitted on the port:
                console.log(buf);
              })
            res.status(200).json({message: "succesfully saved configs for " + mode})
        })
    })
    .catch(err =>{
        res.status(500).json({err, message: "failed to saved configs for " + mode}) //give back error for any reason
    })

});

function getByteStream (payload, mode){
    let sync = 22, fn = 85;

    buf.writeUInt8(sync, 0);        //rxdata[0]
    buf.writeUInt8(fn, 1);          //rxdata[1]

    buf.writeUInt16BE(payload[mode].upper, 2);    //upper limit - rxdata[3]
    buf.writeUInt16BE(payload[mode].lower, 3);    //low limit - rxdata[4]
    
    if (mode == "AOO"){
        buf.writeUInt8(1, 4);   //mode
        buf.writeUInt16BE(0, 5);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(0, 7);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload[mode].atrial_pw, 9);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 11);         //AV delay - rxdata[14:15]            250ms for dual pacing modes (DOO, DOOR)
        buf.writeUInt32BE(payload[mode].atrial_amp*1000, 13) ; //atrial amplitude - rxdata[16:19]   convert to mv by *1000
        buf.writeUInt32BE(0, 17) ;        //ventricular amplitude - rxdata [20:23]
    }
    else if (mode == "VOO"){
        buf.writeUInt8(2, 4);   //mode
        buf.writeUInt16BE(0, 5);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(0, 7);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload[mode].ventricular_pw, 9);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 11);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(0, 13) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(payload[mode].ventricular_amp*1000, 17) ;        //ventricular amplitude - rxdata [20:23] 
    }
    else if (mode == "AAI") {
        buf.writeUInt8(2, 4);   //mode
        buf.writeUInt16BE(payload[mode].arp, 5);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(0, 7);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload[mode].atrial_pw, 9);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 11);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(payload[mode].atrial_amp*1000, 13) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(0, 17) ;        //ventricular amplitude - rxdata [20:23]
    }
    else {   // VVI
        buf.writeUInt8(2, 4);   //mode
        buf.writeUInt16BE(0, 5);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(payload[mode].vrp, 7);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload[mode].ventricular_pw, 9);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 11);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(0, 13) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(payload[mode].ventricular_amp*1000, 17) ;        //ventricular amplitude - rxdata [20:23]
    }
}


module.exports = router;