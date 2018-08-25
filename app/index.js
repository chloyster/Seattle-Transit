// Import the messaging module
import * as messaging from "messaging";
import document from "document";

let stopName = document.getElementById("stopName");
let myPopup = document.getElementById("my-popup");
let popButton1 = myPopup.getElementById("stopButton1");
let popButton2 = myPopup.getElementById("stopButton2");
let myCode1;

popButton1.onclick = function(evt){
  console.log(myCode1);
  myPopup.style.display = "none";
  stopName.text = "Fetching times";
  fetchTimes();
}

// Request time data from the companion
function fetchTimes() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'getTimes',
      code: myCode1
    });
  }
}

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
  console.log("Your closest stop is: " + data.name1);
  stopName.text = "";
  popButton1.text = data.name1;
  popButton2.text = data.name2;
  myCode1 = data.code1;
  myPopup.style.display = "inline";
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch stops when the connection opens
  fetchStops();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.type === "firstCall") {
    processStopData(evt.data);
  }
  else{
    console.log(evt.data.time1);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
