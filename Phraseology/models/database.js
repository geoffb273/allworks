var utils = require('./utils.js');

var getRecord = function(id) {
	return utils.getItem("records", id);
}

var setRecord = function(id, record) {
	return utils.putItem("records", id, record);
}

var getWords = function() {
	return utils.getItem("words", 0);
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

var updateWords = function() {
	utils.getItem("words", "").then(snap => {
		if (snap.exists()) {
			var phrases = snap.val();
			var updated = {}
			for (var key in phrases) {
				if (key > 0) {
					updated[key - 1] = phrases[key]
					last = key;
				}
			}
			utils.putItem("words", "", updated);
		}
	});
}


module.exports = {
	getRecord: getRecord,
	setRecord: setRecord,
	getWords: getWords,
	updateWords: updateWords,
	newWords: newWords
};