const url = require('url')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {Client} = require("pg");

var highscoreList = [];

getHighScores();

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
        saveHighScores(score);
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


function getHighScores(){
    
    let client = new Client({
        connectionString:process.env.DATABASE_URL,
        ssl:true
    });

    client.connect();

    client.query("select * from highscores", (err,resp) =>{
        
        console.dir(resp);
        resp.rows.forEach(row => {
            highscoreList.push(row);
        });
        client.end();
    });

}

function saveHighScores(score){
    
    let client = new Client({
        connectionString:process.env.DATABASE_URL,
        ssl:true
    });

    client.connect();

    let sql = `INSERT INTO "highscores"("name", "score", "timestamp") VALUES('${score.name}', ${score.score}, '${score.timestamp}') RETURNING "id", "name", "score", "timestamp";`

    client.query(sql, (err,resp) =>{
        console.dir(resp);
        client.end();
    });

}