const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./server/config/config.js');
const jwt = require('jsonwebtoken');
const urls = require('./server/routes/freeRoutes.js').TOKEN_NOT_NEEDED;
const cors = require('cors');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('appSecret', config.secret);
const corsOption = {
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 200,
};
app.use(cors());
app.use(function(req, res, next) {


  console.log(req.url, process.pid);
  if (req.url.includes('socket.io') || req.url.includes('stomp')) {
    return next();
  }
	if (urls.indexOf(req.url) > -1) {
		return next();
	}
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('appSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./server/routes')(app);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;
