// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Remove all quotation marks from a string
export function stripQuotes(str) {
  return str ? str.replace(/"/g, "") : "";
}

//get the color without quotes
export function myColor(str) {
  return str.substring(1,str.length - 1);
}

//Get the date in the proper order
export function formatDate(date) {
   var monthNames = [
    "Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
   var dayNames = [
    "Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"
  ];  
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var todayIndex = date.getDay();

  return dayNames[todayIndex] + ', ' + day + ' ' + monthNames[monthIndex];
}
