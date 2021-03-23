const express = require('express');
const app = express();
const request = require('request');
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
require('dotenv').config();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4242);
app.use(express.static('public'));

const apiKey = process.env.API_KEY


app.get('/',function(req,res){
  res.render('home');
});

app.get('/popularnews',function(req,res){
      res.render('popularNews');
});

app.get('/popular',function(req,res,next){
  const timeRange = req.query.timeRange
  request('https://api.nytimes.com/svc/mostpopular/v2/viewed/' + 
  timeRange + '.json?api-key=' + apiKey, function(err, response, body){
    if(!err && response.statusCode < 400){
      res.send(body);
    } else {
      if(response){
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});

app.get('/search',function(req,res){
  res.render('search');
});

app.get('/searching',function(req,res,next){
  const searchTerm = req.query.searchTerm
  request('https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + 
  searchTerm + '&api-key=' + apiKey, function(err, response, body){
    if(!err && response.statusCode < 400){
      res.send(body);
    } else {
      if(response){
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});

app.get('/resources',function(req,res){
  res.render('resources');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})