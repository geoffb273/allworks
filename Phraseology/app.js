const express = require('express');
const app = express();
var http = require('http').Server(app);
var routes = require('./routes/routes.js');
var session = require('express-session');

var cookieParser = require('cookie-parser');
var MemoryStore = require('memorystore')(session);
var PORT = process.env.PORT || 8000

var cors = require('cors');

app.use(express.urlencoded());
app.use(cors())
app.use(cookieParser())
app.use(session({
	resave: true,
	cookie: {
		
	},
	
    secret: 'GRBRANDT'
}))

 app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

app.get("/", routes.home);
app.post("/mistake", routes.mistake);
app.post("/correct", routes.correct);
app.put("/game-over", routes.game_over);

app.get("/add", routes.add);
app.post("/send", routes.send)

var update = function() {
	var midnightEST = new Date();
	midnightEST.setUTCHours(28, 59, 59, 1000);
	routes.update();
	setTimeout(update, midnightEST.getTime - Date.now());
}



http.listen(PORT, function(){  
    console.log('listening on :' + PORT);
});