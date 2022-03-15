var utils = require('./utils.js');

var getRecord = function(id) {
	return utils.getItem("records", id);
}

var setRecord = function(id, record) {
	return utils.putItem("records", id, record);
}

var getPointer = async function() {
	let pointer = await utils.getItem("pointer", "");
	return pointer.val();
}

var getWords = function(pointer) {
	return utils.getItem("words", pointer);
}

var newWords = function(words) {
	utils.getItem("words", "").then(snap => {
		if (snap.exists()) {
			var phrases = snap.val();
			var num = phrases.length;
			utils.putItem("words", num, words);
		}
	});
	
}

var updatePointer = function() {
	utils.getItem("pointer", "").then(snap => {
		if (snap.exists()) {
			var pointer = snap.val() + 1;
			utils.putItem("pointer", "", pointer);
		}
	});
}

var resetPointer = function() {
	return utils.putItem("pointer", "", 0);
}

var getLastUpdate = async function() {
	var snap = await utils.getItem("lastUpdate", "");
	if (snap.exists()) {
		return new Date(snap.val());
	} else {
		return new Date(0);
	}
}

var setLastUpdate = function(date) {
	return utils.putItem("lastUpdate", "", date.toISOString())
}

var played = function(id) {
	var prevMidnight = new Date();
	if (prevMidnight.getUTCHours() < 4) {
		prevMidnight.setUTCHours(-1, 0, 0, 0);
	} else {
		prevMidnight.setUTCHours(4, 0, 0, 0);
	}
	var string = prevMidnight.toISOString().split("T")[0];
	
	return utils.putItem("played", string + "/" + id, new Date().toISOString())
}

var sumPlayed = function() {
	var prevMidnight = new Date();
	prevMidnight.setUTCHours(4, 0, 0, 0);
	var num = prevMidnight.getUTCDate();
	prevMidnight.setUTCDate(num - 1);
	var string = prevMidnight.toISOString().split("T")[0];
	utils.getItem("played", string).then(snap => {
		if (snap.exists()) {
			var players = snap.val();
			if (!players.hasOwnProperty('num')) {
				var cleaned = {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
					12: 0,
					13: 0,
					14: 0,
					15: 0,
					16: 0,
					17: 0,
					18: 0,
					19: 0,
					20: 0,
					21: 0,
					22: 0,
					23: 0,
					0: 0
				}
				var count = 0;
				for (var key in players) {
					var hour = findPlace(players[key])
					cleaned[hour] += 1;
					count += 1
				}
				
				utils.putItem("played", string, {num: count, times: cleaned})
			}
		}
	});
}

var findPlace = function(timeString) {
	var time = new Date(timeString)
	var hour = time.getUTCHours();
	time.setUTCHours(hour - 4);
	return time.getUTCHours();
}


module.exports = {
	getRecord: getRecord,
	setRecord: setRecord,
	getWords: getWords,
	getPointer: getPointer,
	newWords: newWords,
	updatePointer: updatePointer,
	resetPointer: resetPointer,
	getLastUpdate: getLastUpdate,
	setLastUpdate: setLastUpdate,
	played: played,
	sumPlayed: sumPlayed
};