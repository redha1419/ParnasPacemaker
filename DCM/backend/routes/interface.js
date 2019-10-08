const express = require('express');
const router = new express.Router();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');


router.get('/pacing_mode', function(req, res){

    const port = new SerialPort(path, { baudRate: 256000 });
    const parser = new Readline();
    port.pipe(parser);
    parser.on('data', line => console.log(`> ${line}`));
    port.write('ROBOT POWER ON\n');

});

module.exports = router;