const express = require('express');
const app = express();
var http = require('http').Server(app);
var routes = require('./routes/routes.js');
var session = require('express-session');

var cookieParser = require('cookie-parser');
var MemoryStore = require('memorystore')(session);
var PORT = process.env.PORT || 8000
var cron = require('node-cron')
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

app.all('*', function(req, res, next) {
  if (req.path !== '/' && req.path !== '/add') {
    res.redirect('/');
  } else {
    next();
  }
});

app.get("/", routes.home);
app.post("/mistake", routes.mistake);
app.post("/correct", routes.correct);
app.put("/game-over", routes.game_over);

app.get("/add", routes.add);
app.post("/send", routes.send);

app.get("/google58adfd6211de0909.html", function(req, res) {
	res.sendFile(__dirname+"/views/google58adfd6211de0909.html");
});

function update() {
    routes.update()
}
cron.schedule('0 0 * * *', update, {
	scheduled: true,
	timezone: "America/New_York"	
});

http.listen(PORT, function(){  
    console.log('listening on :' + PORT);
});