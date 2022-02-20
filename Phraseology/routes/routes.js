var db = require('../models/database.js');
var crypto = require('crypto');
var { v4: uuidv4 } = require('uuid');
var requestIp = require('request-ip');

var getHome = function(req, res) {
	
	
	if (req.session.user == undefined) {
		req.session.user = requestIp.getClientIp(req);
		var midnightEST = new Date();
		midnightEST.setUTCHours(28, 59, 59, 1000);
		req.session.expires = midnightEST;
	}
	
	
	if (req.session.mistakes == undefined) {
		req.session.mistakes = 0;
	}
	if (req.session.solved == undefined) {
		req.session.solved = []
	}
	if (req.session.givenLetter == undefined) {
		req.session.givenLetter = 0;
	}
	if (req.session.expires != undefined && req.session.expires > new Date()) {
		req.session.mistakes = 0;
		req.session.solved = []
		req.session.givenLetter = 0;
	}
	
	db.getWords().then(snapshot => {
		var words = []
		if (snapshot.exists()) {
			var unclean = snapshot.val()
			for(var i in unclean) {
				words.push(unclean[i]);
			}
		}
		res.render('main.ejs', {
			words: JSON.stringify(words), 
			mistakes: req.session.mistakes, 
			solved: JSON.stringify(req.session.solved),
			givenLetter: req.session.givenLetter
		});
	}).catch(err => {
		console.log(err);
		res.send(err)
	});
	
}

var addMistake = function(req, res) {
	if (req.session.mistakes != undefined) {
		req.session.mistakes += 1;
	} else {
		req.session.mistakes = 0;
	}
	if (req.session.givenLetter != undefined) {
		req.session.givenLetter = req.body.givenLetter;
	} else {
		req.session.givenLetter = req.body.givenLetter;
	}
	res.send("Done");
}

var addLevel = function(req, res) {
	var word = req.body.word;
	if (req.session.solved != undefined) {
		req.session.solved.push(word);
	} else {
		req.session.solved = [word];
	}
	req.session.givenLetter = 0;
	res.send("Done");
}

var endGame = function(req, res) {
	var mistakes = (req.session.mistakes != undefined) ? req.session.mistakes : 0;
	var upload = (req.body.upload != undefined) ? req.body.upload : false;
	var id = req.session.user;
	var encrypted = crypto.createHash('sha256').update(String(id)).digest('hex');
	db.getRecord(encrypted).then(snapshot => {
		var mistakesMap = { 
			0: 0,
			1: 0,
			2: 0,
			3: 0, 
			4: 0,
			5: 0
		}
		
		
		var games = 0;
		if(snapshot.exists()) {
			var unclean = snapshot.val();
			for (var i = 0; i < 6; i++) {
				mistakesMap[i] += unclean[i];
				games += unclean[i]
			}
		}
		if (upload == "true") {
			mistakesMap[mistakes] += 1
			games += 1
			db.setRecord(encrypted, mistakesMap);
		}
		
		var winningPercentage = (games - mistakesMap[5]) / games;
		res.send({percent: winningPercentage, mistakesMap: mistakesMap})
	});
}

var update = function(req, res) {
	db.updateWords();
	res.send("Done")
}

var add = function(req, res) {
	res.render('admin.ejs')
}

var newWords = function(req, res) {
	var username = req.body.username
	var words = {
		1: req.body.word1.toUpperCase(),
		2: req.body.word2.toUpperCase(),
		3: req.body.word3.toUpperCase(),
		4: req.body.word4.toUpperCase(),
		5: req.body.word5.toUpperCase(),
		6: req.body.word6.toUpperCase(),
		7: req.body.word7.toUpperCase()
	}
	
	if (username == "geoffb273@190054" || username == "EHSVikings12!") {
		db.newWords(words);
		res.redirect("/add")
	}	else {
		res.redirect("/")
	}
	
}



var routes = {
	home: getHome,
	mistake: addMistake,
	correct: addLevel,
	game_over: endGame,
	update: update,
	add: add,
	send: newWords
};

module.exports = routes;