

/*
** Loading CSS
*/
window.onload = function() {
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.type = 'text/css';
  css.href = './map.css';
  document.getElementsByTagName('head')[0].appendChild(css);
  css.onload = add_content;
}


/*
** AJAX loading of JS files
*/
function myRequire(url) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', url, false);
    ajax.onreadystatechange = function() {
        var script = ajax.response || ajax.responseText;
        if (ajax.readyState === 4) {
            switch(ajax.status) {
                case 200:
                    eval.apply(window, [script]);
                    console.log("script loaded: ", url);
                    break;
                default:
                    console.log("ERROR: script not loaded: ", url);
            }
        }
    };
    ajax.send(null);
}

var add_content = function()
{
  var html_to_add = "<div id='map-cluster' class='map'></div>";
  document.getElementById('InSTRiiTExtension').innerHTML = html_to_add;
  myRequire('https://api.tiles.mapbox.com/mapbox.js/v2.2.3/mapbox.js');
  myRequire('https://api.mapbox.com/mapbox.js/plugins/leaflet-locatecontrol/v0.43.0/L.Control.Locate.min.js');
  myRequire('https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js');
  plan();
};


/*
** Checker in right corner of the map
** displays single area of Ivry-sur-Seine (France) + two Paris metro lines
*/
function Checked (mapCluster, L) 
{
  L.control.layers({
    'Vue map': L.mapbox.tileLayer('mapbox.streets').addTo(mapCluster),
    'Vue satellite': L.mapbox.tileLayer('mapbox.satellite')
  }, {
    'Quartier de Celibataires': L.mapbox.featureLayer().loadURL('../example/geojson/celib.geojson'),
    'Ligne Metro': L.mapbox.featureLayer().loadURL('../example/geojson/subway.geojson')
  }).addTo(mapCluster);
}


/*
** Location of the user
*/
function Localisation (mapCluster) 
{
  mapCluster.locate({setView: true, watch: false, maxZoom: 18, timeout: 7000})
  .on('locationfound', function(e)
  {
    L.marker(e.latlng).addTo(mapCluster)
     .bindPopup('Vous êtes ici').openPopup();
  });
}


/*
** Cluster training data via GeoJSON
*/
function LoadData (mapCluster) 
{
  L.mapbox.featureLayer().loadURL('../example/geojson/stations.geojson').on('ready', function(e) 
  {
    var clusterGroup = new L.MarkerClusterGroup();
    e.target.eachLayer(function(layer) 
    {
      clusterGroup.addLayer(layer);
    });
    mapCluster.addLayer(clusterGroup);
  });
}


/*
** Access to the API MapBox
** Map display via web page
*/
function plan ()
{
  var cities = new L.LayerGroup();

  L.mapbox.accessToken = 'pk.eyJ1Ijoic2FoZWJiaGFsbGEiLCJhIjoiY2w2bXg2MXYwMDM3ZzNxcWoxYzdmbjhkeSJ9.5HnzmM4U9a2dpxbBlxO4mA';
  var mapCluster = L.mapbox.map('map-cluster').setView([46.81509864599243, 3.0322265625], 6)
                    .addLayer(L.mapbox.tileLayer('mapbox.streets'))
                    .addControl(L.mapbox.geocoderControl('mapbox.places', {keepOpen: false}));
  Localisation(mapCluster);
  LoadData(mapCluster);
  Checked(mapCluster, L);
}