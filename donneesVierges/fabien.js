console.log("debut")

const path = d3.geoPath()

const width = 1000,
	height = 800;

const projection = d3.geo
	.conicConformal()
	.center([2.454071, 46.279229])
	.scale(2600)
	.translate([width / 2, height / 2]);

path.projection(projection)

const svg = d3
	.select('#map')
	.append('svg')
	.attr('id', 'svg')
	.attr('width', width)
	.attr('height', height);

const deps = svg.append("g")

d3.json('conso-epci-annuelle_2020.geojson').then(function (geojson) {
	deps
		.selectAll('path')
		.data(geojson.features)
		.enter()
		.append('path')
		.attr('d', path);
});



let div = d3
	.select('body')
	.append('div')
	.attr('class', 'map-tooltip')
	.style('opacity', 0);

  d3.json('conso-epci-annuelle_2020.geojson').then(function (data) {
		data.features.forEach(prop => console.log(prop.code_regions));
	});

console.log("fin")