"use strict";
const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const _ = require('lodash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const books = require('google-books-search');
const strategy = require('./setup-passport');
const shortid = require('shortid');

// setup db
const port = process.env.PORT || 5000;
const MongoClient = mongodb.MongoClient;
const mongolabUri = process.env.MONGODB_URI;
let db;

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ extended: true }))
app.use(cookieParser());
// See express session docs for information on the options: https://github.com/expressjs/session
app.use(session({ secret: process.env.AUTH0_CLIENT_SECRET, resave: false,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Auth0 callback handler
app.get('/callback', passport.authenticate('auth0', { failureRedirect: '/broke' }), (request, response) => {
  console.log(request.query);
  if (!request.user) {
    throw new Error('user null');
  }

  response.redirect("/home");
});

app.post('/api/book', (request, response) => {
  const userId = request.user.id;
  const bookId = request.body.bookId;

  if (userId) {
    response.json({status: 'error', message: 'not logged in'});
    return;
  }

  books.lookup(bookId, (error, result) => {
    if (error) {
      response.json({status: 'error', message: 'problem talking to the google books api'});
    } else if (result) {

      const id = encodeURI(result.title.replace(/ /g,'') + '-' + shortid.generate());
      let book = {
        metadata: result,
        addedBy: userId,
        id,
        tradeStatus: '',  // proposed -> approved
        tradingWith: '',  // id of the user who proposed the trade
        active: true
      };

      db.collection('books').insert(book, (dbError, dbResult) => {
        if (dbError) {
          response.json({status: 'error', message: 'problem adding the book to the database'});
        } else if (dbResult) {
          response.json({status: 'success', message: 'book added to database and ready for trading'});
        }
      })
    }
  })
})

app.post('/api/book/:bookId', (request, response) => {
  const action = request.body.action;
  const bookId = request.params.bookId;
  const userId = request.user.id;

  if (userId) {
    response.json({status: 'error', message: 'not logged in'});
    return;
  }

  db.collection('books').findOne({id: bookId}, (dbError, dbResult) => {
    // oh my god this is the worst
    if (dbError) {
      response.json({status: 'error', message: 'could not talk to the database'});
    } else if (dbResult === null) {
      response.json({status: 'error', message: 'book does not exist'});
    } else if (dbResult) {
      if (!dbResult.tradeStatus) {
        // trade possible
        if (action === 'propose') {
          if (dbResult.addedBy === userId) {
            response.json({status: 'error', message: 'you cannot trade with yourself!'});
          } else {
            db.collection('books').update({id: bookId}, {$set: {tradingWith: userId, tradeStatus: 'proposed'}});
            response.json({status: 'success', message: 'trade successfully proposed'});  // need to attach this to update
          }
        } else if (action === 'approve') {
          response.json({status: 'error', message: 'there is no trade to approve!'});
        } else if (action === 'unpropose') {
          response.json({status: 'error', message: 'there is no trade to unpropose'});
        } else if (action === 'reject') {
          response.json({status: 'error', message: 'there is no trade to reject'});
        }
      } else {
        if (action === 'approve') {
          if (dbResult.tradeStatus === 'proposed') {
            db.collection('books').update({id: bookId}, {$set: {tradeStatus: 'approved'}});
            response.json({status: 'success', message: 'trade successfully accepted'});  // need to attach this to update
          } else {
            response.json({status: 'error', message: 'trade not approved'});
          }
        } else if (action === 'unpropose') {
          if (dbResult.tradingWith === userId) {
            db.collection('books').update({id: bookId}, {$set: {tradingWith: '', tradeStatus: ''}});
            response.json({status: 'success', message: 'trade successfully unproposed'});  // need to attach this to update
          } else {
            response.json({status: 'error', message: 'you cannot modify someone else\'s trade'});
          }
        } else if (action === 'reject') {
          if (dbResult.addedBy === userId) {
            if (dbResult.tradeStatus === 'approved') {
              response.json({status: 'error', message: 'you cannot reject an approved trade'});
            } else {
              db.collection('books').update({id: bookId}, {$set: {tradingWith: '', tradeStatus: ''}});
              response.json({status: 'succes', message: 'current trade proposal has been rejected'});
            }
          } else {
            response.json({status: 'error', message: 'you cannot modify someone else\'s trade'});
          }
        } else {
          response.json({status: 'error', message: 'book is already being traded'});
        }
      }
    }
  })
})

app.delete('/api/book/:bookId', (request, response) => {
  const bookId = request.params.bookId;
  const userId = request.user.id;

  if (userId) {
    response.json({status: 'error', message: 'not logged in'});
    return;
  }




  db.collection('books').findOne({id: bookId}, (dbError, dbResult) => {
    if (dbError) {
      response.json({status: 'error', message: 'could not talk to the database'});
    } else if (dbResult === null) {
      response.json({status: 'error', message: 'book does not exist'});
    } else if (dbResult) {
      if (dbResult.addedBy === userId) {
        db.collection('books').remove({id: bookId}, {justOne: true}, (dbError, dbResult) => {
          if (dbError) {
            response.json({status: 'error', message: 'could not talk to the database'});
          } else if (dbResult) {
            response.json({status: 'success', message: 'book deleted'});
        }})
      } else {
        response.json({status: 'error', message: 'you cannot delete this book because you did not add it'});
      }
    }
  })
})

app.get('/api/books', (request, response) => {
  db.collection('books').find(null, {_id: 0}).toArray((dbError, dbResult) => {
    if (dbError) {
      response.json({status: 'error', message: 'could not talk to the database'});
    } else if (dbResult) {
      response.json({status: 'success', message: 'got books', books: dbResult})
    }
  })
})

app.post('/api/user/:userId', (request, response) => {
  // check request.user.id ===  request.params.userId!!!!!
  const city = request.body.city;
  const country = request.body.country;
  const otherInfo = request.body.otherInfo;
  const userId = request.user.id;

  if (userId !== request.params.userId) {
    response.json({status: 'error', message: 'not logged in'});
    return;
  }

  db.collection('users').update({id: userId}, {$set: {city, country, otherInfo}}, {upsert: true}, (dbError, dbResult) => {
    if (dbResult) {
      response.json({status: 'success', message: 'user info updated'});
    } else if (dbError) {
      response.json({status: 'error', message: 'could not talk to the database'});
    }
  });
})

app.get('/api/user/:userId', (request, response) => {
  const userId = request.params.userId;

  db.collection('users').findOne({id: userId}, (dbError, dbResult) => {
    if (dbError) {
      response.json({status: 'error', message: 'could not talk to the database'});
    } else if (!dbResult) {
      response.json({status: 'error', message: 'user not found'});
    } else if (dbResult) {
      response.json({
        status: 'success',
        message: 'user found',
        user: {
          city: dbResult.city,
          country: dbResult.country,
          otherInfo: dbResult.otherInfo,
        }
      })
    }
  })
})

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port);
})
