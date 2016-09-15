var express = require('express');
var app = express();
var request = require('request');
var resultArr = [];
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var urlMongo = 'mongodb://user1:User1234@ds021026.mlab.com:21026/search';

app.set('json spaces', 2);
app.get('/imagesearch/:query', function(req, res){
    
    var page = req.query.offset;
    var para = req.params.query;
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