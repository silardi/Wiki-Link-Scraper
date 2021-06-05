const express = require('express');
const app = express();
const port = process.env.PORT || 4222
const request = require('request');
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
require('dotenv').config();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', port);
app.use(express.static('public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/',function(req,res){
  res.render('home');
});

app.get('/searching',function(req,res,next){
  const searchTerm = req.query.searchTerm;
  console.log(searchTerm);

  request('https://en.wikipedia.org/w/api.php?action=parse&page=' + 
  searchTerm + '&prop=links&format=json', function(err, response, body){
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

app.post('/link-check',function(req,res,next){
  const options = {
    url: 'https://cs361-project-brennaco.ue.r.appspot.com',
    json: true,
    body: {
        links: req.body.links
    }
}
console.log(req.body.links);
  request.post(options, function(err, response, body){
      if(!err && response.statusCode < 400){
        console.log(body);
        res.send(body);
      }else{
        console.log(err);
        if(response){
          console.log(response.statusCode);
        }
        next(err);
      }
    });
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