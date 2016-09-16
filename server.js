var express = require('express');
var app = express();
var request = require('request');
var resultArr = [];
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var urlMongo = 'mongodb://user1:User1234@ds021036.mlab.com:21036/search';
var latest = [];

app.use("/css", express.static(__dirname + "/css"));
app.set('view engine', 'ejs');
app.set('json spaces', 2);
app.get('/', function(req, res) {
    res.render('main');
});

app.get('/latest', function(req,res){
    latest.length = 0;
    MongoClient.connect(urlMongo, function(err, db){
        if (err) {
            res.send('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', urlMongo);
            var log = db.collection('searchlog');
            log.find().toArray(function(err, docs){
            if(err) throw err;
            docs.forEach(function(elem, index){
                  latest.push({"SearchQuery" : elem.searchQuery, "Time": elem._id.getTimestamp()});   
            });
            res.send(latest);
            db.close();    
            });
        }
    });
});

app.get('/imagesearch/:query', function(req, res){
    var page = req.query.offset;
    var para = req.params.query;
    if(para.length !== 0){
        MongoClient.connect(urlMongo, function(err, db){
            if (err) {
        res.send('Unable to connect to the mongoDB server. Error:', err);
        } else {
        console.log('Connection established to', urlMongo);
        var log = db.collection('searchlog');
        var searchObj = {"searchQuery": para};
        log.insert([searchObj], function(err, result){
            if (err) {
                console.log(err);
            } 
        }); 
        
        db.close();
        }
        });
    }
    var url = "https://api.imgur.com/3/gallery/search/?q="+para +"&page="+page;
    var options = {
        url: url,
        headers: {
            Authorization: "Client-ID dbac2de73514bc3"
        }
    };
   request(options, function(err, resp, body) {
        if(err) console.error(err);
        resultArr.length = 0;
        body = JSON.parse(body);
        body.data.forEach(function(object){
            var resultObj = {"title": object.title, "url": object.link, "type": object.type};
            resultArr.push(resultObj);
        }); 
        res.send(resultArr);
}); 
});


var port = Number(process.env.PORT || 8080);
app.listen(port, function(){
    console.log("check");
});