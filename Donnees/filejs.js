var DataElecGaz = [];

var DataGazSecteurAgri = [];
var DataGazSecteurIndus = [];
var DataGazSecteurResi = [];
var DataGazSecteurTerti = [];
var DataGazSecteurAutre = [];

var DataElecSecteurAgri = [];
var DataElecSecteurIndus = [];
var DataElecSecteurResi = [];
var DataElecSecteurTerti = [];
var DataElecSecteurAutre = [];

var DataElecGazParRegion = [];
var ListeDataParRegion = [];


const promiseLoadData = new Promise((resolve, reject) =>{
  d3.csv("Donnees2016.csv").then(function(data) {
    for (var i = 0; i<data.length; i++){
      DataElecGaz.push({
        lblRegion : data[i].Libelle_region,
        consoElecAgriculture : parseFloat(data[i].Consommation_électricité_agriculture_MWh),
        consoElecIndustrie : parseFloat(data[i].Consommation_electricite_industrie_MWh),
        consoElecResidentiel : parseFloat(data[i].Consommation_electricite_residentiel_MWh),
        consoElecTertiaire : parseFloat(data[i].Consommation_electricite_tertiaire_MWh),
        consoElecAutre : parseFloat(data[i].Consommation_electricite_autre_MWh),
        consoGazAgriculture : parseFloat(data[i].Consommation_gaz_agriculture_MWh),
        consoGazIndustrie : parseFloat(data[i].Consommation_gaz_industrie_MWh),
        consoGazResidentiel : parseFloat(data[i].Consommation_gaz_residentiel_MWh),
        consoGazTertiaire : parseFloat(data[i].Consommation_gaz_tertiaire_MWh),
        consoGazAutre : parseFloat(data[i].Consommation_gaz_autre_MWh)
      });
      
      if (i == data.length - 1)
      {
        resolve('load ok');
        FilterData(DataElecGaz);
      }
    }
  })
});

function FilterData(data){
  // Filtrage des données par années
  // Cumule des données des département par region
  ListeRegion = [...new Set(data.map(data => data.lblRegion))];
  console.log(ListeRegion);
  // Création des tableau de données avec cumule par département
  
  var groupbyRegion = d3.group(data, d => d.lblRegion);
  let dataRegion = [];
  
  console.log(groupbyRegion);
  
  ListeRegion.forEach(region => {
    let LblRegion;
    
    let totalElecAgriculture = 0;
    let totalElecIndustrie = 0;
    let totalElecResidentiel  = 0;
    let totalElecTertiaire = 0;
    let totalElecAutre = 0;
    
    let totalGazAgriculture = 0;
    let totalGazIndustrie = 0;
    let totalGazResidentiel  = 0;
    let totalGazTertiaire = 0;
    let totalGazAutre = 0;
    
    groupbyRegion.get(region).forEach(elem => {
      
      totalElecAgriculture += elem.consoElecAgriculture;
      totalElecIndustrie += elem.consoElecIndustrie;
      totalElecResidentiel += elem.consoElecResidentiel;
      totalElecTertiaire += elem.consoElecTertiaire;
      totalElecAutre += elem.consoElecAutre;
      totalGazAgriculture += elem.consoGazAgriculture;
      totalGazIndustrie += elem.consoGazIndustrie;
      totalGazResidentiel += elem.consoGazResidentiel;
      totalGazTertiaire += elem.consoGazTertiaire;
      totalGazAutre += elem.consoGazAutre;
      LblRegion = elem.lblRegion;
    });
    
    dataRegion.push({lblRegion : LblRegion,
      consoElecAgriculture : parseFloat(totalElecAgriculture),
      consoElecIndustrie : parseFloat(totalElecIndustrie),
      consoElecResidentiel : parseFloat(totalElecResidentiel),
      consoElecTertiaire : parseFloat(totalElecTertiaire),
      consoElecAutre : parseFloat(totalElecAutre),
      consoGazAgriculture : parseFloat(totalGazAgriculture),
      consoGazIndustrie : parseFloat(totalGazIndustrie),
      consoGazResidentiel : parseFloat(totalGazResidentiel),
      consoGazTertiaire : parseFloat(totalGazTertiaire),
      consoGazAutre : parseFloat(totalGazAutre)
    });
  });
  
  console.log(dataRegion); 
  DataElecGazParRegion = dataRegion;
  
  DataElecGazParRegion.forEach(region => {
    DataElecSecteurAgri.push({lblRegion : region.lblRegion, consoElecAgriculture : parseFloat(region.consoElecAgriculture)});
    DataElecSecteurIndus.push({lblRegion : region.lblRegion, consoElecIndustrie : parseFloat(region.consoElecIndustrie)});
    DataElecSecteurResi.push({lblRegion : region.lblRegion, consoElecResidentiel : parseFloat(region.consoElecResidentiel)});
    DataElecSecteurTerti.push({lblRegion : region.lblRegion, consoElecTertiaire : parseFloat(region.consoElecTertiaire)});
    DataElecSecteurAutre.push({lblRegion : region.lblRegion, consoElecAutre : parseFloat(region.consoElecAutre)});
    
    DataGazSecteurAgri.push({lblRegion : region.lblRegion, consoGazAgriculture : parseFloat(region.consoGazAgriculture)});
    DataGazSecteurIndus.push({lblRegion : region.lblRegion, consoGazIndustrie : parseFloat(region.consoGazIndustrie)});
    DataGazSecteurResi.push({lblRegion : region.lblRegion, consoGazResidentiel : parseFloat(region.consoGazResidentiel)});
    DataGazSecteurTerti.push({lblRegion : region.lblRegion, consoGazTertiaire : parseFloat(region.consoGazTertiaire)});
    DataGazSecteurAutre.push({lblRegion : region.lblRegion, consoGazAutre : parseFloat(region.consoGazAutre)});
  });
  
  
  // Fin du filtrage attendu pour continuer 
  promiseFilterDataResolve = new Promise((resolve, reject) => {
    resolve('filter ok');
  }); 
}

function GenerateGraph(data, value, div){
  console.log(data);
  
  // set the dimensions and margins of the graph
  const margin = {top: 100, right: 0, bottom: 0, left: 0},
  width = 460 - margin.left - margin.right,
  height = 460 - margin.top - margin.bottom,
  innerRadius = 90,
  outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
  
  // append the svg object
  const svg = d3.select(div)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);
  
  let maxConso = 0;
  if (value.includes('Gaz')) {
    if (value.includes('Agri')) maxConso = Math.ceil(d3.max(data, function(d) { return d.consoGazAgriculture; }) / 5) * 5; 
    else if (value.includes('Indus')) maxConso = Math.ceil(d3.max(data, function(d) { return d.consoGazIndustrie; }) / 5) * 5; 
    else if (value.includes('Resi')) maxConso = Math.ceil(d3.max(data, function(d) { return d.consoGazResidentiel; }) / 5) * 5; 
    else if (value.includes('Terti')) maxConso = Math.ceil(d3.max(data, function(d) { return d.consoGazTertiaire; }) / 5) * 5; 
    else maxConso = Math.ceil(d3.max(data, function(d) { return d.consoGazAutre; }) / 5) * 5; 
  }
  else { 
    if (value.includes('Agri')) maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecAgriculture; }) / 5) * 5; 
    else if (value.includes('Indus')) maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecIndustrie; }) / 5) * 5; 
    else if (value.includes('Resi')) maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecResidentiel; }) / 5) * 5; 
    else if (value.includes('Terti')) maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecTertiaire; }) / 5) * 5; 
    else maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecAutre; }) / 5) * 5; 
  }
  
  // Scales
  const x = d3.scaleBand()
  .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
  .align(0)                  // This does nothing
  .domain(data.map(d => d.lblRegion)); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])   // Domain will be define later.
  .domain([0, maxConso]); // Domain of Y is from 0 to the max seen in the data
  
  // Add the bars
  svg.append("g")
  .selectAll("path")
  .data(data)
  .join("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()     // imagine your doing a part of a donut plot
  .innerRadius(innerRadius)
  .outerRadius(d => y(d[value]))
  .startAngle(d => x(d.lblRegion))
  .endAngle(d => x(d.lblRegion) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius))
  
  // Add the labels
  svg.append("g")
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("text-anchor", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
  .attr("transform", function(d) { return "rotate(" + ((x(d.lblRegion) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d[value])+10) + ",0)"; })
  .append("text")
  .text(function(d){return(d.lblRegion)})
  .attr("transform", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
  .style("font-size", "11px")
  .attr("alignment-baseline", "middle")
  
};

function ChoixConso(typeconso){
  
  const listeGraph = [
    '#circular_barplot_agriculture', 
    '#circular_barplot_industrie', 
    '#circular_barplot_residentiel',
    '#circular_barplot_tertiaire', 
    '#circular_barplot_autre'
  ];

  listeGraph.forEach(id => {
    d3.select(id).selectAll("*").remove();
  });

console.log(typeconso);
switch (typeconso) {
  case 'gaz':
  GenerateGraph(DataGazSecteurAgri, 'consoGazAgriculture', '#circular_barplot_agriculture');
  GenerateGraph(DataGazSecteurIndus, 'consoGazIndustrie', '#circular_barplot_industrie');
  GenerateGraph(DataGazSecteurResi, 'consoGazResidentiel', '#circular_barplot_residentiel');
  GenerateGraph(DataGazSecteurTerti, 'consoGazTertiaire', '#circular_barplot_tertiaire');
  GenerateGraph(DataGazSecteurAutre, 'consoGazAutre', '#circular_barplot_autre');
  break;
  case 'electricite':
  GenerateGraph(DataElecSecteurAgri, 'consoElecAgriculture', '#circular_barplot_agriculture');
  GenerateGraph(DataElecSecteurIndus, 'consoElecIndustrie', '#circular_barplot_industrie');
  GenerateGraph(DataElecSecteurResi, 'consoElecResidentiel', '#circular_barplot_residentiel');
  GenerateGraph(DataElecSecteurTerti, 'consoElecTertiaire', '#circular_barplot_tertiaire');
  GenerateGraph(DataElecSecteurAutre, 'consoElecAutre', '#circular_barplot_autre');
  break;
  
  default:
  break;
}
};


promiseLoadData.then((resolve) => {
  console.log(resolve);
  promiseFilterDataResolve.then((resolve) => {
    console.log(resolve);
    GenerateGraph(DataGazSecteurAgri, 'consoGazAgriculture', '#circular_barplot_agriculture');
    GenerateGraph(DataGazSecteurIndus, 'consoGazIndustrie', '#circular_barplot_industrie');
    GenerateGraph(DataGazSecteurResi, 'consoGazResidentiel', '#circular_barplot_residentiel');
    GenerateGraph(DataGazSecteurTerti, 'consoGazTertiaire', '#circular_barplot_tertiaire');
    GenerateGraph(DataGazSecteurAutre, 'consoGazAutre', '#circular_barplot_autre');
  });
});