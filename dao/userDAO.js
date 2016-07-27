var redis = require('redis');
var client = redis.createClient();
var sha1 = require('sha1');

var insertUser = function(pseudo, mdp, callback){
    client.hmset('user:'+pseudo, {'mdp':sha1(mdp), 'pseudo' : pseudo}, function(erreur, reply){
        console.log(reply);
    });
    return callback();
}

var getMdp= function(pseudo, callback){
    client.hget('user:'+ pseudo,'mdp', function (err, obj){
    	if (err!=null){
            console.log(err);
    		return callback(err);
    	}
    	return	callback(null, obj);
	});
}


var getUserInfo= function(pseudo, callback){
    client.hgetall('user:'+ pseudo, function (err, obj){
    	if (err!=null){
            console.log(err);
    		return callback(err);
    	}
    	return	callback(null, obj);
	});

}
module.exports.insertUser = insertUser;
module.exports.getMdp = getMdp;
module.exports.getUserInfo = getUserInfo;
