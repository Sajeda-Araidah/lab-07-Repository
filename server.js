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
    });
            res.send(citiesParksData[query]) ; 
        } 
    }
    
// run it on the port 
app.listen(PORT, ()=> console.log(`App is running on Server on port: ${PORT}`));


app.use('*', notFoundHandler); // 404 not found url
app.use(errorHandler);
function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}
function errorHandler(err, request, response, next) {
  response.status(500).send('something is wrong in server');
}