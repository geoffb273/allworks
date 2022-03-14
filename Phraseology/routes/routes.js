var db = require('../models/database.js');
var crypto = require('crypto'); 
var {v4: uuidv4} = require('uuid')


var getHome = async function(req, res) {
	var last = await db.getLastUpdate();
	var pointer = await db.getPointer();
	var lastUpdate = last.getTime();
	var now = Date.now();
	
	if (now - lastUpdate >= 86460000) {
		update()
		pointer += 1;
	}
	
	
	
	var midnightEST = new Date();
	midnightEST.setUTCHours(27, 59, 59, 1000);
	var infinite = new Date();
	infinite.setFullYear(3000)
	
	if (req.cookies['user'] == undefined) {
		res.cookie('user', uuidv4(), {expires: infinite});
	}
	
	var mistakes = 0;
	if (req.cookies['mistakes'] == undefined) {
		res.cookie('mistakes', 0, {expires: midnightEST})
	} else {
		mistakes = req.cookies['mistakes']
		//res.cookie('mistakes', 0, {expires: midnightEST})
	}
	
	var solved = []
	
	if (req.cookies['solved'] == undefined) {
		res.cookie('solved', JSON.stringify([]), {expires: midnightEST})
	} else {
		//res.cookie('solved', JSON.stringify([]), {expires: midnightEST})
		solved = JSON.parse(req.cookies['solved']);
	}
	
	var givenLetter = 0;
	if (req.cookies['givenLetter'] == undefined) {
		res.cookie('givenLetter', 0, {expires: midnightEST})
	} else {
		//res.cookie('givenLetter', 0, {expires: midnightEST})
		givenLetter = req.cookies['givenLetter']
	}
		db.getWords(pointer).then(snapshot => {
			var words = []
			if (snapshot.exists()) {
				var unclean = snapshot.val()
				for(var i in unclean) {
					words.push(unclean[i]);
				}
				res.render('main.ejs', {
					words: JSON.stringify(words), 
					mistakes: mistakes, 
					solved: JSON.stringify(solved),
					givenLetter: givenLetter
				});
			} else {
				db.resetPointer();
				db.getWords(0).then(snap => {
					if (snap.exists()) {
						var unclean = snap.val()
						for(var i in unclean) {
							words.push(unclean[i]);
						}
						res.render('main.ejs', {
							words: JSON.stringify(words), 
							mistakes: mistakes, 
							solved: JSON.stringify(solved),
							givenLetter: givenLetter
						});
					}
				});
			}
			
		}).catch(err => {
			console.log(err);
			res.send(err)
		});
	
	
	
}

var addMistake = function(req, res) {
	var midnightEST = new Date();
	midnightEST.setUTCHours(27, 59, 59, 1000);
	if (req.cookies['mistakes'] != undefined) {
		res.cookie('mistakes', Number(req.cookies['mistakes']) + 1, {expires: midnightEST});
	} else {
		res.cookie('mistakes', 0, {expires: midnightEST});
	}
	if (req.cookies['givenLetter'] != undefined) {
		res.cookie('givenLetter', req.body.givenLetter, {expires: midnightEST});
	} else {
		res.cookie('givenLetter', req.body.givenLetter, {expires: midnightEST});
	}
	res.send("Done");
}

var addLevel = function(req, res) {
	var word = req.body.word;
	var midnightEST = new Date();
	midnightEST.setUTCHours(27, 59, 59, 1000);
	if (req.cookies['solved'] != undefined) {
		var solved = JSON.parse(req.cookies['solved']);
		solved.push(word)
		res.cookie('solved', JSON.stringify(solved), {expires: midnightEST});
	} else {
		res.cookie('solved', JSON.stringify([word]), {expires: midnightEST});
	}
	res.cookie('givenLetter', 0, {expires: midnightEST})
	res.send("Done");
}

var endGame = function(req, res) {
	var mistakes = (req.cookies['mistakes'] != undefined) ? req.cookies['mistakes'] : 0;
	var upload = (req.body.upload != undefined) ? req.body.upload : false;
	var id = req.cookies['user'];
	db.getRecord(id).then(snapshot => {
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
			db.setRecord(id, mistakesMap);
		}
		
		var winningPercentage = (games - mistakesMap[5]) / games;
		res.send({percent: winningPercentage, mistakesMap: mistakesMap})
	});
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
	
	if (crypto.createHash('sha256').update(username).digest('hex') 
		== "ba6a3004dcd4db2a4da1e3d7a9810349534de26280df8b635fa2d04c25d0eb01" 
			|| crypto.createHash('sha256').update(username).digest('hex') == "8343a0e1b8e5bb3d26c91d4af1bad7a92e7b71185ce1a832dcfa3ed7a65b3cde") {
		db.newWords(words);
		res.redirect("/add")
	}	else {
		res.redirect("/")
	}
	
}

var update = function() {
	var prevMidnight = new Date();
	prevMidnight.setUTCHours(4, 0, 0, 0);
	db.setLastUpdate(prevMidnight)
	db.updatePointer();
}

var routes = {
	home: getHome,
	mistake: addMistake,
	correct: addLevel,
	game_over: endGame,
	add: add,
	send: newWords,
	update: update
};

module.exports = routes;