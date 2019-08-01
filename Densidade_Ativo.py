import sys
import pandas as pd
import matplotlib.pyplot as plt
import mysql.connector as sql

db_connection = sql.connect(host='18.206.99.175', database='market_data', user='root', password='!Q@W3e4r')

df = pd.read_sql('SELECT datetime_buss, price FROM mining_trade where active = "' + sys.argv[1] + '" and date(datetime_buss) = date("' + sys.argv[2] + '")', con=db_connection, index_col='datetime_buss')

df.plot.kde()
df.plot.line()
plt.show()