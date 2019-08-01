import pandas as pd
import seaborn as sb
import matplotlib.pyplot as plt
import mysql.connector as sql
from pandas.plotting import autocorrelation_plot
from statsmodels.tsa.arima_model import ARIMA
from pandas import DataFrame

db_connection = sql.connect(host='18.206.99.175', database='market_data', user='root', password='!Q@W3e4r')

dados = pd.read_sql('SELECT datetime_buss, price FROM mining_trade where active = "WINQ19" and date(datetime_buss) = date("2019-07-30"))', con=db_connection, index_col='datetime_buss')

autocorrelation_plot(dados)

# fit model
model = ARIMA(dados, order=(3600,1,21))
model_fit = model.fit(disp=0)
print(model_fit.summary())
# plot residual errors
residuals = DataFrame(model_fit.resid)
residuals.plot()
plt.show()
residuals.plot(kind='kde')
plt.show()
print(residuals.describe())