var userDao = require('./../dao/userDAO.js')
var sha1 = require('sha1');
var config = require('./../modules/config.js');
var jwt = require('jsonwebtoken');
var session = require('express-session');

var index = function (request,response) {
    var tok = request.session.token;
    if(tok){
        response.render('index.ejs',{logged : true});
    }else{
        response.redirect('/login');
    }
}

var login = function (request,response) {
      var tok = request.session.token;
    if(tok){
       response.redirect('/');
    }else{
   response.render('login.ejs',{logged : false});

    }
}

var addUser = function (request, response) {
    var pseudo = request.body.pseudo;
    var mdp = request.body.mdp;
    console.log("ok1");
    userDao.insertUser(pseudo, mdp, function () {
         userDao.getUserInfo(pseudo, function (error, user) {
                if(error){
                    return console.log(err);
                }
               var token = jwt.sign(user, config.secretKey);
               request.session.token = token;
               response.redirect('/');
            });
          
    });
}

var authentification = function(req,res){
    var pseudo = req.body.pseudo;
    var mdp = req.body.mdp;

    var obj = userDao.getMdp(pseudo, function (err, data) {
        if(err){
            return console.log(err);
        }
        if(sha1(mdp)!=data){
            res.status(400).send('connexion refuser');
        }else{
            userDao.getUserInfo(pseudo, function (error, user) {
                if(error){
                    return console.log(err);
                }
               var token = jwt.sign(user, config.secretKey);
               req.session.token = token;
               res.redirect('/');
            });
          ;
        }
    });

}

var verificator = function (req,res,next) {
    var token = req.session.token;
    if(token){
        jwt.verify(token, config.secretKey, function (error, decoded) {
            if(error){
                res.status(403).send("fail authentification");
            }else{
                req.decoded = decoded;
                next();
            }

        });
    }else{
        res.status(401).send('Acces unavailable');
    }
}


var signin = function (req,res) {
    var tok = req.session.token;
    if(tok){
       res.redirect('/');
    }else{
        res.render('signin.ejs',{logged : false});
    }
}

var auth = function (req,res) {
    res.render('auth.ejs');
}

var logout = function (req,res) {
    req.session.destroy(function (err) {
        console.log(err);
    });
    res.redirect('/');
}

var creationForm = function (req, res) {
    res.render('create.ejs');
}


exports.index = index;
exports.login = login;
exports.addUser = addUser;
exports.authentification=authentification;
exports.signin = signin;
exports.verificator = verificator;
exports.auth = auth;
exports.logout = logout;
exports.creationForm = creationForm;