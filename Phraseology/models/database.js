var utils = require('./utils.js');

var getRecord = function(id) {
	return utils.getItem("records", id);
}

var setRecord = function(id, record) {
	return utils.putItem("records", id, record);
}

var getPointer = function() {
	return utils.getItem("pointer", "");
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


module.exports = {
	getRecord: getRecord,
	setRecord: setRecord,
	getWords: getWords,
	getPointer: getPointer,
	newWords: newWords
};