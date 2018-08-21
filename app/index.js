// Import the messaging module
import * as messaging from "messaging";
import document from "document";

let time = document.getElementById("stopName");

// Request stop data from the companion
function fetchStops() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'getStops'
    });
  }
}

// Display the stop data received from the companion
function processStopData(data) {
  console.log("Your closest stop is: " + data.name);
  time.text = data.name;
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch stops when the connection opens
  fetchStops();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    processStopData(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Fetch the weather every 30 minutes
setInterval(fetchStops, 30 * 1000 * 60);
