const express = require('express');
const router = new express.Router();
const knex = require('../db/knex')

//serial communication
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const ByteLength = require('@serialport/parser-byte-length')
const path = '/dev/tty.usbmodem0000001234561';        //path for K64F board
const port = new SerialPort(path, { baudRate: 115200 });
var buf = Buffer.alloc(54);
var verify = Buffer.alloc(2);

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
            payload = req.body
            console.log(payload.mode)
                
            /* port.on('open', function() {
                console.log("HERE 2")
                getByteStream(user.config);
                console.log(buf)
                port.write(buf);
            }) */
            getByteStream(payload);
            //set bytes
             port.write(buf,function (err) {
                if (err) {
                  return console.log('Error opening port: ', err.message)
                }
              
                // Because there's no callback to write, write errors will be emitted on the port:
                console.log(buf);
              })
              //console.log(buf);

              /*verify.writeUInt8(0, 0);
              verify.writeUInt8(0, 1);
              console.log(verify);
              port.write(verify,function (err) {
                if (err) {
                  return console.log('Error opening port: ', err.message)
                }
                const parser = port.pipe(new ByteLength({length: 53}))
                //console.log(parser);
                parser.on('data', console.log)
                //console.log(verify);
            }) */

            res.status(200).json({message: "succesfully saved configs for " + mode})
        })



        //write sync and fn to receive data and perform validation
    })
    .catch(err =>{
        res.status(500).json({err, message: "failed to saved configs for " + mode}) //give back error for any reason
    })

});           

function getByteStream (payload){
    let sync = 0, fn = 0;     //22, 85

    buf.writeFloatBE(sync);        //rxdata[0]
    buf.writeFloatBE(fn);          //rxdata[1]

    buf.writeFloatBE(payload.config.upper);    //upper limit - rxdata[3:4]
    buf.writeFloatBE(payload.config.lower);    //low limit - rxdata[5:6]
    
    if (payload.mode == "AOO"){
        buf.writeFloatBE(2);   //mode
        buf.writeFloatBE(0);   //arfp - rxdata[8:9]
        buf.writeFloatBE(0);  //vrfp - rxdata[10:11]
        buf.writeFloatBE(payload.config.atrial_pw);     //pulse width - rxdata[12:13]
        buf.writeFloatBE(0);         //AV delay - rxdata[14:15]            250ms for dual pacing modes (DOO, DOOR)
        buf.writeFloatBE(payload.config.atrial_amp*1000) ; //atrial amplitude - rxdata[16:19]   convert to mv by *1000
        buf.writeFloatBE(0) ;        //ventricular amplitude - rxdata [20:23]
        buf.writeFloatBE(0);       //MSR
        buf.writeFloatBE(0);       //reaction time
        buf.writeFloatBE(0);       //response time
        buf.writeFloatBE(0);       //activity threshold
        }
    /*
    else if (payload.mode == "VOO"){
        buf.writeUInt8(2, 6);   //mode
        buf.writeUInt16BE(0, 7);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(0, 9);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload[mode].ventricular_pw, 11);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 13);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(0, 15) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(payload[mode].ventricular_amp*1000, 19) ;        //ventricular amplitude - rxdata [20:23] 
    }
    else if (payload.mode == "AAI") {
        buf.writeUInt8(2, 6);   //mode
        buf.writeUInt16BE(payload[mode].arp, 7);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(0, 9);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload[mode].atrial_pw, 11);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 13);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(payload[mode].atrial_amp*1000, 15) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(0, 19) ;        //ventricular amplitude - rxdata [20:23]
    }
    else {   // VVI
        buf.writeUInt8(2, 6);   //mode
        buf.writeUInt16BE(0, 7);   //arfp - rxdata[8:9]
        buf.writeUInt16BE(payload[mode].vrp, 9);  //vrfp - rxdata[10:11]
        buf.writeUInt16BE(payload[mode].ventricular_pw, 11);     //pulse width - rxdata[12:13]
        buf.writeUInt16BE(0, 13);         //AV delay - rxdata[14:15]
        buf.writeUInt32BE(0, 15) ; //atrial amplitude - rxdata[16:19]
        buf.writeUInt32BE(payload[mode].ventricular_amp*1000, 19) ;        //ventricular amplitude - rxdata [20:23]
    }*/
}


module.exports = router;