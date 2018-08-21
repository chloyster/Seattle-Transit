// Import the messaging module
import * as messaging from "messaging";
// Import the Geolocation module
import { geolocation } from "geolocation";

var API_KEY = "b3d23c96-9843-4544-b7d4-464a402b7a8d";
var ENDPOINT = "https://api.pugetsound.onebusaway.org/api/where/stops-for-location.json?key=";

// Fetch the stops from One Bus Away
function queryOBA(lat, long) {
  fetch(ENDPOINT + API_KEY + '&lat=' + lat + '&lon=' + long)
  .then(function (response) {
      response.json()
      .then(function(data) {
        var stop = {
          name: data["data"]["list"][0]["name"]
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
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}