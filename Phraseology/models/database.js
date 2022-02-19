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

var updateWords = function() {
	utils.getItem("words", "").then(snap => {
		if (snap.exists()) {
			var phrases = snap.val();
			var updated = {}
			for (var i = 0; i < phrases.length; i++) {
				updated[i - 1] = phrases[i]
			}
			utils.putItem("words", "", updated);
		}
	});
}


module.exports = {
	getRecord: getRecord,
	setRecord: setRecord,
	getWords: getWords,
	updateWords: updateWords
};