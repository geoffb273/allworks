const express = require('express');
const app = express();
var http = require('http').Server(app);
var routes = require('./routes/routes.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemoryStore = require('memorystore')(session);
var PORT = process.env.PORT || 8000
const cron = require('node-cron');
var cors = require('cors');

app.use(express.urlencoded());
app.use(cors())
app.use(session({
	resave: true,
	cookie: {
		maxAge: 86400000
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

cron.schedule("0 5 * * *", routes.update);


http.listen(PORT, function(){  
    console.log('listening on :' + PORT);
});