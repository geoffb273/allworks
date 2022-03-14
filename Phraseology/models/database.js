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
	prevMidnight.setUTCHours(4, 0, 0, 0);
	
	return utils.putItem("played", prevMidnight.toDateString() + "/" + id, true)
}

var sumPlayed = function() {
	var prevMidnight = new Date();
	prevMidnight.setUTCHours(4, 0, 0, 0);
	var num = prevMidnight.getUTCDate();
	prevMidnight.setUTCDate(num - 1);
	utils.getItem("played", prevMidnight.toDateString()).then(snap => {
		if (snap.exists()) {
			var players = snap.val();
			if (players["00num"] == undefined) {
				utils.putItem("played", prevMidnight.toDateString() + "/00num", players.length)
			}
			
		}
	});
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