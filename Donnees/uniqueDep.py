import json

import numpy as np
import pandas as pd

# Read the CSV file into a DataFrame
df = pd.read_csv("Donnees2016.csv")
unique_columns = sorted(df['Code_departement'].unique().tolist())

export = []

for dep in unique_columns:
  var = df.loc[df['Code_departement'] == dep]
  totelec = var['Consommation_totale_MWh'].sum()
  export.append(var.head(1).drop(['Geo-shape_EPCI'], axis=1).values[0])

grandeArray = []
for i in range(len(export)):
  array = []
  for y in range(len(export[0])):
    array.append(export[i][y])
  array[10] = totelec
  grandeArray.append(array)

jsonstr = json.dumps(grandeArray)
with open('pls.json', 'w') as outfile:
    outfile.write(jsonstr)
