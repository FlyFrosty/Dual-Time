import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { device } from "peer";
import { Image } from "image";



// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

//Listen to see if it is time to check the time zone
messaging.peerSocket.onmessage = function(evt) {
  sendTZ();
};

function sendTZ() {
  let myTZ = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];  
  let data = {
    key: "zoneCode",
    newValue: myTZ
  }
  console.log(`full date ${new Date()}`);
  console.log(`newValue ${data.newValue}`);
  sendVal(data);
};


// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
  sendTZ();
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      sendVal(data);
    };
  }; 
  sendTZ();
}

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}