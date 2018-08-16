import document from "document";
import * as messaging from "messaging";

// Message is received from companion
messaging.peerSocket.onmessage = evt => {
  let myJson = evt.data;
  console.log("Your closest stop is " + myJson);
};
