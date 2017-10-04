const url = require('url')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var highscoreList = [{name:"Christian", score:900, timestamp:"123456"}];

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  let staticApp = readTextFile("public/index.html");
  res.send(staticApp);
});

app.get('/highscores', function(request,response){
    //res.send(JSON.stringify(highscoreList));
    response.send(highscoreList);
});

app.post("/score", function(req,res){
    let score = req.body;
    if(score.name != undefined && score.score != undefined){
        console.log(`Post score request ${score.name} ${score.score}`);
        highscoreList.push(score);
        res.status(200).end();
    } else{
        res.status(400).end();
    }
})


app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Noe gikk veldig galt med serveren vår. Prøv igjenn siden. Send oss gjerne en epost.');
});

app.listen(app.get('port'), function() {
    console.log('Guess my number server running', app.get('port'));
});
