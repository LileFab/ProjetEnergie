// Set the dimensions of the map
var width = 960,
	height = 500;

// Create the map
var map = L.map('map').setView([46.2276, 2.2137], 6);

// Add the OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright"></a>',
}).addTo(map);

// Add a marker on Paris
var parisMarker = L.marker([48.8566, 2.3522]).addTo(map);

// Add a popup to the marker
parisMarker.bindPopup('<b>Paris</b><br>The capital of France'); 

const openP = '<p>';
const closeP = '</p>';
const MWh = ' MWh';

const data = d3.json('pls.json')
  .then(
    function(data) {
      console.log(data[0]);
      data.forEach(e => {
        let xcoord = e[23];
        let ycoord = e[24];
        let dep = e[2];
        let totElec = e[10];
        let totGaz = e[22];
        let current = L.marker([xcoord, ycoord]).addTo(map);
        let pop = openP + 'Département : ' + dep + closeP + openP + 'Consommation totale électricité : ' + totElec + MWh + closeP + openP + 'Consommation totale gaz : ' + totGaz + MWh + closeP
        current.bindPopup(pop);
      });
    }
  );