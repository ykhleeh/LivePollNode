var http = require('http');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); 
var app = express();
var routes = require('./../routes/routes.js')
var session = require('express-session');

var redis = require('redis');
var client = redis.createClient();
client.on('connect', function(){
    console.log('connected to redis');
});
var server;


app.set('views', __dirname+'./../views');

var _configRoute = function() {
app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.authentification);
app.get('/signin', routes.signin);
app.post('/signin', routes.addUser);
app.use(routes.verificator);
app.get('/auth', routes.auth);
app.get('/logout', routes.logout);
app.get('/create', routes.creationForm);
}

var _configServer = function() {
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : false}));
    app.use(session({secret:'keyboard cat', resave:false, saveUninitialized:true , maxAge : 6000}));
}


var start = function(){
    _configServer();
    _configRoute();
    
    app.listen(8080, function () {
       console.log('example app listening'); 
    });
    
}

exports.start = start;
 
