const express  = require('express');
var bodyParser = require("body-parser");
const app      = express();
var server = require('http').Server(app);



//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS, to make our server public even when using different location
 app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
}); 

//grab our routes in users and interface
const users = require('./routes/users'); 
const interface = require('./routes/interface');

require('dotenv').config(); //grab our environment variables


app.use('/', users); //set our routes to the "/" location
app.use('/', interface); //set our routes to the "/" location




/* TESTING AREA FOR E-GRAM */

//socket io
var io = require('socket.io')(server);

//serial io
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
const ByteLength = require('@serialport/parser-byte-length')
const path = '/dev/tty.usbmodem0000001234561';        //path for K64F board


io.on('connection', function (socket) {
  //here we will listen to the pacemaker and emit CONSTANTLY!!
  try{
    let port = new SerialPort(path, { baudRate: 115200, autoOpen: true});
    let parser = port.pipe(new ByteLength({length: 17}))
    parser.on('data', (data)=>{
      socket.emit('news', {hello: data});
    }) // will have 8 bytes per data event
  
    socket.on('disconnect',()=>{
      console.log('HALLP')
      socket.disconnect();
      port.close();
    })
  }catch(e){
    console.log('couldnt open pace port...')
  }
});


server.listen(process.env.PORT, function() {
  console.info("==> 🌎 Peep port %s.", process.env.PORT);
})
