'use strict';

require("dotenv").config();
 
const PORT = process.env.PORT || 3000; // convert this to an envirment variable 



// my application dependencies
const express = require('express'); // node.js framework.
const cors = require('cors'); // cross origin resources sharing
const superAgent =require('superagent');
const app = express();
 //initalize express app

 const pg = require('pg');

app.use(cors()); // use cors

function LoctionObj (name , lat ,longitude , formatted_query){
this.name = name ;
this.lat= lat;
this.longitude= longitude;
this.formatted_query =formatted_query;

}

function WeatherObj ( data ,forcast){
    this.data =data;
    this.forcast = forcast;
    
    
}

function ParksObj (name , address ,description,url ,fee){
        this.name = name ;
        this.address= address;
        this.description = description;
        this.url=url;
        this.fee =fee;
        
  }

//create a get route for location

// localhost:3000/location client will request from this
app.get('/location', handleLocation);

app.get('/weather' ,handleWeather);

app.get ('/park' , handlePark )


// express will return 404 not found from its internal error handler
// 500 for internal server error: from express handler

function handleLocation(request, response) {
    const query = request.query.city; 
    const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${query}&format=json`;
    
    superAgent.get(url).then(data => {
        let LocObj = new LoctionObj (query,data.body[0].lat,data.body[0].lon, data.body[0].display_name);
        response.send(LocObj);

    }).catch(error =>{console.log(error)});
    

}


function handleWeather(request,response){
      const queryWea=request.query.search_query;
      const urlWea=`http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERS_API_KEY}&city=${queryWea}&country=US&format=json`;
      superAgent.get(url).then(data => {
    let weaArray = data.body.data.map (elemant =>{
      return new WeatherObj(elemant);
        }) 
        
        response.send(weaArray);

    }); //.catch(error =>{console.log(error)});
    }


      function handlePark(request, response) {
    

      


      let query = req.query.search_query;
    //check if the data already exists or not
    if (!citiesParksData[query]) {
        // if not there get the data from the source
        superagent.get(`https://developer.nps.gov/api/v1/parks?parkCode=${query}&api_key=${process.env.PARKS_API_KEY}`).then(data => {
            let info = data.body.data.slice(0, 11);


            let obj = info.map(elem => new ParksObj(elem.fullName, Object.values(elem.addresses[0]).join(','), elem.entranceFees[0].cost, elem.description, elem.url));
            // return the response
            citiesParksData[query] = obj;
            res.send(citiesParksData[query])  
        } 

// run it on the port 
app.listen(PORT, ()=> console.log(`App is running on Server on port: ${PORT}`))


app.use('*', notFoundHandler); // 404 not found url
app.use(errorHandler);
function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}
function errorHandler(err, request, response, next) {
  response.status(500).send('something is wrong in server');
}

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route Definitions
app.get('/location', locationHandler);
// app.get('/restaurants', restaurantHandler);
// app.get('/places', placesHandler);

// Express has an internal error handler.
// so this means if you did not create your own. 
// express handler will respond
app.use('*', notFoundHandler); // 404 not found url
 
app.use(errorHandler);

function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}

function errorHandler(err, request, response, next) {
  response.status(500).send('something is wrong in server');
}


const myLocalLocations = {};
function locationHandler(request, response) {
  // causing an error by purpose to run the error handler
  // let x;
  // x.push("asd");
  let city = request.query.city;
  console.log("request.query:", request.query)
  // instead of reading from .json file
  // we will be requesting data from another external API
  // if (myLocalLocations(url))
  
  // caching locally in a variable, to avoid some extra work
  console.log(myLocalLocations);

  if (myLocalLocations[city]) {
    console.log("2.from my local data")
    response.send(myLocalLocations[city]);
  
  } else {
    
    console.log("1.from the location API")
    let key = process.env.GEOCODE_API_KEY;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily${key}&q=${city}&format=json&limit=1`;
    superagent.get(url).then(res=> {
      // use response.body to get the response data itself
      // console.log(res.body);
      const locationData = res.body[0];
      const location = new Location(city, locationData);
      // console.log(location); // give me the first object in array
      myLocalLocations[city] = location;
      response.send(location);

    }).catch((err)=> {
      console.log("ERROR IN LOCATION API");
      console.log(err)
    });
  }
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}


function restaurantHandler(request, response) {
  // const url = 'https://developers.zomato.com/api/v2.1/geocode';
}

function Restaurant(entry) {
  this.restaurant = entry.restaurant.name;
  this.cuisines = entry.restaurant.cuisines;
  this.locality = entry.restaurant.location.locality;
}

function placesHandler(request, response) {

  // const lat = request.query.latitude;
  // const lng = request.query.longitude;
  // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`;

}

function Place(data) {
  this.name = data.text;
  this.type = data.properties.category;
  this.address = data.place_name;
}


// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));

