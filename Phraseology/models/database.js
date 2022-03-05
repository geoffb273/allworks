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

var updatePointer = function(reset = false) {
	utils.getItem("pointer").then(snap => {
		if (reset) {
			utils.putItem("pointer", "", 0);
		} else if (snap.exists()) {
			var pointer = snap.val() + 1;
			utils.putItem("pointer", "", pointer);
		}
	});
}


module.exports = {
	getRecord: getRecord,
	setRecord: setRecord,
	getWords: getWords,
	getPointer: getPointer,
	newWords: newWords,
	updatePointer: updatePointer
};