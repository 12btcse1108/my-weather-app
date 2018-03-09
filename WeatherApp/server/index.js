const express = require('express')
const app = express()
const keys = require('./keys/key')

var Forecast = require('forecast');
var request = require('request');
var cors = require('cors');


// Initialize
var forecast = new Forecast({
  service: 'darksky',
  key: keys.darkskyAPI,
  units: 'celcius',
  cache: true,      // Cache API requests
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
    minutes: 27,
    seconds: 45
  }
});

app.use(cors());

// Retrieve weather information from coordinates (Sydney, Australia)
forecast.get([-33.8683, 151.2086], function(err, weather) {
  if(err) return console.dir(err);
  console.dir(weather);
  app.get('/',function(req,res){
    res.send(weather);
  })
});

// Retrieve weather information, ignoring the cache
forecast.get([-33.8683, 151.2086], true, function(err, weather) {
  if(err) return console.dir(err);
  console.dir(weather);
});

var place =
request('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=bengaluru&types=geocode&language=fr&key=AIzaSyBo6aZUg9mqcQ0EaJCwtpv8zLgh4MbQxaM',function(error,res,body){
  if(!error && res.statusCode == 200){
    console.log(body);
    app.get('/google',function(request,response){
      response.send(body)
    })
  }
})

app.listen(5000, ()=> console.log('Example app listening on port 3000!'))
