// static/js/logic.js

// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// GeoJSON data for significant earthquakes in the past week
var earthquakeData = {
  "type": "FeatureCollection",
  "metadata": {
    "generated": 1724932855000,
    "url": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson",
    "title": "USGS Significant Earthquakes, Past Week",
    "status": 200,
    "api": "1.10.3",
    "count": 3
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mag": 6.1,
        "place": "60 km SSW of La Libertad, El Salvador",
        "time": 1724882276843,
        "updated": 1724928625064,
        "tz": null,
        "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us6000nncs",
        "detail": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us6000nncs.geojson",
        "felt": 94,
        "cdi": 4.6,
        "mmi": 4.826,
        "alert": "green",
        "status": "reviewed",
        "tsunami": 0,
        "sig": 616,
        "net": "us",
        "code": "6000nncs",
        "ids": ",us6000nncs,",
        "sources": ",us,",
        "types": ",dyfi,ground-failure,losspager,moment-tensor,origin,phase-data,shakemap,",
        "nst": 83,
        "dmin": 0.662,
        "rms": 1.44,
        "gap": 151,
        "magType": "mww",
        "type": "earthquake",
        "title": "M 6.1 - 60 km SSW of La Libertad, El Salvador"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-89.5623, 12.998, 33.882]
      },
      "id": "us6000nncs"
    },
    {
      "type": "Feature",
      "properties": {
        "mag": 5.4,
        "place": "52 km W of Sines, Portugal",
        "time": 1724645498930,
        "updated": 1724924453768,
        "tz": null,
        "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us7000n9fh",
        "detail": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000n9fh.geojson",
        "felt": 2859,
        "cdi": 6.5,
        "mmi": 4.487,
        "alert": "green",
        "status": "reviewed",
        "tsunami": 0,
        "sig": 1099,
        "net": "us",
        "code": "7000n9fh",
        "ids": ",us7000n9fh,",
        "sources": ",us,",
        "types": ",dyfi,losspager,moment-tensor,origin,phase-data,shakemap,",
        "nst": 94,
        "dmin": 1.009,
        "rms": 0.48,
        "gap": 28,
        "magType": "mb",
        "type": "earthquake",
        "title": "M 5.4 - 52 km W of Sines, Portugal"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-9.4651, 38.0067, 17.533]
      },
      "id": "us7000n9fh"
    },
    {
      "type": "Feature",
      "properties": {
        "mag": 6.9,
        "place": "72 km W of Pangai, Tonga",
        "time": 1724628548764,
        "updated": 1724782459998,
        "tz": null,
        "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us7000n9dt",
        "detail": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000n9dt.geojson",
        "felt": 22,
        "cdi": 5.8,
        "mmi": 6.487,
        "alert": "green",
        "status": "reviewed",
        "tsunami": 1,
        "sig": 745,
        "net": "us",
        "code": "7000n9dt",
        "ids": ",pt24238000,at00sisrwj,us7000n9dt,",
        "sources": ",pt,at,us,",
        "types": ",dyfi,ground-failure,impact-link,losspager,moment-tensor,origin,phase-data,shakemap,",
        "nst": 94,
        "dmin": 1.616,
        "rms": 0.83,
        "gap": 24,
        "magType": "mww",
        "type": "earthquake",
        "title": "M 6.9 - 72 km W of Pangai, Tonga"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-175.0411, -19.7545, 106.664]
      },
      "id": "us7000n9dt"
    }
  ],
  "bbox": [-175.0411, -19.7545, 17.533, -9.4651, 38.0067, 106.664]
};

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4;
}

// Function to determine marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#ff5f65' :
           depth > 70 ? '#fca35d' :
           depth > 50 ? '#fdb72a' :
           depth > 30 ? '#f7db11' :
           depth > 10 ? '#dcf400' :
                        '#a3f600';
}

// Add GeoJSON layer to the map
L.geoJson(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
                        "</h3><hr><p>Magnitude: " + feature.properties.mag +
                        "<br>Depth: " + feature.geometry.coordinates[2] + " km</p>");
    }
}).addTo(map);

// Create and add a legend to the map
var legend = L.control({position: "bottomright"});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
