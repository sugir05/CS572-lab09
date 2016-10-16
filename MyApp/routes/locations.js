var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/add', function(req, res, next) {
    res.render('locations', { validate: '', name: '', city: '', type: '', long: '', lat: '', visible: 'hidden' });
});
router.post('/add', function(req, res, next) {
    req.assert('name', 'required').notEmpty();
    req.assert('city', 'required').notEmpty();
    req.assert('type', 'required').notEmpty();
    req.assert('long', 'required').notEmpty();
    req.assert('lat', 'required').notEmpty();
    var errors = req.validationErrors();
    if (errors) res.render('locations', { validate: 'Fields shold not be empty', name: '', city: '', type: '', long: '', lat: '', visible: 'hidden' });
    else {
        var MongoClient = require('mongodb').MongoClient;
        // Connect to the db
        MongoClient.connect("mongodb://localhost:27017/mondayTest", function(err, db) {
            if (err) { return console.dir(err); }

            var collection = db.collection('lab9');

            var con = {
                name: req.body.name,
                city: req.body.city,
                location: {
                    type: req.body.type,
                    long: req.body.long,
                    lat: req.body.lat
                }
            }
            collection.insert(con, function(err, doc) {
                if (err) { return console.dir(err); }
                console.dir("Success " + doc.name);
                res.render('locations', { validate: 'Thank You', name: req.body.name, city: req.body.city, type: req.body.type, long: req.body.long, lat: req.body.lat, visible: 'visible' });

            });
        });

    }
});
router.get('/search', function(req, res, next) {
    res.render('search', { validate: '', name: '', city: '', type: '', long: '', lat: '', visible: 'hidden' });
});

router.post('/search', function(req, res, next) {
    req.assert('long', 'required').notEmpty();
    req.assert('lat', 'required').notEmpty();
    var errors = req.validationErrors();
    if (errors) res.render('search', { validate: 'Longitude and Latitude shold not be empty', name: '', city: '', type: '', long: '', lat: '', visible: 'hidden' });
    else {
        var MongoClient = require('mongodb').MongoClient;
        // Connect to the db
        MongoClient.connect("mongodb://localhost:27017/mondayTest", function(err, db) {
            if (err) { return console.dir(err); }

            var collection = db.collection('lab9');

            var query = { "location.lat": req.body.lat, "location.long": req.body.long, }
            collection.findOne(query, function(err, doc) {
                if (err) { return console.dir(err); }
                console.log("Success " + doc.name);
                res.render('search', { validate: '', name: doc.name, city: doc.city, long: doc.location.long, lat: doc.location.lat, visible: 'visible' });

            });
        });

    }
});
module.exports = router;