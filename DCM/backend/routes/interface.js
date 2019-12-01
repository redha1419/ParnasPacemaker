const express = require('express');
const router = new express.Router();
const knex = require('../db/knex')

//serial communication
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const path = '/dev/tty.usbmodem0000001234561';        //path for K64F board


//setting the pace mode
router.post('/pace', function(req, res){
    //grab credentials from request
    let mode = req.body.mode;
    let username = req.body.username;
    let config = req.body.config;


    knex('users') //query db and retrieve [user]
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
            let payload = req.body;
            let buf = getByteStream(payload);
            let port = new SerialPort(path, { baudRate: 115200, autoOpen: false});
            port.open(err=>{
                if (err) {
                    return console.log('Error opening port: ', err.message)
                }
                port.write(buf)
                port.drain();
                port.close()
                console.log(buf)
                res.status(200).json({message: "succesfully saved configs for " + mode})
            })
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({err, message: "failed to saved configs for " + mode}) //give back error for any reason
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({err, message: "failed to saved configs for " + mode}) //give back error for any reason
    })

});           

function getByteStream (payload){
    console.log(payload)
    let buf = Buffer.alloc(30);
    let sync = 22, fn = 85;     //22, 85

    buf.writeInt8(sync, 0);        //rxdata[0]
    buf.writeInt8(fn, 1);          //rxdata[1]

    buf.writeUInt16LE(payload.config.upper, 2);    //upper limit - rxdata[3:4]
    buf.writeUInt16LE(payload.config.lower, 4);    //low limit - rxdata[5:6]

    /*
            //rate adaptive
            maximum_sensor_rate: res.data.config.AOO.maximum_sensor_rate,
            activity_threshold: res.data.config.AOO.activity_threshold,
            reaction_time: res.data.config.AOO.reaction_time, 
            response_factor: res.data.config.AOO.response_factor,
            recovery_time: res.data.config.AOO.recovery_time   
            
            payload.config.maximum_sensor_rate
            payload.config.activity_threshold
            payload.config.reaction_time
            payload.config.response_factor
            payload.config.recovery_time


    */

    if (payload.mode == "VOO"){
        buf.writeUInt16LE(1, 6);                                    //mode
        buf.writeUInt16LE(0, 8);                                    //afrp
        buf.writeUInt16LE(0, 10);                                   //vrfp 
        buf.writeUInt16LE(0, 12);                                   //atrial pulse width 
        buf.writeUInt16LE(payload.config.ventricular_pw, 14);       //ventrical pulse width 
        buf.writeUInt16LE(0, 16);                                   //AV delay
        buf.writeUInt16LE(0, 18) ;                                  //atrial amplitude
        buf.writeUInt16LE(payload.config.ventricular_amp*1000, 20); //ventricular amplitude
        buf.writeUInt16LE(0, 22);                                   //MSR
        buf.writeUInt16LE(0, 24);                                   //reaction time
        buf.writeUInt16LE(0, 26);                                   //response time
        buf.writeUInt16LE(0, 28);                                   //activity threshold
    }
    if (payload.mode == "AOO"){
        buf.writeUInt16LE(2, 6);                                    //mode
        buf.writeUInt16LE(0, 8);                                    //afrp
        buf.writeUInt16LE(0, 10);                                   //vrfp 
        buf.writeUInt16LE(payload.config.atrial_pw, 12);            //atrial pulse width 
        buf.writeUInt16LE(0, 14);                                   //ventrical pulse width 
        buf.writeUInt16LE(0, 16);                                   //AV delay
        buf.writeUInt16LE(payload.config.atrial_amp*1000, 18) ;     //atrial amplitude
        buf.writeUInt16LE(0, 20);                                   //ventricular amplitude
        buf.writeUInt16LE(0, 22);                                   //MSR
        buf.writeUInt16LE(0, 24);                                   //reaction time
        buf.writeUInt16LE(0, 26);                                   //response time
        buf.writeUInt16LE(0, 28);                                   //activity threshold
    }
    else if (payload.mode == "VVI") {   // VVI
        buf.writeUInt16LE(3, 6);   
        buf.writeUInt16LE(0, 8);   
        buf.writeUInt16LE(payload.config.vrp, 10);  
        buf.writeUInt16LE(0, 12);
        buf.writeUInt16LE(payload.config.ventricular_pw, 14);
        buf.writeUInt16LE(0, 16);         
        buf.writeUInt16LE(0, 18) ; 
        buf.writeUInt16LE(payload.config.ventricular_amp*1000, 20);
        buf.writeUInt16LE(0, 22);       
        buf.writeUInt16LE(0, 24);       
        buf.writeUInt16LE(0, 26);       
        buf.writeUInt16LE(0, 28);       
    }
    else if (payload.mode == "AAI") {
        buf.writeUInt16LE(4, 6);   
        buf.writeUInt16LE(payload.config.vrp, 8);   
        buf.writeUInt16LE(0, 10);  
        buf.writeUInt16LE(payload.config.atrial_pw, 12);
        buf.writeUInt16LE(0, 14);
        buf.writeUInt16LE(0, 16);         
        buf.writeUInt16LE(payload.config.atrial_amp*1000, 18) ; 
        buf.writeUInt16LE(0, 20);
        buf.writeUInt16LE(0, 22);       
        buf.writeUInt16LE(0, 24);       
        buf.writeUInt16LE(0, 26);       
        buf.writeUInt16LE(0, 28);     
    }
    else if (payload.mode == "DOO") {   // DOO
        buf.writeUInt16LE(5, 6);   //mode
        buf.writeUInt16LE(0, 8);   //arfp - rxdata[8:9]
        buf.writeUInt16LE(0, 10);  //vrfp - rxdata[10:11]
        buf.writeUInt16LE(payload.config.atrial_pw, 12);     //pulse width - rxdata[12:13]
        buf.writeUInt16LE(payload.config.ventricular_pw, 14);     //pulse width - rxdata[12:13]
        buf.writeUInt16LE(payload.config.fixed_av_delay, 16);         //AV delay - rxdata[14:15]            250ms for dual pacing modes (DOO, DOOR)
        buf.writeUInt16LE(payload.config.atrial_amp*1000, 18) ; //atrial amplitude - rxdata[16:19]   convert to mv by *1000
        buf.writeUInt16LE(payload.config.ventricular_amp*1000, 20) ;        //ventricular amplitude - rxdata [20:23]
        buf.writeUInt16LE(0, 22);       //MSR
        buf.writeUInt16LE(0, 24);       //reaction time
        buf.writeUInt16LE(0, 26);       //response time
        buf.writeUInt16LE(0, 28);       //activity threshold
    }
    else if(payload.mode == "VOOR"){
        buf.writeUInt16LE(1, 6);                                    //mode
        buf.writeUInt16LE(0, 8);                                    //afrp
        buf.writeUInt16LE(0, 10);                                   //vrfp 
        buf.writeUInt16LE(0, 12);                                   //atrial pulse width 
        buf.writeUInt16LE(payload.config.ventricular_pw, 14);       //ventrical pulse width 
        buf.writeUInt16LE(0, 16);                                   //AV delay
        buf.writeUInt16LE(0, 18) ;                                  //atrial amplitude
        buf.writeUInt16LE(payload.config.ventricular_amp*1000, 20); //ventricular amplitude
        buf.writeUInt16LE(payload.config.maximum_sensor_rate, 22);  //MSR
        buf.writeUInt16LE(payload.config.reaction_time, 24);        //reaction time
        buf.writeUInt16LE(payload.config.recovery_time, 26);        //response time
        buf.writeUInt16LE(payload.config.activity_threshold, 28);   //activity threshold
    }
    if (payload.mode == "AOOR"){
        buf.writeUInt16LE(2, 6);                                    //mode
        buf.writeUInt16LE(0, 8);                                    //afrp
        buf.writeUInt16LE(0, 10);                                   //vrfp 
        buf.writeUInt16LE(payload.config.atrial_pw, 12);            //atrial pulse width 
        buf.writeUInt16LE(0, 14);                                   //ventrical pulse width 
        buf.writeUInt16LE(0, 16);                                   //AV delay
        buf.writeUInt16LE(payload.config.atrial_amp*1000, 18) ;     //atrial amplitude
        buf.writeUInt16LE(payload.config.maximum_sensor_rate, 22);  //MSR
        buf.writeUInt16LE(payload.config.reaction_time, 24);        //reaction time
        buf.writeUInt16LE(payload.config.recovery_time, 26);        //response time
        buf.writeUInt16LE(payload.config.activity_threshold, 28);   //activity threshold
    }
    else if (payload.mode == "VVIR") {   // VVI
        buf.writeUInt16LE(3, 6);   
        buf.writeUInt16LE(0, 8);   
        buf.writeUInt16LE(payload.config.vrp, 10);  
        buf.writeUInt16LE(0, 12);
        buf.writeUInt16LE(payload.config.ventricular_pw, 14);
        buf.writeUInt16LE(0, 16);         
        buf.writeUInt16LE(0, 18) ; 
        buf.writeUInt16LE(payload.config.ventricular_amp*1000, 20);
        buf.writeUInt16LE(payload.config.maximum_sensor_rate, 22);  //MSR
        buf.writeUInt16LE(payload.config.reaction_time, 24);        //reaction time
        buf.writeUInt16LE(payload.config.recovery_time, 26);        //response time
        buf.writeUInt16LE(payload.config.activity_threshold, 28);   //activity threshold   
    }
    else if (payload.mode == "AAIR") {
        buf.writeUInt16LE(4, 6);   
        buf.writeUInt16LE(payload.config.vrp, 8);   
        buf.writeUInt16LE(0, 10);  
        buf.writeUInt16LE(payload.config.atrial_pw, 12);
        buf.writeUInt16LE(0, 14);
        buf.writeUInt16LE(0, 16);         
        buf.writeUInt16LE(payload.config.atrial_amp*1000, 18) ; 
        buf.writeUInt16LE(0, 20);
        buf.writeUInt16LE(payload.config.maximum_sensor_rate, 22);  //MSR
        buf.writeUInt16LE(payload.config.reaction_time, 24);        //reaction time
        buf.writeUInt16LE(payload.config.recovery_time, 26);        //response time
        buf.writeUInt16LE(payload.config.activity_threshold, 28);   //activity threshold   
    }
    else if (payload.mode == "DOOR") {   // DOO
        buf.writeUInt16LE(5, 6);   //mode
        buf.writeUInt16LE(0, 8);   //arfp - rxdata[8:9]
        buf.writeUInt16LE(0, 10);  //vrfp - rxdata[10:11]
        buf.writeUInt16LE(payload.config.atrial_pw, 12);     //pulse width - rxdata[12:13]
        buf.writeUInt16LE(payload.config.ventricular_pw, 14);     //pulse width - rxdata[12:13]
        buf.writeUInt16LE(payload.config.fixed_av_delay, 16);         //AV delay - rxdata[14:15]            250ms for dual pacing modes (DOO, DOOR)
        buf.writeUInt16LE(payload.config.atrial_amp*1000, 18) ; //atrial amplitude - rxdata[16:19]   convert to mv by *1000
        buf.writeUInt16LE(payload.config.ventricular_amp*1000, 20) ;        //ventricular amplitude - rxdata [20:23]
        buf.writeUInt16LE(payload.config.maximum_sensor_rate, 22);  //MSR
        buf.writeUInt16LE(payload.config.reaction_time, 24);        //reaction time
        buf.writeUInt16LE(payload.config.recovery_time, 26);        //response time
        buf.writeUInt16LE(payload.config.activity_threshold, 28);   //activity threshold
    }
   return buf;
}


module.exports = router;