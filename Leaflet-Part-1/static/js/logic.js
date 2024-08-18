// Retreive USGC earthquake data in JSON format
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Create the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: .3,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };

// Data markers for the depth of the earthquake by color
    }
    function mapColor(depth) {
        switch (true) {
            case depth > 90:
                return "##0f4d0f";
            case depth > 70:
                return "#5ce65c";
            case depth > 50:
                return "#849e00";
            case depth > 30:
                return "#8bc462";
            case depth > 10:
                return "#008000";
            default:
                return "#ccffcc";
        }
    }
// Data markers for the size of the earthquare magnitude
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }

        return mag * 3;
    }

// Add earthquake data to the map
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

// Popups that provide additional information about the earthquake when marker is clicked
        onEachFeature: function (feature, layer) {
          layer.bindPopup(`<h4>Earthquake Details</h4><hr/>\
          <small><b>Date/Time:</b> ${new Date(feature.properties.time).toUTCString()}<br/>\
          <b>Location:</b> ${feature.properties.place}<br/>\
          <b>Lat:</b> ${feature.geometry.coordinates[1]}<br/>\
          <b>Long:</b> ${feature.geometry.coordinates[0]}<br/>\
          <b>Depth:</b> ${feature.geometry.coordinates[2]}<br/>\
          <b>Magnitude:</b> ${feature.properties.mag}<br/>\
          <a target="_blank" href=${feature.properties.url}>USGS Eventpage</a></small>`
          )}
    }).addTo(myMap);

// Add Legend 
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  for (let i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap)
});