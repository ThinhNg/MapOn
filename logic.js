

// An array containing all of the information needed to create city and state markers
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  console.log(data)

  var earthquakeData=data.features;



var EarthquakeMarkers = [];

// Loop through locations and circle elements
for (var i = 0; i < earthquakeData.length; i++) {
  var long = earthquakeData[i].geometry.coordinates[0]
  var lat = earthquakeData[i].geometry.coordinates[1]
  var mag = earthquakeData[i].properties.mag
  var color = 'green'
  if (mag<1){
    color = 'green'
    
  }
  else if (mag<2) {
    color = 'yellow'
  }
  else if (mag<3) {
    color ='orange'
  }
  else if (mag<4) {
    color ='red'
  }
  else {
    color ='purple'
  }


  EarthquakeMarkers.push(
    L.circle([lat,long], {
      stroke: false,
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      radius: mag*10000
    }).bindPopup("<h2> Magnitude : " + earthquakeData[i].properties.mag +
    "</h2><hr><h3>" + earthquakeData[i].properties.place +
      "</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>")
  );
  }

  var eGroup=L.layerGroup(EarthquakeMarkers)
  // Add the earthquakes layer to a marker cluster group.
  // Sending our earthquakes layer to the createMap function

  createMap(eGroup)
});


function createMap(eGroup){ 

// Define variables for our base layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});


// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create an overlay object
var overlayMaps = {
  "Earthquakes": eGroup
};

// Define a map object
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [darkmap, eGroup],
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
}