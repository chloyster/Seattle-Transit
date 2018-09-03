// Import the messaging module
import * as messaging from "messaging";
import document from "document";

let stopName = document.getElementById("stopName");
let myPopup = document.getElementById("my-popup");
let popButton1 = myPopup.getElementById("stopButton1");
let popButton2 = myPopup.getElementById("stopButton2");
let myHeader1 = myPopup.getElementById("direction1");
let myHeader2 = myPopup.getElementById("direction2");
let timeDisplay = document.getElementById("displayTimes");
let stopHeader = timeDisplay.getElementById("#header/text");
let stopTime = timeDisplay.getElementById("#copy/text");
let myCode1;
let myName1;
let myCode2;
let myName2;
let whichStop;

popButton1.onclick = function(evt){
  console.log(myCode1);
  myPopup.style.display = "none";
  stopName.text = "Fetching times";
  whichStop = 1;
  fetchTimes();
}

popButton2.onclick = function(evt){
  console.log(myCode2);
  myPopup.style.display = "none";
  stopName.text = "Fetching times";
  whichStop = 2;
  fetchTimes();
}

// Request time data from the companion
function fetchTimes() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    if(whichStop === 1){
      messaging.peerSocket.send({
        command: 'getTimes',
        code: myCode1
      });
    }
    else if(whichStop === 2){
      messaging.peerSocket.send({
        command: 'getTimes',
        code: myCode2
      });
    }
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
  myHeader1.text = data.direction1;
  myHeader2.text = data.direction2;
  myCode1 = data.code1;
  myName1 = data.name1;
  myCode2 = data.code2;
  myName2 = data.name2;
  myPopup.style.display = "inline";
}

function processTimeData(data){
  stopName.text = "";
  if(whichStop === 1){
    stopHeader.text = myName1;
  }
  else{
    stopHeader.text = myName2;
  }
  let currentTime = (new Date).getTime();
  console.log(currentTime + " " + data.time1A);
  if(data.time1A === 0){
    let timeTill = (data.time1B - currentTime);
    stopTime.text = "Bus " + data.time1Route + ": *" + Math.round((timeTill * 0.001) * (1/60)) + " min";
  }
  else{
    let timeTill = (data.time1A - currentTime);
    stopTime.text = "Bus " + data.time1Route + ": " + Math.round((timeTill * 0.001) * (1/60)) + " min";
  }
  timeDisplay.style.display = "inline";
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
    processTimeData(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
