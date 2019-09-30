const express  = require('express');
var bodyParser = require("body-parser");
const app      = express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = require('./routes/users');

require('dotenv').config();


app.use('/api', users);

app.listen(process.env.PORT, function() {
  console.info("==> 🌎 Peep port %s.", process.env.PORT);
})
