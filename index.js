//require the Twilio module
var twilio = require('twilio');
var express = require('express');
var password = require('./password.js')
var fs = require('fs');
var app = express();

var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

app.post('/sendsms',function(req,res){

      res.set('content-type','text/html');

      if(req.body.password !== password)
      {
          res.end('Sorry. Wrong password. <a href="index.html">Go back and try again.</a>');
          return;
      }

      res.end('Request received. Work will be done and report will be texted.');

      // Twilio Credentials
      var accountSid = 'AC65ad4328febc157333d312e67533a65a';
      var authToken = '1699878e13f219f96c5517b92c9794df';

      //create a REST client
      var client = twilio(accountSid, authToken);

    fs.readFile('numbers.txt','utf8',function(err,data){

          var numbers = data.split('\n');

          numbers.forEach(function(number){

              if(number=='' || req.body.message=='')
              return;

              client.messages.create({
                  to: number,
                  from: '+12566641524',
                  body: req.body.message,
              }, function (err, message) {

                  if(err)
                  {
                      console.log(err);
                      return;
                  }

                  console.log(message.sid);
              });

          });

    });

});

app.listen(app.get('port'),function(){
  console.log('Listening on ', app.get('port'));
});
