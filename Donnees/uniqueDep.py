import csv

import numpy as np
import pandas as pd

# Read the CSV file into a DataFrame
df = pd.read_csv("Donnees2016.csv")
unique_columns = sorted(df['Code_departement'].unique().tolist())

export = []

for dep in unique_columns:
  var = df.loc[df['Code_departement'] == dep]
  export.append(var.head(1).drop(['Geo-shape_EPCI'], axis=1).to_dict())

print(export)

with open('exportDatas', 'w', newline='') as myfile:
     wr = csv.writer(export, quoting=csv.QUOTE_ALL)
     wr.writerow(export)
