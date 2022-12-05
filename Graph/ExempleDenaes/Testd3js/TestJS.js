// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 200, left: 100},
width = 1000 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#barplot_compare")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

var DataCompareElecGaz = []
var DataCompareElecGaz2016 = []
var DataCompareElecGaz2017 = []
var DataCompareElecGaz2018 = []
var DataCompareElecGaz2019 = []
var DataCompareElecGaz2020 = []

//#region Promise
// Charge les colonnes necessaire depuis le CSV 
// Annee,Code_departement,Libelle_departement,Code_region,Libelle_region,Consommation_electricite_totale_MWh,Consommation_gaz_totale_MWh
const promiseLoadData = new Promise((resolve, reject) =>{
  d3.csv("../../../Donnees/Donnees2016.csv").then(function(data) {
    for (var i = 0; i<data.length; i++){
      DataCompareElecGaz.push({annee : data[i].Annee, 
        codeDepart : parseInt(data[i].Code_departement), 
        lblDepart : data[i].Libelle_departement,
        codeRegion : parseInt(data[i].Code_region),
        lblRegion : data[i].Libelle_region,
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

var promiseFilterDataResolve;
//#endregion Promise

//#region Function
function FilterData(data){
  for (var i = 0; i<data.length; i++){
    switch (data[i].annee) {
      case '2016':
      DataCompareElecGaz2016.push({annee : data[i].annee, 
        codeDepart : parseInt(data[i].codeDepart), 
        lblDepart : data[i].lblDepart,
        codeRegion : parseInt(data[i].codeRegion),
        lblRegion : data[i].lblRegion,
        consoElecTotal : parseFloat(data[i].consoElecTotal),
        consoGazTotal : parseFloat(data[i].consoGazTotal)
      });
      break;
      
      case '2017':
      DataCompareElecGaz2017.push({annee : data[i].annee, 
        codeDepart : parseInt(data[i].codeDepart), 
        lblDepart : data[i].lblDepart,
        codeRegion : parseInt(data[i].codeRegion),
        lblRegion : data[i].lblRegion,
        consoElecTotal : parseFloat(data[i].consoElecTotal),
        consoGazTotal : parseFloat(data[i].consoGazTotal)
      });
      break;
      
      case '2018':
      DataCompareElecGaz2018.push({annee : data[i].annee, 
        codeDepart : parseInt(data[i].codeDepart), 
        lblDepart : data[i].lblDepart,
        codeRegion : parseInt(data[i].codeRegion),
        lblRegion : data[i].lblRegion,
        consoElecTotal : parseFloat(data[i].consoElecTotal),
        consoGazTotal : parseFloat(data[i].consoGazTotal)
      });
      break;
      
      case '2019':
      DataCompareElecGaz2019.push({annee : data[i].annee, 
        codeDepart : parseInt(data[i].codeDepart), 
        lblDepart : data[i].lblDepart,
        codeRegion : parseInt(data[i].codeRegion),
        lblRegion : data[i].lblRegion,
        consoElecTotal : parseFloat(data[i].consoElecTotal),
        consoGazTotal : parseFloat(data[i].consoGazTotal)
      });
      break;
      
      case '2020':
      DataCompareElecGaz2020.push({annee : data[i].annee, 
        codeDepart : parseInt(data[i].codeDepart), 
        lblDepart : data[i].lblDepart,
        codeRegion : parseInt(data[i].codeRegion),
        lblRegion : data[i].lblRegion,
        consoElecTotal : parseFloat(data[i].consoElecTotal),
        consoGazTotal : parseFloat(data[i].consoGazTotal)
      });
      break;
      
      default:
      break;
    }
    if (i == data.length - 1)
    {
      promiseFilterDataResolve = new Promise((resolve, reject) => {
        resolve('filter ok');
      });
    }
  }
}

function GenerateGraph(data) {
  console.log(data);
  
  const subgroups = Object.getOwnPropertyNames(data[0]).slice(5);
  const groups = data.map(d => d.lblRegion);
  
  // Add X axis
  const x = d3.scaleBand()
  .domain(groups)
  .range([0, width])
  .padding([0.2])
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickSize(0)).selectAll("text")  
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");;
  
  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, 2000000])
  .range([ height, 0 ]);
  svg.append("g")
  .call(d3.axisLeft(y));
  
  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand()
  .domain(subgroups)
  .range([0, x.bandwidth()])
  .padding([0.05]);
  
  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#377eb8','#e41a1c'])
  
  // Show the bars
  svg.append("g")
  .selectAll("g")
  // Enter in data = loop group per group
  .data(data)
  .join("g")
  .attr("transform", d => `translate(${x(d.lblRegion)}, 0)`)
  .selectAll("rect")
  .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
  .join("rect")
  .attr("x", d => xSubgroup(d.key))
  .attr("y", d => y(d.value))
  .attr("width", xSubgroup.bandwidth())
  .attr("height", d => height - y(d.value))
  .attr("fill", d => color(d.key));
  
}

function UpdateYear(annee){
  svg.selectAll('*').remove();
  console.log('Reload year ' + annee);
  switch (annee) {
    case '2016':
      GenerateGraph(DataCompareElecGaz2016);
    break;
    case '2017':
      GenerateGraph(DataCompareElecGaz2017);
    break;
    case '2018':
      GenerateGraph(DataCompareElecGaz2018);
    break;
    case '2019':
      GenerateGraph(DataCompareElecGaz2019);
    break;
    case '2020':
      GenerateGraph(DataCompareElecGaz2020);
    break;
    
    default:
    break;
  }
}
//#endregion Function

//#region Traitement
promiseLoadData.then((resolve) => {
  console.log(resolve);
  promiseFilterDataResolve.then((resolve) => {
    console.log(resolve);
    GenerateGraph(DataCompareElecGaz2020);
  });
});


//#endregion Traitement