const express = require('express');
const app = express();
var http = require('http').Server(app);
var routes = require('./routes/routes.js');
var session = require('express-session');

var cookieParser = require('cookie-parser');
var MemoryStore = require('memorystore')(session);
var PORT = process.env.PORT || 8000

var cors = require('cors');

var pointer = 8;
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
  if (req.path == '/' && req.session.pointer != pointer) {
    req.session.pointer = pointer
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
app.post("/send", routes.send)

function update() {
    var now = new Date();
    var night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0 
    );
    var msToMidnight = night.getTime() - now.getTime();

    setTimeout(function() {
        pointer += 1
        update();
    }, msToMidnight);
}
update()



http.listen(PORT, function(){  
    console.log('listening on :' + PORT);
});