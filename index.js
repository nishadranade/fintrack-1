const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var uri = 'mongodb+srv://fintrack:aarat@cluster0-k5ifk.mongodb.net/test?retryWrites=true';

MongoClient.connect(uri, {useNewUrlParser: true}, function(err, client) {
    //const collection = client.db("test").collection("devices");
    // perform actions on the collection object
     if(err) return console.log(err);
     db = client.db('fintrack');
     app.listen(8080);
     //client.close();
 });

app.set('viewengine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/search', (req, res) => {
    console.log(req.body.input);
    db.collection('companies').findOne({ Ticker: req.body.input}, (err, result) => {
        console.log(result);
        var file = {};
        file.companyName = result.Company;
        file.ticker = result.Ticker;
        file.industry = result.Industry;
        file.companySentiment = ((result.Sentiment1 + 10) + (result.Sentiment2 + 10) + (result.Sentiment3 + 10))/3;
        db.collection('industries').findOne({Industry: file.industry}, (err, other) => {
            file.industrySentiment = (other.Sentiment1 + 10);
            db.collection('financials').findOne({Ticker: file.ticker}, (err, finances) => {
                file.price = finances.Price;
                file.targetMean = finances.TargetMean;
                file.pe = finances.PERatio;
                file.mktcap = finances.MktCaptialization;
                file.de = finances.DebtEquityRatio;
                file.eps = finances.EPS;
                file.roi = finances.ReturnOnEquity;
                file.avgvol = finances.AvgVolume;
                console.log(file);
                res.render('results.ejs', file);
            });
        }); 
    });
});

app.get('/results', (req, res) => {
    res.render('results.ejs');
});

