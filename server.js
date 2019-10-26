/**
 * Created by user on 23/10/2016.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
var request=require("request");

var port = process.env.PORT || 8080;

const nodemailer = require ('nodemailer');
const xoauth2 =  require ('xoauth2') ;
// var url = 'mongodb://root:secure@ds161483.mlab.com:61483/asefall17';
var url = 'mongodb://htata31:tata1994@ds135993.mlab.com:35993/htata';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 's.pallavidesai@gmail.com',
        clientId: '319573095737-2c98cnr7fhjnurbi5es3h907klpd0hpb.apps.googleusercontent.com',
        clientSecret: 'KZ1frHthVQ76hInQK9tjU3Gw',
        refreshToken: '1/ygt_aw7FxteuAfblxMSFrm0wPDRYZT-DNqnnfJLCLwM',
        accessToken: 'ya29.GltFBjWUTyAiDH7USeXj3duqUCq_Opy9N0l2onl-JTmj-Mi1_dN79sb5TVaPSiEjHASA80xoqtJd4DJ79o4JZqPsyW6HiVPmW_DIdVO9ISQlqVqMWPGkfbVR3dZf',
    },
});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get('/', function(req, res) {
    res.render('index.html');
})
app.post('/enroll', function (req, res) {
    MongoClient.connect(url, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        var db= client.db();
        var mailOptions = {
            from: 'Pallavi <s.pallavidesai@gmail.com>',
            to:req.body.username,
            subject: 'Welcome User!!!',
            text: 'You have been succesfully Registered'
        }
        transporter.sendMail(mailOptions, function (err, res) {
            if(err)
            {
                console.log(err);

            }
            else
            {
                console.log('Email is Sent');
            }

        })
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});
app.get('/getpwd', function (req, res){
    var Keywords = req.query.keywords;
    console.log(Keywords);
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("htata");
        var query = { username: Keywords };
        dbo.collection("travelexplorer_cloud").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result[0].password);
            var password = result[0].password;
            var mailOptions = {
                from: 'Pallavi <s.pallavidesai@gmail.com>',
                to:Keywords,
                subject: 'Your Password!!!',
                text: 'Your password is :' + password
            }
            transporter.sendMail(mailOptions, function (err, res) {
                if(err)
                {
                    console.log(err);

                }
                else
                {
                    console.log('Password is Sent');
                }

            })
            db.close();
            res.json(result);
        });
    });
});
app.get('/getData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are "+searchKeywords);
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("htata");
        var query = { username: searchKeywords };
        dbo.collection("travelexplorer_cloud").find(query).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});
app.get('/getCost', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are "+searchKeywords);
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("htata");
        var query = { name: searchKeywords };
        dbo.collection("tst").find(query).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});

//For retrieving list of places
app.get('/getPlaces', function (req, res) {
    var searchKeyword = req.query.searchkey;
    var destination = searchKeyword.substring(0, searchKeyword.indexOf("***"));
    var interest = searchKeyword.substring(searchKeyword.indexOf("***") + 3, searchKeyword.length);
    var interest_value="";
    switch(interest.toString())
    {
        case "select":
            interest="";
            break;
        case "museum":
            Setinterest("museum");
            break;
        case "devotional":
            Setinterest("hindu_temple");
            break;
        case "adventure":
            Setinterest("amusement_park");
            break;
        case "scenic":
            Setinterest("park");
            break;
        case "party":
            Setinterest("night_club");
            break;

    }
    function Setinterest(interest)
    {
        interest_value ="&type="+interest;
    }
    //console.log(interest_value)
    request.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + destination + "+point+of+interest" + interest_value + "&language=en&key=AIzaSyCvnpFKAcsp9bg94zysoNY7QLv-P3SghJ8", function (error, response, body) {
    console.log("Entered body",body);    
    res.send(body);
        //console.log(body);
    });
});

//For retrieving image
// app.get('/getImage', function (req, res) {
//     var photoReference = req.query.searchkey;
//     request.get("https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=" + photoReference + "&key=AIzaSyCvnpFKAcsp9bg94zysoNY7QLv-P3SghJ8", function (error, response, body) {
//         res.send(body);
//         console.log(body);
//     });
// });

//To get the description of the place
app.get('/getDescription', function (req, res) {
    var place_Name = req.query.searchkey;
    request.get("https://kgsearch.googleapis.com/v1/entities:search?query="+place_Name+"&key=AIzaSyCZbMz2VUDfsNIawl7W9W64FpZp8gsoh10&limit=1&indent=True", function (error, response, body) {
        res.send(body);
        //console.log(body);
    });
});

//To get the place details like reviews,weekly hours etc
app.get('/getPlaceData', function (req, res) {
    var placeId = req.query.searchkey;
    request.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeId+"&key=AIzaSyCvnpFKAcsp9bg94zysoNY7QLv-P3SghJ8", function (error, response, body) {
        res.send(body);
        //console.log(body);
    });
});

var insertDocument = function(db, data, callback) {
    db.collection('travelexplorer_cloud').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the asedemo collection.");
        callback();
    });
};

app.get('/updateData', function (req, res) {
    var searchKeywords = req.query.keywords.substring(0,req.query.keywords.indexOf('@@@'));
    var searchKeywords1 = req.query.keywords.substring(req.query.keywords.indexOf('@@@')+3,req.query.keywords.length);
    console.log("Param are searchKeywords"+searchKeywords);
    console.log("Param are searchKeywords"+searchKeywords1);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("htata");
        var query = { username: searchKeywords };
        var newvalues = { $set: {mobileNumber: searchKeywords1} };
        dbo.collection("travelexplorer_cloud").updateOne(query, newvalues, function(err, res) {
            if (err) throw err;
            // console.log(result[0].major);
            console.log("1 document updated");
            db.close();
        });
    });
});

app.post('/insdata', function (req, res) {
    MongoClient.connect(url, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        var db= client.db();
        insertSearchDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});

var insertSearchDocument = function(db, data, callback) {
    db.collection('travelexplorer_cloud_search').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the asedemo collection.");
        callback();
    });
};

var server = app.listen(port,function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});


app.get('/getHistoryData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are "+searchKeywords);
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("htata");
        var query = { username: searchKeywords };
        var mysort = { time: -1 };
        dbo.collection("travelexplorer_cloud_search").find(query).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});

app.get('/getDataEmail', function (req, res) {

    console.log('helllooooooooooooooo' );
    var searchKeywords = req.query.searchkey;
    var searchKeywords1 = req.query.searchkey1;
    var searchKeywords2 = req.query.searchkey2;

    console.log("Param are "+searchKeywords);
    console.log("Param mes are "+searchKeywords1);
    console.log("Param mes are "+searchKeywords2);
    var mailoption = {
        from : searchKeywords,
        to : 'Pallavi <s.pallavidesai@gmail.com>',
        subject : searchKeywords2,
        text : searchKeywords1
    }
    transporter.sendMail(mailoption, function (err , res) {
        if(err)
        {
            console.log('error' );
        }
        else
        {
            console.log('mail sent' );
        }
    })
});