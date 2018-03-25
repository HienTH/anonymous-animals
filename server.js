const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var routes = require('./routes/web');
app.use('/', routes);