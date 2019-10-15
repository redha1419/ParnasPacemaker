const express  = require('express');
var bodyParser = require("body-parser");
const app      = express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
 app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");

  next();
}); 

const users = require('./routes/users');
const interface = require('./routes/interface');

require('dotenv').config();


app.use('/', users);
app.use('/', interface);

app.listen(process.env.PORT, function() {
  console.info("==> 🌎 Peep port %s.", process.env.PORT);
})
