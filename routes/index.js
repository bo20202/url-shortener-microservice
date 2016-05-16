var mongodb = require("mongodb");
var shortid = require("shortid");
var validUrl = require("valid-url");

var mLab = "mongodb://localhost:27017/url-shortener-microservice";
var mongoClient = mongodb.MongoClient;

var shortener = require("./shortener")

module.exports = {
    index: function(req, res){
     res.render('index');
},
    newUrl: function(req, res){
        var url = req.params.url;
        shortener.setUrl(url, function(err, result){
            if(err) return console.log(err);
            res.json(result);
        })
    },
    redirect: function(req, res){
        var short = req.params.short;
        shortener.getUrl(short, function(err, result){
            if(err) return res.json(err);
            res.redirect(result);
        })
    }
};

