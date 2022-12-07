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

// Read the CSV file
const data = d3.csv('Donnees2016.csv', function (d) {
  const arrayCoordx = [];
  const arrayCoordy = [];
  arrayCoordx.push(d.coordx)
  const uniqueArrayx = arrayCoordx.filter(
		(item, index) => arrayCoordx.indexOf(item) === index,
	);

  arrayCoordy.push(d.coordy);
  const uniqueArrayy = arrayCoordy.filter(
    (item, index) => arrayCoordy.indexOf(item) === index,
  );
  for (let i = 0; i < uniqueArrayx.length; i++) {
    if (
			typeof uniqueArrayx[i] === undefined &&
			typeof uniqueArrayy[i] === undefined
		) {
      console.log('error no coord');
		}
    else {
      console.log("+1 marker");
      var current = L.marker([Number(uniqueArrayx[i]), Number(uniqueArrayy[i])]).addTo(map);
      var pop = d.Libelle_departement;
      current.bindPopup(pop)
    }
  }
});
