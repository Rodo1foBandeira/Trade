import sys
import pandas as pd
import matplotlib.pyplot as plt
import mysql.connector as sql

db_connection = sql.connect(host='35.153.177.16', database='market_data', user='root', password='!Q@W3e4r')

df = pd.read_sql('SELECT datetime_buss, price, qtd FROM mining_trade where active = "' + sys.argv[1] + '" and date(datetime_buss) = date("' + sys.argv[2] + '")', con=db_connection, index_col='datetime_buss')

volume = []

for index, row in df.iterrows():
    i = 0
    while i < row.qtd:
        volume.append(row.price)
        i = i + 1

vol = pd.DataFrame({'price': volume})
vol.plot.kde()
plt.show()