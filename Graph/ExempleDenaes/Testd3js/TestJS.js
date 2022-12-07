// set the dimensions and margins of the graph
const margin = {top: 40, right: 200, bottom: 200, left: 100},
width = 1000 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const divTooltip = d3.select("div.ToolTip");

const svgGlobal = d3.select("#barplot_compare")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

const svgRegion = d3.select("#barplot_compare_region")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

//#region Variables Globales
//#region Tableau données
var DataCompareElecGaz = [] // Tableau chargé depuis le CSV avec les colonnes necessaire
var DataCompareElecGaz2016 = [] // Tableau par années
var DataCompareElecGaz2017 = []
var DataCompareElecGaz2018 = []
var DataCompareElecGaz2019 = []
var DataCompareElecGaz2020 = []

var DataCompareElecGazRegion2016 = [] // Tableau par années et département cumulé en region
var DataCompareElecGazRegion2017 = []
var DataCompareElecGazRegion2018 = []
var DataCompareElecGazRegion2019 = []
var DataCompareElecGazRegion2020 = []

var DataDisplayed = [] // Les données actuellement affiché
var CurrentYearData = [] // Les données correspondant à l'année affiché
//#endregion Tableau données
var ListeRegion = [];
var ListeDepartement = [];
//#endregion Variables Globales

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
        consoElecTotal : parseFloat(data[i].Consommation_electricite_totale_MWh) / 1000000,
        consoGazTotal : parseFloat(data[i].Consommation_gaz_totale_MWh) / 1000000
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
  // Filtrage des données par années
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
      // Cumule des données des département par region
      ListeRegion = [...new Set(DataCompareElecGaz.map(d => d.lblRegion))];
      
      // Tableau des tableaux des données par année
      let AllDataParAnnee = [DataCompareElecGaz2016, 
        DataCompareElecGaz2017, 
        DataCompareElecGaz2018, 
        DataCompareElecGaz2019, 
        DataCompareElecGaz2020
      ];
      
      // Création des tableau de données avec cumule par département
      AllDataParAnnee.forEach(data => {
        var groupParRegion = d3.group(data, d => d.lblRegion);
        let annee;
        let dataRegion = [];
        
        ListeRegion.forEach(region => {
          let totalGaz = 0;
          let totalElec = 0;
          let LblRegion;
          groupParRegion.get(region).forEach(element => {
            totalElec += element.consoElecTotal;
            totalGaz += element.consoGazTotal;
            LblRegion = element.lblRegion;
            annee = element.annee;
          });
          
          dataRegion.push({lblRegion : LblRegion,
            consoElecTotal : parseFloat(totalElec),
            consoGazTotal : parseFloat(totalGaz)
          });
        });
        switch (annee) {
          case '2016':
          DataCompareElecGazRegion2016 = dataRegion;
          break;
          case '2017':
          DataCompareElecGazRegion2017 = dataRegion;
          break;
          case '2018':
          DataCompareElecGazRegion2018 = dataRegion;
          break;
          case '2019':
          DataCompareElecGazRegion2019 = dataRegion;
          break;
          case '2020':
          DataCompareElecGazRegion2020 = dataRegion;
          break;
          
          default:
          break;
        }
      });      
      
      // Fin du filtrage attendu pour continuer 
      promiseFilterDataResolve = new Promise((resolve, reject) => {
        resolve('filter ok');
      });
    }
  }
}

// Méthode de génération du graph à partir d'un tableau de données filtrer par année 
function GenerateGraph(data, isClickable, isRegion) {
  console.log(data);
  let svg;
  if (isRegion) svg = svgGlobal;
  else svg = svgRegion; 

  // Groupe et sous-groupe du graph
  const subgroups = Object.getOwnPropertyNames(data[0]).slice(1);
  let groups;
  if (isRegion) groups = data.map(d => d.lblRegion);
  else groups = data.map(d => d.lblDepart);
  
  // Calcule du max de l'echelle Y
  const maxElec = Math.ceil(d3.max(data, function(d) { return d.consoElecTotal; }) / 5) * 5;
  const maxGaz = Math.ceil(d3.max(data, function(d) { return d.consoGazTotal; }) / 5) * 5;
  const maxY = maxElec <= maxGaz ? maxGaz : maxElec;
  
  // Add X axis
  const x = d3.scaleBand()
  .domain(groups)
  .range([0, width])
  .padding([0.2])
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickSize(0))
  .selectAll("text")  
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");;
  
  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, maxY])
  .range([ height, 0 ]);
  svg.append("g")
  .call(d3.axisLeft(y));
  
  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand()
  .domain(subgroups)
  .range([0, x.bandwidth()]);
  
  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#198D8E','#71E0E9'])
  
  // Show the bars
  var slice = svg.append("g")
  .selectAll("g")
  // Enter in data = loop group per group
  .data(data)
  .join("g")
  .attr("transform", d => {
    if (isRegion) return `translate(${x(d.lblRegion)}, 0)`;
    else return `translate(${x(d.lblDepart)}, 0)`;
  });
  
  slice.selectAll("rect")
  .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
  .join("rect")
  .attr("x", d => xSubgroup(d.key))
  .attr("y", () => y(0) - 1)
  .attr("width", xSubgroup.bandwidth())
  .attr("height", () => height - y(0))
  .attr("fill", d => color(d.key))
  .on("mouseover", function(event, d) { // Affichage tooltip
    divTooltip.style("left", event.pageX + 10 + "px");
    divTooltip.style("top", event.pageY - 25 + "px");
    divTooltip.style("display", "inline-block");
    divTooltip.style("opacity", "0.9");
    var elements = document.querySelectorAll(":hover");
    var l = elements.length - 1;
    var elementData = elements[l].__data__;
    //console.log(elementData)
    divTooltip.html(elementData.value + " MWh");
    d3.select(this)
    .attr("fill", d => d3.rgb(color(d.key)).darker(2));
    
  })
  .on("mouseout", function(d) { // Dé Affichage Tooltip
    divTooltip.style("display", "none")
    d3.select(this).transition().duration(250)
    .attr("fill", d => color(d.key));
  })
  .on("click", (d, i) => {
    if (isClickable == true) {
      // Récuperation de la region clické
      const ligne = DataDisplayed.find(data => {
        let result;
        if (i.key == 'consoElecTotal') result = data.consoElecTotal === i.value;
        else result = data.consoGazTotal === i.value;
        return result;
      });
      console.log(ligne.lblRegion);
      
      // Génération du tableau de données par département pour la region clické
      let DataCompareElecGazDepartement = [];

      let DataCurrentRegion = d3.group(CurrentYearData, d => d.lblRegion).get(ligne.lblRegion);
      let groupParDepartement = d3.group(DataCurrentRegion, d => d.lblDepart);
      console.log(groupParDepartement);

      ListeDepartement = [...new Set(DataCurrentRegion.map(d => d.lblDepart))];
      console.log(ListeDepartement);

      ListeDepartement.forEach(departement => {
          let totalGaz = 0;
          let totalElec = 0;
          let LblDepartement;
          groupParDepartement.get(departement).forEach(element => {
            totalElec += element.consoElecTotal;
            totalGaz += element.consoGazTotal;
            LblDepartement = element.lblDepart;
            annee = element.annee;
          });
          
          DataCompareElecGazDepartement.push({lblDepart : LblDepartement,
            consoElecTotal : parseFloat(totalElec),
            consoGazTotal : parseFloat(totalGaz)
          });
        });
      
      svgRegion.selectAll('*').remove();
      GenerateGraph(DataCompareElecGazDepartement, false, false);
    }
    else{
      svgRegion.selectAll('*').remove();
      divTooltip.style("display", "none")
    }
    
  });;
  
  // Transition d'apparition
  slice.selectAll("rect")
  .transition()
  .delay(() => Math.random()*1000)
  .duration(1000)
  .attr("y", d => y(d.value) - 1)
  .attr("height", d => height - y(d.value));
  
  // Legende
  const lblLegend = ['Consommation totale d\'électricité', 'Consommation totale de gaz'];
  
  var legend = svg.selectAll(".legend")
  .data(lblLegend)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
  legend.append("rect")
  .attr("x", width + 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", color);
  
  legend.append("text")
  .attr("x", width + 40)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d) { return d; });
  
  // Axes Y label
  svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "start")
  .attr("y", - margin.top / 3)
  .attr("x", - margin.left / 2)
  .text("Consommation (MWh)");
}

// Méthode déclenché par le selecteur pour changer l'année affiché
function UpdateYear(annee){
  svgGlobal.selectAll('*').remove();
  svgRegion.selectAll('*').remove();
  console.log('Reload year ' + annee);
  switch (annee) {
    case '2016':
    DataDisplayed = DataCompareElecGazRegion2016;
    CurrentYearData = DataCompareElecGaz2016;
    GenerateGraph(DataCompareElecGazRegion2016, true, true);
    break;
    case '2017':
    DataDisplayed = DataCompareElecGazRegion2017;
    CurrentYearData = DataCompareElecGaz2017;
    GenerateGraph(DataCompareElecGazRegion2017, true, true);
    break;
    case '2018':
    DataDisplayed = DataCompareElecGazRegion2018;
    CurrentYearData = DataCompareElecGaz2018;
    GenerateGraph(DataCompareElecGazRegion2018, true, true);
    break;
    case '2019':
    DataDisplayed = DataCompareElecGazRegion2019;
    CurrentYearData = DataCompareElecGaz2019;
    GenerateGraph(DataCompareElecGazRegion2019, true, true);
    break;
    case '2020':
    DataDisplayed = DataCompareElecGazRegion2020;
    CurrentYearData = DataCompareElecGaz2020;
    GenerateGraph(DataCompareElecGazRegion2020, true, true);
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
    DataDisplayed = DataCompareElecGazRegion2020;
    CurrentYearData = DataCompareElecGaz2020;
    GenerateGraph(DataCompareElecGazRegion2020, true, true);
  });
});
//#endregion Traitement