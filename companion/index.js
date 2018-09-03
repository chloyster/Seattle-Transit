// Import the messaging module
import * as messaging from "messaging";
// Import the Geolocation module
import { geolocation } from "geolocation";

var API_KEY = "b3d23c96-9843-4544-b7d4-464a402b7a8d";
var FIRSTCALL = "https://api.pugetsound.onebusaway.org/api/where/stops-for-location.json?key=";
var SECONDCALL = "https://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/";


//get times from One Bus Away
function queryTimes(code) {
  fetch(SECONDCALL + code + '.json?key=' + API_KEY)
  .then(function (response) {
      console.log("recieved response");
      response.json()
      .then(function(data) {
        let beginningCall = data["data"]["entry"]["arrivalsAndDepartures"];
        let myLength = beginningCall.length;
        console.log("Number of departures obtained: " + myLength);
        var stop = {
          type: "secondCall",
          time1A: beginningCall[0]["predictedDepartureTime"],
          time1B: beginningCall[0]["scheduledDepartureTime"],
          time1Route: beginningCall[0]["routeShortName"],
          time2A: beginningCall[1]["predictedDepartureTime"],
          time2B: beginningCall[1]["scheduledDepartureTime"],
          time2Route: beginningCall[1]["routeShortName"]
        }
        // Send the stop data to the device
        console.log("sending time data");
        returnStopData(stop);
      });
  })
  .catch(function (err) {
    console.log("Error fetching stops: " + err);
  });
}


// Fetch the stops from One Bus Away
function queryOBA(lat, long) {
  fetch(FIRSTCALL + API_KEY + '&lat=' + lat + '&lon=' + long)
  .then(function (response) {
      response.json()
      .then(function(data) {
        var stop = {
          type: "firstCall",
          name1: data["data"]["list"][0]["name"],
          name2: data["data"]["list"][1]["name"],
          code1: data["data"]["list"][0]["id"],
          code2: data["data"]["list"][1]["id"],
          direction1: data["data"]["list"][0]["direction"],
          direction2: data["data"]["list"][1]["direction"]
        }
        // Send the stop data to the device
        returnStopData(stop);
      });
  })
  .catch(function (err) {
    console.log("Error fetching stops: " + err);
  });
}

// Send the stop data to the device
function returnStopData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "getStops") {
    geolocation.getCurrentPosition(function(position){
      console.log("Gathered location data");
      queryOBA(position.coords.latitude, position.coords.longitude);
    });
  }
  else if(evt.data.command == "getTimes"){
    console.log("recieved request for times");
    queryTimes(evt.data.code);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}