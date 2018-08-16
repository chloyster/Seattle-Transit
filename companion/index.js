import * as messaging from "messaging";
import { geolocation } from "geolocation";
// Listen for the onopen event
//messaging.peerSocket.onopen = function() {
  //messaging.peerSocket.send("hello");
  
//}


geolocation.getCurrentPosition(function(position){
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  
  let url = 'https://api.pugetsound.onebusaway.org/api/where/stops-for-location.json?key=b3d23c96-9843-4544-b7d4-464a402b7a8d';

  url += '&lat=';
  url += lat;
  url += '&lon=';
  url += long;

  console.log(url);
  fetchSomething(url);
});

async function fetchSomething(url) {
  console.log('starting...');
  const response = await fetch(url);
  const responseJSON = await response.json();
  
  messaging.peerSocket.onopen = function(){
    messaging.peerSocket.send(responseJSON.data.list[0].name);
  }
}

//fetchSomething(url);