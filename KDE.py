import pandas as pd
import matplotlib.pyplot as plt

df_csv = pd.read_csv('c:/users/rodolfo.bandeira/downloads/2019-05-31_WIN.csv')

df = pd.DataFrame(df_csv, columns=['time', 'price', 'qtd'])
df.set_index('time')

volume = []

for index, row in df.iterrows():
    i = 0
    while i < row.qtd:
        volume.append(row.price)
        i = i + 1

vol = pd.DataFrame({'price': volume})
vol.plot.kde()
plt.show()