import clock from "clock";
import document from "document";

import * as messaging from "messaging";
import * as fs from "fs";
import * as util from "../common/util";

import { preferences } from "user-settings";
import { display } from "display";
import { today } from 'user-activity';

import {me as device} from "device";

let time1 = document.getElementById("time1");
let time1Shadow = document.getElementById("time1Shadow");
let time2 = document.getElementById("time2");
let time2Shadow = document.getElementById("time2Shadow");
let myTZ = document.getElementById("myTZ");
let ampm = document.getElementById("ampm");
let ampmShadow = document.getElementById("ampmShadow");
let ampm2 = document.getElementById("ampm2");
let ampm2Shadow = document.getElementById("ampm2Shadow");
let TZ2 = document.getElementById("TZ2");
let myCal = document.getElementById("myCal");
const imageBackground = document.getElementById("imageBackground");
let mySteps = document.getElementById("mySteps");
let myFeet = document.getElementById("myFeet");


let loadColor;
let loadOffset;
let loadZone = "   "; 
let whatTime;


imageBackground.href = "brushed.jpeg";
mySteps.style.display = "none";
loadInfo();//Reads info from file

// Update the clock every minute
clock.granularity = "minutes";

function loadInfo() {
  
  try {
    loadColor = fs.readFileSync("myColor.txt","ascii");

    if (loadColor !== undefined) {
      time1.style.fill = loadColor;
      time2.style.fill = loadColor;
      ampm.style.fill = loadColor;
      ampm2.style.fill = loadColor;
    }
 } catch (error) {
     console.log("loadColor error" + error);
   if (error == "Error: Couldn't find file: myColor.txt") {
     console.log("handled");
   } else {
     if (loadColor !== undefined) {
     //on first run-through there are still quotes on the color
     loadColor = util.myColor(loadColor);
     console.log("Refine loadColor <" + loadColor + ">");
     time1.style.fill = loadColor;
     time2.style.fill = loadColor;
     ampm.style.fill = loadColor;
     ampm2.style.fill = loadColor;  
     } else {
       loadColor = "blue";
     }
   }
 }
  try {
    loadOffset = fs.readFileSync("offsetTime.txt","ascii");
    
    if (loadOffset !== undefined) {
      console.log(`new Offset: <${loadOffset}>`);
    } else if (loadOffset === undefined) {
      loadOffset = 0;
    }  
  } catch (error) {
    console.log("No pre-set offset" + error);
    loadOffset = 0;
    
  }
  try {
    loadZone = fs.readFileSync("zoneCode.txt","ascii");
    
    if (loadZone !== undefined) {
      console.log(`new Timezone: <${loadZone}>`);
      myTZ.text = loadZone;
    }
  } catch (error) {
    console.log("No pre-set timezone" + error);
    myTZ.text = "   ";
  }
  
  try {
    whatTime = fs.readFileSync("whatTime.txt","ascii");
    
    if (whatTime !== undefined) {
      console.log(`new whatTime: <${whatTime}>`);
    }
  } catch (error) {
    console.log("whatTime not read, assigned system");
    if (preferences.clockDisplay === "24h"){
      whatTime = "false";
    } else {
      whatTime = "true";
    }
  }
  loadScreen(loadColor, loadOffset, loadZone, whatTime);  //Puts info on watch
}


messaging.peerSocket.onmessage = function (evt) {

  console.log(`onmessage key = <${evt.data.key}>`);
  console.log(`onmsg info = <${evt.data.newValue}>`);
      
  switch (evt.data.key) {
    case 'color':
      let newInfo = util.myColor(evt.data.newValue);
      fs.writeFileSync("myColor.txt",newInfo,"ascii");
      console.log(`myColor file written <${newInfo}>`);
      break;
    case 'offsetTime':     
      let myTemp = JSON.parse(evt.data.newValue);
      let newInfo = myTemp.values[0].value;
      fs.writeFileSync("offsetTime.txt",newInfo,"ascii");
      console.log(`offsetTime file written <${newInfo}>`);
      break;
    case 'zoneCode':
      let newInfo = evt.data.newValue;
      fs.writeFileSync("zoneCode.txt", newInfo, "ascii");
      console.log(`zoneCode written <${newInfo}>`);
      break;
    case 'whatTime':
      let newInfo = evt.data.newValue;
      fs.writeFileSync("whatTime.txt", newInfo, "ascii");
      console.log(`whatTime written ,${newInfo}>`);
      break;
  }
  loadInfo(); //Loads info from file
 }
  

messaging.peerSocket.onopen = function (evt) {
  console.log("App socket open");
} 

messaging.peerSocket.onclose = function (evt) {
  console.log("App socket closed");
}


// Update the text element in resources/index.gui of MyLabel with the current time
function mainClock(loadZone, whatTime) {  

  let today = new Date();
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());
  let myAMPM;
  let timeZone = util.stripQuotes(loadZone);
  let myDevice = device.modelName;
  let bboxTime;
  
  //Force a new timeZone from the companion
  if (Date.now() % 900000 < 100) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send("event");
    } else {
      timeZone = "   ";
    }
  }
  console.log(`Watch date = ${today}`);
  myTZ.text = timeZone;
  
  
  if (whatTime === "false") {
    time1.style.fontSize = 100;
    time1Shadow.style.fontSize = 100;
    ampm.style.display = "none";
    ampmShadow.style.display = "none";
    console.log(`prefs1 ${whatTime}`);
    hours = util.zeroPad(hours);
    time1.text = `${hours}:${mins}`;
    time1Shadow.text = `${hours}:${mins}`;
  } else {
    console.log(`hours before correction ${hours}`);
    ampm.style.display = "inline";
    ampmShadow.style.display = "inline";
    console.log(`pref2 ${whatTime}`);
    if (hours > 12) {
      hours = hours - 12;
      myAMPM = "PM";
    } else if (hours === 12) {
      myAMPM = "PM";
    } else if (hours === 0) {
      myAMPM = "AM";
    } else {
      myAMPM = "AM";
    }
    
    if (hours < 10) {
      if (myDevice = "Ionic") {
        time1.style.fontSize = 100;
        time1Shadow.style.fontSize = 100;
      } else {
        time1.style.fontSize = 95;
        time1Shadow.style.fontSize = 95;
      }
    } else {
      if (myDevice.com === "Ionic") {
        time1.style.fontSize = 100;
        time1Shadow.style.fontSize = 100;
      } else {
        time1.style.fontSize = 85;
        time1Shadow.style.fontSize = 85;      
      }
    }    
    time1.text = `${hours}:${mins}`;
    time1Shadow.text = `${hours}:${mins}`;
    bboxTime = time1.getBBox().right;
    ampm.x = bboxTime + 5;
    ampmShadow.x = bboxTime + 7;
    ampm.text = `${myAMPM}`;
    ampmShadow.text = `${myAMPM}`;
  } 
}

//Update the text element of myUTCLabel with UTC Time
function offsetClock(loadOffset, whatTime) {
  
  let today = new Date(); 
  let mins = today.getMinutes();
  let UTCHours = today.getUTCHours(); 
  let myAMPM;  
  let offsetHours = Number(loadOffset);
  let myDevice = device.modelName;
  
  let bboxTime;
  let halfCheck = 0;
  
  console.log(`loadOffset read <${loadOffset}>`);
  console.log(`offsetHours Before <${offsetHours}>`);
  
  if (offsetHours === 25) {
    offsetHours = 0;
  }
  
  console.log(`UTC Hours <${UTCHours}>`);
  console.log(`offsetHours <${offsetHours}>`);

  if (offsetHours === 5.5 || offsetHours === 4.5 || offsetHours === 9.5 || offsetHours === 3.5) {
    halfCheck = 30;
    console.log("loadOffset ends in 5");
  } else {
    halfCheck = 0;
    console.log("loadOffset ends in 0");
  }
   
  offsetHours = parseInt(offsetHours);
  console.log(`offsetHours parseInt <${offsetHours}>`);
  let myDisp = offsetHours;
  
  if (halfCheck === 30) {
    if (mins < 30) {
      mins = mins + halfCheck;
    } else {
      mins = mins - halfCheck;
      offsetHours = offsetHours + 1;
    }
  }
  
  mins = util.zeroPad(mins);
  
  let addedHours = offsetHours + UTCHours; //this will be the display hours variable
  console.log(`addedHours before <${addedHours}>`);
  
  if (addedHours  < 0) {
    addedHours = addedHours + 24;
  } else if (addedHours > 23) {
    addedHours = addedHours - 24;
  }

  console.log(`addedHours after <${addedHours}>`);
  
  if (whatTime === "false") {
    ampm2.style.display = "none";
    ampm2Shadow.style.display = "none";
    addedHours = util.zeroPad(addedHours);
    if (myDevice = "Ionic") {
      time2.style.fontSize = 70;
      time2Shadow.style.fontSize = 70;
    } else {
      time2.style.fontSize = 60;
      time2Shadow.style.fontSize = 60;
    }
    time2.text = `${addedHours}:${mins}`;
    time2Shadow.text = `${addedHours}:${mins}`;
  } else {
    ampm2.style.display = "inline";
    ampm2Shadow.style.display = "inline";
    if (addedHours > 12) {
      myAMPM = "PM";
      addedHours = addedHours - 12;
    } else if (addedHours < 12) {
      myAMPM = "AM";
    } else if (addedHours === 12) {
      myAMPM = "PM";
    } else if (addedHours === 0) {
      myAMPM = "AM";
    } else {
      console.log("myAMPM is undefined");
    }
    
    if (addedHours >9) {
      if (myDevice = "Ionic") {
        time2.style.fontSize = 70;
        time2Shadow.style.fontSize = 70;
      } else {
        time2.style.fontSize = 60;
        time2Shadow.style.fontSize = 60;      
      }
    } else {
        time2.style.fontSize = 70;
        time2Shadow.style.fontSize = 70;      
      }      
    }
    
    time2.text = `${addedHours}:${mins}`;
    time2Shadow.text = `${addedHours}:${mins}`;
    bboxTime = time2.getBBox().right;
    ampm2.x = bboxTime + 5;
    ampm2Shadow.x = bboxTime + 7;
    ampm2.text = `${myAMPM}`;
    ampm2Shadow.text = `${myAMPM}`; 
 
    if (myDisp === 0) {
      TZ2.text = `GMT Selected`;
    } else {
      if (myDisp > 0) {
        if (halfCheck === 30) {
          TZ2.text = `GMT +${myDisp}:30 Selected`;
        } else {
          TZ2.text = `GMT +${myDisp} Selected`;
        }
      } else {
        if (halfCheck === 30) {
          TZ2.text = `GMT ${myDisp}:30 Selected`;
        } else {
          TZ2.text = `GMT ${myDisp} Selected`;
        }
      }
    }
}

// Uses formatDate function to display my date
function myFormCal()  {
  myCal.text = `${util.formatDate(new Date())}`
} 

function loadScreen(loadColor, loadOffset, loadZone, whatTime) {
  mainClock(loadZone, whatTime);
  offsetClock(loadOffset, whatTime);
  mySteps.style.display = "none";
  myFeet.style.display = "none";  
  myCal.style.display = "inline";  
  myFormCal(); 
}

myCal.onclick = function(e) {
  myCal.style.display = "none";
  mySteps.text = today.adjusted.steps;
  mySteps.style.display = "inline";
//get x coord for mySteps here
  let bboxStep = mySteps.getBBox().right;
  myFeet.x = bboxStep + 5;
  let myDevice = device.modelName;
  if (myDevice === "Ionic") {
    myFeet.y = 120;
  } else {
    myFeet.y = 150;
  }
  myFeet.style.display = "inline";  
}

mySteps.onclick = function(e) {
  mySteps.style.display = "none";
  myFeet.style.display = "none";  
  myCal.style.display = "inline";
}

//  This is where the "execution" part of the clock face starts
clock.ontick = () => loadScreen(loadColor, loadOffset, loadZone, whatTime);