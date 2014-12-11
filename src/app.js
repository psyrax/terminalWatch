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

var backgroundImage = new UI.Image({
  position: new Vector2(0,0),
  size: new Vector2(144, 168),
  image: 'images/dit_watchface.png',
  compositing: 'invert'
});
mainWindow.add(backgroundImage);
/*
//White back
var whiteBackground = new UI.Rect({
  backgroundColor: 'white',
  position: new Vector2(0,0),
  size: new Vector2(144, 84)
});

mainWindow.add(whiteBackground);*/
//Time element
var timeElement = new UI.TimeText({
  text: '%H : %M',
  position: new Vector2(0, 0),
  size: new Vector2(118, 84),
  font: 'bitham-30-black',
  textAlign: 'left'
});

mainWindow.add(timeElement);

//Ecobici Element
var ecobiciElement = new UI.Text({
  position: new Vector2(4,83),
  size: new Vector2(74, 40),
  font: 'bitham-30-black',
  textAlign: 'center',
  text: '...'
});

mainWindow.add(ecobiciElement);
/*
//uberElement
var uberElement = new UI.Text({
  position: new Vector2(0,32),
  size: new Vector2(144, 32),
  font: 'gothic-14',
  textAlign: 'center',
  color: 'black',
  text: ''
});

mainWindow.add(uberElement);
*/
var menuTransporte = new UI.Menu({
  sections: [{
    title: 'Ecobicis a 500m',
    items: [{
      title: 'Cargando',
    }]
  }]
});

var ecobiciCard = new UI.Card({
  scrollable :true,
  style: 'small'
});



mainWindow.show();


getLocationData();


mainWindow.on('click', 'up', function(event){
  getLocationData();
});

mainWindow.on('click', 'select', function(event){
  menuTransporte.show();
  navigator.geolocation.getCurrentPosition(function(pos){
    getStations(pos);
  });
});



function getLocationData(){
  navigator.geolocation.getCurrentPosition(function(pos){
    getBikes(pos);
    //getUber(pos);
  });
}

function getBikes(pos){
  ecobiciElement.text('...');
  var positionData = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude
  };
  ajax(
    {
      url: 'http://ecobici.me/pbcount/',
      type: 'json',
      method: 'post',
      data: positionData,
      cache: false
    },
    function(data){
      ecobiciElement.text(data);
      Vibe.vibrate('short');
    },
    function(error){
      console.log(error);
    }
  );
  return true;
}
/*function getUber(pos){
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
}*/
function getStations(pos){
   var positionData = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude
  };
  ajax(
  {
     url: 'http://ecobici.me/pbmenu/',
      type: 'json',
      method: 'post',
      data: positionData,
      cache: false
  },
  function(data){
    console.log(data);
    menuTransporte.items(0, data);
    Vibe.vibrate('short');
    menuTransporte.on('select', function(e){
      ecobiciCard.title(e.item.title);
      ecobiciCard.body(e.item.steps);
      ecobiciCard.show();
    });
  },
  function(error){
    console.log(error);
  }
  );
}

