var DataElecSecteur = [];

var DataElecSecteurRegion = [];

var DataGazSecteurRegion = [];

var ListeDataParRegion = [];


const promiseLoadData = new Promise((resolve, reject) =>{
  d3.csv("../../../Donnees/Donnees2016.csv").then(function(data) {
    for (var i = 0; i<data.length; i++){
      DataElecSecteur.push({
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
        FilterData(DataElecSecteur);
      }
    }
  })
});

function FilterData(data){
  // Filtrage des données par années
  // Cumule des données des département par region
  ListeRegion = [...new Set(DataElecSecteur.map(data => data.lblRegion))];
  console.log(ListeRegion);
  // Création des tableau de données avec cumule par département
  
  var DataElectriciteSecteur = [DataElecSecteur];
  
  DataElectriciteSecteur.forEach(data => {
    var groupbyRegion = d3.group(data, d => d.lblRegion);
    let dataRegion  = [];
    
    console.log(groupbyRegion);
    
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

    let typeconso;
    
    ListeRegion.forEach(region => {
      let LblRegion;
      groupbyRegion.get(region).forEach(sec => {
        
        totalElecAgriculture += sec.consoElecAgriculture;
        totalElecIndustrie += sec.consoElecIndustrie;
        totalElecResidentiel += sec.consoElecResidentiel;
        totalElecTertiaire += sec.consoElecTertiaire;
        totalElecAutre += sec.consoElecAutre;
        totalGazAgriculture += sec.consoElecAgriculture;
        totalGazIndustrie += sec.consoElecIndustrie;
        totalGazResidentiel += sec.consoElecResidentiel;
        totalGazTertiaire += sec.consoElecTertiaire;
        totalGazAutre += sec.consoElecAutre;
        LblRegion = sec.lblRegion;
      });
      
      console.log(groupbyRegion)
      
      dataRegion.push({lblRegion : LblRegion,
        consoElecAgriculture : parseFloat(totalElecAgriculture),
        consoElecIndustrie : parseFloat(totalElecIndustrie),
        consoElecResidentiel : parseFloat(totalElecResidentiel),
        consoElecTertiaire : parseFloat(totalElecTertiaire),
        consoElecAutre : parseFloat(totalElecAutre),
        typeconso : "Electricite"
      });

      dataRegion.push({lblRegion : LblRegion,
        consoGazAgriculture : parseFloat(totalGazAgriculture),
        consoGazIndustrie : parseFloat(totalGazIndustrie),
        consoGazResidentiel : parseFloat(totalGazResidentiel),
        consoGazTertiaire : parseFloat(totalGazTertiaire),
        consoGazAutre : parseFloat(totalGazAutre),
        typeconso : "Gaz"
      });

      console.log(dataRegion)

      switch(typeconso){
            case 'Electricite':
              DataElecSecteurRegion = dataRegion;
              break;
            case 'Gaz':
              DataGazSecteurRegion = dataRegion;
              break;
            default:
              break;
      }

    });
    
    // dataSecteur.push({secteur : Secteur,
    //   Consommation_électricité_agriculture_MWh : parseFloat(totalElecAgriculture),
    //   Consommation_electricite_industrie_MWh : parseFloat(totalElecIndustrie),
    //   Consommation_electricite_residentiel_MWh : parseFloat(totalElecResidentiel),
    //   Consommation_electricite_tertiaire_MWh : parseFloat(totalElecTertiaire),
    //   Consommation_electricite_autre_MWh : parseFloat(totalElecAutre)
    // });
    
    // console.log(dataSecteur);
  });
  // AllSecteur.forEach(data => {  
  
  //   var groupbySecteur = d3.group(data, d => d.lblRegion);
  //   console.log(groupbySecteur);
  //   let dataSecteur = [];
  
  
  // Fin du filtrage attendu pour continuer 
  promiseFilterDataResolve = new Promise((resolve, reject) => {
    resolve('filter ok');
  }); 
}


function GenerateGraphAgriculture(data){

    // set the dimensions and margins of the graph
    const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
  
    // append the svg object
    const svg_agriculture = d3.select("#circular_barplot_agriculture")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);
  const maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecAgriculture; }) / 5) * 5;
  // Scales
  const x = d3.scaleBand()
  .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
  .align(0)                  // This does nothing
  .domain(data.map(d => d.lblRegion)); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])   // Domain will be define later.
  .domain([0, maxConso]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg_agriculture.append("g")
  .selectAll("path")
  .data(data)
  .join("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()     // imagine your doing a part of a donut plot
  .innerRadius(innerRadius)
  .outerRadius(d => y(d['consoElecAgriculture']))
  .startAngle(d => x(d.lblRegion))
  .endAngle(d => x(d.lblRegion) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius))

  // Add the labels
  svg_agriculture.append("g")
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("text-anchor", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
  .attr("transform", function(d) { return "rotate(" + ((x(d.lblRegion) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['consoElecAgriculture'])+10) + ",0)"; })
  .append("text")
  .text(function(d){return(d.lblRegion)})
  .attr("transform", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
  .style("font-size", "11px")
  .attr("alignment-baseline", "middle")

};

function GenerateGraphIndustrie(data){

    // set the dimensions and margins of the graph
    const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
  
    // append the svg object
    const svg_industrie = d3.select("#circular_barplot_industrie")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);
  const maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecIndustrie; }) / 5) * 5;
  // Scales
  const x = d3.scaleBand()
  .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
  .align(0)                  // This does nothing
  .domain(data.map(d => d.lblRegion)); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])   // Domain will be define later.
  .domain([0, maxConso]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg_industrie.append("g")
  .selectAll("path")
  .data(data)
  .join("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()     // imagine your doing a part of a donut plot
  .innerRadius(innerRadius)
  .outerRadius(d => y(d['consoElecIndustrie']))
  .startAngle(d => x(d.lblRegion))
  .endAngle(d => x(d.lblRegion) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius))

  // Add the labels
  svg_industrie.append("g")
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("text-anchor", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
  .attr("transform", function(d) { return "rotate(" + ((x(d.lblRegion) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['consoElecIndustrie'])+10) + ",0)"; })
  .append("text")
  .text(function(d){return(d.lblRegion)})
  .attr("transform", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
  .style("font-size", "11px")
  .attr("alignment-baseline", "middle")

};

function GenerateGraphResidentiel(data){

    // set the dimensions and margins of the graph
    const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
  
    // append the svg object
    const svg_residentiel = d3.select("#circular_barplot_residentiel")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);
  const maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecResidentiel; }) / 5) * 5;
  // Scales
  const x = d3.scaleBand()
  .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
  .align(0)                  // This does nothing
  .domain(data.map(d => d.lblRegion)); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])   // Domain will be define later.
  .domain([0, maxConso]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg_residentiel.append("g")
  .selectAll("path")
  .data(data)
  .join("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()     // imagine your doing a part of a donut plot
  .innerRadius(innerRadius)
  .outerRadius(d => y(d['consoElecResidentiel']))
  .startAngle(d => x(d.lblRegion))
  .endAngle(d => x(d.lblRegion) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius))

  // Add the labels
  svg_residentiel.append("g")
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("text-anchor", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
  .attr("transform", function(d) { return "rotate(" + ((x(d.lblRegion) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['consoElecResidentiel'])+10) + ",0)"; })
  .append("text")
  .text(function(d){return(d.lblRegion)})
  .attr("transform", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
  .style("font-size", "11px")
  .attr("alignment-baseline", "middle")

};

function GenerateGraphTertiaire(data){

    // set the dimensions and margins of the graph
    const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
  
    // append the svg object
    const svg_tertiaire = d3.select("#circular_barplot_tertiaire")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);
  const maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecTertiaire; }) / 5) * 5;
  // Scales
  const x = d3.scaleBand()
  .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
  .align(0)                  // This does nothing
  .domain(data.map(d => d.lblRegion)); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])   // Domain will be define later.
  .domain([0, maxConso]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg_tertiaire.append("g")
  .selectAll("path")
  .data(data)
  .join("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()     // imagine your doing a part of a donut plot
  .innerRadius(innerRadius)
  .outerRadius(d => y(d['consoElecTertiaire']))
  .startAngle(d => x(d.lblRegion))
  .endAngle(d => x(d.lblRegion) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius))

  // Add the labels
  svg_tertiaire.append("g")
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("text-anchor", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
  .attr("transform", function(d) { return "rotate(" + ((x(d.lblRegion) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['consoElecTertiaire'])+10) + ",0)"; })
  .append("text")
  .text(function(d){return(d.lblRegion)})
  .attr("transform", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
  .style("font-size", "11px")
  .attr("alignment-baseline", "middle")

};

function GenerateGraphAutre(data){

    // set the dimensions and margins of the graph
    const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
  
    // append the svg object
    const svg_autre = d3.select("#circular_barplot_autre")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);
  const maxConso = Math.ceil(d3.max(data, function(d) { return d.consoElecAutre; }) / 5) * 5;
  // Scales
  const x = d3.scaleBand()
  .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
  .align(0)                  // This does nothing
  .domain(data.map(d => d.lblRegion)); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])   // Domain will be define later.
  .domain([0, maxConso]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg_autre.append("g")
  .selectAll("path")
  .data(data)
  .join("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()     // imagine your doing a part of a donut plot
  .innerRadius(innerRadius)
  .outerRadius(d => y(d['consoElecAutre']))
  .startAngle(d => x(d.lblRegion))
  .endAngle(d => x(d.lblRegion) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius))

  // Add the labels
  svg_autre.append("g")
  .selectAll("g")
  .data(data)
  .join("g")
  .attr("text-anchor", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
  .attr("transform", function(d) { return "rotate(" + ((x(d.lblRegion) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['consoElecAutre'])+10) + ",0)"; })
  .append("text")
  .text(function(d){return(d.lblRegion)})
  .attr("transform", function(d) { return (x(d.lblRegion) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
  .style("font-size", "11px")
  .attr("alignment-baseline", "middle")

};


function ChoixConso(typeconso){
  //svg.remove();

  console.log(typeconso);
  switch (typeconso) {
    case 'gaz':
    GenerateGraphAgriculture(DataGazSecteurRegion);
    GenerateGraphIndustrie(DataGazSecteurRegion);
    GenerateGraphResidentiel(DataGazSecteurRegion);
    GenerateGraphTertiaire(DataGazSecteurRegion);
    GenerateGraphAutre(DataGazSecteurRegion);
    break;
    case 'electricite':
      GenerateGraphAgriculture(DataElecSecteurRegion);
      GenerateGraphIndustrie(DataElecSecteurRegion);
      GenerateGraphResidentiel(DataElecSecteurRegion);
      GenerateGraphTertiaire(DataElecSecteurRegion);
      GenerateGraphAutre(DataElecSecteurRegion);
    break;
    
    default:
    break;
  }
};

// function ClearAllPlot(){
//   const element = document.getElementById('all_curcular_barplot');
//   element.remove();
// }
  // promiseLoadData.then((resolve) => {
  //   console.log(resolve);
  //   promiseFilterDataResolve.then((resolve) => {
  //     console.log(resolve);
  //     GenerateGraphAgriculture(DataElecSecteurRegion);
  //   });
  // });