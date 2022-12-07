function ChoixConso(typeconso){
    //svg.selectAll('*').remove();
    console.log(typeconso);
    switch (typeconso) {
      case 'gaz':
        GenerateGraph(CircularGaz);
      break;
      case 'electricite':
        GenerateGraph(CircularElec);
      break;
    
      default:
      break;
    }
  };

  const promiseLoadData = new Promise((resolve, reject) =>{
    d3.csv("../../../Donnees/Donnees2016.csv").then(function(data) {
      for (var i = 0; i<data.length; i++){
        DataCompareElecGaz.push({
          lblRegion : data[i].Libelle_region,
          consoElecAgriculture : parseFloat(data[i].Consommation_électricité_agriculture_MWh),
          consoElecIndustrie : parseFloat(data[i].Consommation_electricite_industrie_MWh),
          consoElecResidentiel : parseFloat(data[i].Consommation_electricite_residentiel_MWh),
          consoElecTertiaire : parseFloat(data[i].Consommation_electricite_tertiaire_MWh),
          consoElecAutre : parseFloat(data[i].Consommation_electricite_autre_MWh),
          consoElecTotal : parseFloat(data[i].Consommation_electricite_totale_MWh),
          consoGazTotal : parseFloat(data[i].Consommation_gaz_totale_MWh)
        });
        
        if (i == data.length - 1)
        {
          resolve('load ok');
          FilterData(DataCompareElecGaz);
        }
      }
    })
  });

// set the dimensions and margins of the graph
const margin = {top: 100, right: 0, bottom: 0, left: 0},
width = 460 - margin.left - margin.right,
height = 460 - margin.top - margin.bottom,
innerRadius = 90,
outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
const svg = d3.select("#circular_barplot")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);

d3.csv("../../../Donnees/Donnees2016.csv").then( function(data) {

// Scales
const x = d3.scaleBand()
  .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
  .align(0)                  // This does nothing
  .domain(data.map(d => d.Libelle_region)); // The domain of the X axis is the list of states.
const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])   // Domain will be define later.
  .domain([0, 2000]); // Domain of Y is from 0 to the max seen in the data

// Add the bars
svg.append("g")
.selectAll("path")
.data(data)
.join("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()     // imagine your doing a part of a donut plot
      .innerRadius(innerRadius)
      .outerRadius(d => y(d['Consommation_agriculture_MWh']))
      .startAngle(d => x(d.Libelle_region))
      .endAngle(d => x(d.Libelle_region) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius))

// Add the labels
svg.append("g")
  .selectAll("g")
  .data(data)
  .join("g")
    .attr("text-anchor", function(d) { return (x(d.Libelle_region) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function(d) { return "rotate(" + ((x(d.Libelle_region) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Consommation_agriculture_MWh'])+10) + ",0)"; })
  .append("text")
    .text(function(d){return(d.Libelle_region)})
    .attr("transform", function(d) { return (x(d.Libelle_region) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "11px")
    .attr("alignment-baseline", "middle")

});