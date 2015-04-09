var Twitter = require('twitter');
var express = require('express');
var app = express();
var expressSession = require('express-session');
var mongoose = require('mongoose');
var ejs = require('ejs');
var async = require('async');
var request = require('request');
var url = require('url');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var client = new Twitter({
});
var connect = mongoose.connect('mongodb://localhost/twitteruser', function(err) {})
var db = mongoose.connection;
//App uses
db.once('open', function() {
  console.log('db is open')
});

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/view');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(expressSession({
  secret: process.env.SESSION_SCRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/vendor'));
passport.use(new TwitterStrategy({
    consumerKey: client.options.consumer_key,
    consumerSecret: client.options.consumer_secret,
    callbackURL: 'http://192.168.110.130:8080/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    console.log(client.options.access_token_key);
    twittercollection.findOne({
      'username': profile.username
    }, function(err, user) {
      if (!user) {
        var insertdata = new twittercollection({
          username: profile.username,
          idDisplay: profile.id,
          twitterTokenSecret: tokenSecret,
          twitterToken: token
        })
        insertdata.save(function(err) {

          return done(null, profile);
        })
      } else {
        return done(null, profile);
      }
    });
  }
));
var twitterIdSchema = mongoose.Schema({
 id:{type:Number,index:{unique:true,dropDups:true}},
 retweet:Boolean,
 favorite:Boolean,
 destroy:Boolean,
 screen_name:String,
 _id:false
})
var twitterSchema = mongoose.Schema({
  username: String,
  twitterId: [twitterIdSchema],
  twitterTokenSecret: String,
  twitterToken: String,
  idDisplay: String
})

var twittercollection = mongoose.model('twitterinformation', twitterSchema);
app.get('/auth/twitter', passport.authenticate('twitter'), function(req, res) {});

app.get('/getids', function(req, res) {
  var query = twittercollection.where({
    username: req.session.passport.user.username
  })
  query.find(function(err, data) {
    if (data) {
      var twitteridarray = [];
      var twitterinfoarray = [];
      for (var i = 0; i < data[0].twitterId.length; i++) {
        twitteridarray.push(data[0].twitterId[i].id);
        var userobj = {
          id: data[0].twitterId[i].id,
          retweet: data[0].twitterId[i].retweet,
          favorite: data[0].twitterId[i].favorite,
          destroy: data[0].twitterId[i].destroy,
          screen_name: data[0].twitterId[i].screen_name
        }
        twitterinfoarray.push(userobj);

      }

      return gettwittercontent(twitteridarray, twitterinfoarray);
    }
  })

  function gettwittercontent(twitterids, info) {
    client.get('users/lookup.json?user_id=' + twitterids, function(err, request, response) {
      var parsebody = JSON.parse(response.body);
      console.log(parsebody);
      for (var i = 0; i < parsebody.length; i++) {
        if (parsebody[i].id == info[i].id) {
          parsebody[i].favorite = info[i].favorite;
          parsebody[i].retweet = info[i].retweet;
          parsebody[i].destroy = info[i].destroy;
          parsebody[i].screen_name  = info[i].screen_name;
            
        }
      }
      res.send(parsebody);
    });
  }

});
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/', function(req, res) {
  res.render("index.html");
});

app.get('/getcontent', function(req, res) {
  var favoritesids = [];
  var retweetsids = [];
  var noretweetsids = [];
  var twittersids = [];
  var newurls = [];
  var query = twittercollection.where({
    username: req.session.passport.user.username
  })
  query.findOne(function(err, idArray) {
    if (err) console.log(err);
    if (idArray) {
      for (var i = 0; i < idArray.twitterId.length; i++) {
        twittersids.push(idArray.twitterId[i].id)
        if (idArray.twitterId[i].retweet == false) {
          noretweetsids.push(idArray.twitterId[i].id);
        } else {
          retweetsids.push(idArray.twitterId[i].id);
        }

        if (idArray.twitterId[i].favorite == true) {
          favoritesids.push(idArray.twitterId[i].id);
        }
      }

      for (var j = 0; j < favoritesids.length; j++) {
        newurls.push('favorites/list.json?include_entities=false&user_id=' + favoritesids[j]);
      }
      for (var l = 0; l < retweetsids.length; l++) {
        newurls.push('statuses/user_timeline.json?include_entities=true&include_rts=true&user_id=' + retweetsids[l]);
      }

      for (var k = 0; k < noretweetsids.length; k++) {
        newurls.push('statuses/user_timeline.json?include_entities=true&include_rts=false&user_id=' + noretweetsids[k]);
      }
    }
    async.map(newurls, getcontent, completelydone);
  });

  function getcontent(url, callback) {
    client.get(url, function(error, request, response) {
        var tester1 = JSON.parse(response.body);
      if(response.request.uri.pathname == '/1.1/favorites/list.json'){
        for(var z  = 0; z < tester1.length;z++){
          var searchurl = url.match(/user_id=(\d+)/) 
          tester1[z].favorited_id = searchurl[1];
       }
      }

      callback(null, tester1);
    });
  }

  function completelydone(error, result) {
   res.send(result);
  }
});

app.get('/userinfo', function(req, res) {
  client.get('account/verify_credentials.json', function(error, request, response) {
    res.send(response);
  });
})

app.get('/friends/:number', function(req, res) {
  console.log(req.params.number);
  client.get('friends/list.json?cursor=' + req.params.number + '&screen_name=' +req.session.passport.user.username + '&skip_status=true&include_user_entities=false&count=20', function(error, request, response) {
 console.log(response);
 res.send(response);
  });
});

app.post('/displayChanges', bodyParser.json(), function(req, res) {
  var userobj = {
    id: req.body.id,
    retweet: req.body.retweet,
    favorite: req.body.favorite,
    destroy: req.body.destroy
  }
  if (req.body.destroy == true) {
    twittercollection.findOneAndUpdate({
      username: req.session.passport.user.username
    }, {
      $pull: {
        'twitterId': {
          id: req.body.id_str
        }
      }
    }, function(err, data) {})
  } else {
    twittercollection.findOneAndUpdate({
      username: req.session.passport.user.username,
      'twitterId.id': req.body.id_str
    }, {
      $set: {
        'twitterId.$.retweet': req.body.retweet,
        'twitterId.&.favorite': req.body.favorite
      }
    }, function(err, data) {
      console.log(err);
    })
  }
});

app.post('/friends', bodyParser.json(), function(req, res) {
      var userstuff = {
        screen_name:req.body.screen_name,
        id: req.body.id_str,
        retweet: req.body.retweet,
        favorite: req.body.favorite,
        destroy: req.body.destroy
        }
    twittercollection.findOneAndUpdate({
      username: req.session.passport.user.username
    }, {
      $addToSet:{'twitterId':userstuff},
    }, function(err) {
      console.log(err)
    });

});

app.listen(8080, function() {
  console.log("listening on 8080!");
});
