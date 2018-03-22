const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const accountApi = require('./api/account');

const upload = multer();
const app = express();

// Use body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(upload.array());

// API endpoints
app.post('/api/create/', accountApi.create);
app.post('/api/login/', accountApi.login);
app.post('/api/verify-rfid/', accountApi.verifyRfid);

// Public endpoints
app.use(express.static('public'));

app.listen(8080);
