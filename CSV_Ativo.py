import pandas as pd

df_csv = pd.read_csv('2019-05-27_WIN.csv', names=['time', 'buyer', 'seller', 'price', 'qtd', 'tot_qtd', 'tot_buss'], index_col='time')

