var mongodb = require("mongodb");
var shortid = require("shortid");

var validUrl = require("valid-url");

var mLab = "mongodb://localhost:27017/url-shortener-microservice";
var mongoClient = mongodb.MongoClient;

function setUrl(url, callback){
    mongoClient.connect(mLab, function(err, db){
        if(err) return callback(err);
        var links = db.collection("links");
        
        if(validUrl.isUri(url)){
            console.log(url);
            var shortCode = shortid.generate();
            var newUrl = {url: url, short: shortCode};
            links.insert(newUrl);
            db.close();
            return callback(null, {url: url, short: shortCode});
        }
        else{
            db.close();
            return callback(null, "url is not valid");
        }
    })
}

function getUrl(shortUrl, callback){
    mongoClient.connect(mLab, function(err, db){
        if(err) return callback(err);
        var links = db.collection("links");
        links.findOne({short: shortUrl}, {fields:{url:1, _id: 0}}, function(err, result){
            if(err) return callback(err);
            if(!result){
                db.close();
                return callback("Url is not in database");
            }
            db.close();
            return callback(null, result.url);
        })
    })
}

module.exports = {
    setUrl: setUrl,
    getUrl: getUrl
};