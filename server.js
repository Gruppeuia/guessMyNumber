const url = require('url')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var highscoreList = ["CHRISTIAN 1"];

app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  let staticApp = readTextFile("public/index.html");
  res.send(staticApp);
});

app.get('/highScore', function(req,res){
    res.send(highscoreList);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Noe gikk veldig galt med serveren vår. Prøv igjenn siden. Send oss gjerne en epost.');
});

app.listen(app.get('port'), function() {
    console.log('Event server running', app.get('port'));
});
