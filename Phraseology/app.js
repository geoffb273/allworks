const express = require('express');
const app = express();
var http = require('http').Server(app);
var routes = require('./routes/routes.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemoryStore = require('memorystore')(session);
var PORT = process.env.PORT || 8000
const cron = require('node-cron');

app.use(express.urlencoded());
app.use(session({
	resave: false,
	cookie: {
		
	},
    resave: false,
    secret: 'GRBRANDT'
}))

app.get("/", routes.home);
app.post("/mistake", routes.mistake);
app.post("/correct", routes.correct);
app.put("/game-over", routes.game_over);

cron.schedule("0 5 * * *", routes.update);


http.listen(PORT, function(){  
    console.log('listening on :' + PORT);
});