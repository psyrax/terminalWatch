/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Vibe = require('ui/vibe');

var mainWindow = new UI.Window({
  fullscreen: true
});


//White back
var whiteBackground = new UI.Rect({
  backgroundColor: 'white',
  position: new Vector2(0,0),
  size: new Vector2(144, 84)
});

mainWindow.add(whiteBackground);
//Time element
var timeElement = new UI.TimeText({
  text: '%H : %M',
  position: new Vector2(0, 84),
  size: new Vector2(144, 84),
  font: 'gothic-24-bold',
  textAlign: 'center'
});

mainWindow.add(timeElement);

//Ecobici Element
var ecobiciElement = new UI.Text({
  position: new Vector2(0,0),
  size: new Vector2(144, 48),
  font: 'gothic-14',
  textAlign: 'center',
  text: 'Booting',
  color: 'black'
});

mainWindow.add(ecobiciElement);

//uberElement
var uberElement = new UI.Text({
  position: new Vector2(0,32),
  size: new Vector2(144, 32),
  font: 'gothic-14',
  textAlign: 'center',
  color: 'black'
});

mainWindow.add(uberElement);

mainWindow.show();


getLocationData();


mainWindow.on('click', 'up', function(event){
  getLocationData();
});

function getLocationData(){
  navigator.geolocation.getCurrentPosition(function(pos){
    getBikes(pos);
    getUber(pos);
  });
}

function getBikes(pos){
  ecobiciElement.text('Finding nearby bikes');
  var positionData = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude
  };
  ajax(
    {
      url: 'http://ecobici.me/pb/',
      type: 'json',
      method: 'post',
      data: positionData,
      cache: false
    },
    function(data){
      ecobiciElement.text(data.content);
      Vibe.vibrate('short');
    },
    function(error){
      console.log(error);
    }
  );
  return true;
}
function getUber(pos){
   var positionData = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude
  };
  ajax(
  {
     url: 'http://ecobici.me/uber/',
      type: 'json',
      method: 'post',
      data: positionData,
      cache: false
  },
  function(data){
    var dataJoint = data.join('\n');
    uberElement.text(dataJoint);
    Vibe.vibrate('short');
  },
  function(error){
    console.log(error);
  }
  );
}