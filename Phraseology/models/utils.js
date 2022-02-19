
const {initializeApp} = require('firebase/app');
const {getDatabase, ref, set, get} = require('firebase/database');
const firebaseConfig = {
  apiKey: "AIzaSyCIVkoOmU1ZH-CCbZTD76Om3U9MqXSapUQ",
  authDomain: "phraseology-f7f86.firebaseapp.com",
  projectId: "phraseology-f7f86",
  storageBucket: "phraseology-f7f86.appspot.com",
  messagingSenderId: "260573719552",
  appId: "1:260573719552:web:fbef3223b4e178feffbce5",
  measurementId: "G-QPE735N9MK"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const db = getDatabase(app);

var putItem = function(tableName, path, obj) {
	return set(ref(db, tableName + "/" + path), obj);
}

var getItem = function(tableName, path) {
	return get(ref(db, tableName + "/" + path))
}





module.exports = {
	putItem: putItem,
	getItem: getItem
};