import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime
from operacao import Operacao
from gerenciamento import Gerenciamento
import indicadores

df = pd.read_csv(sys.argv[1], names=['time', 'buyer', 'seller', 'price', 'qtd', 'tot_qtd', 'tot_buss'], index_col='time')

dfPreco = pd.DataFrame({'preco': indicadores.gerarPrecosPorVolume(df, 'price', 'qtd')})


frq, bins = np.histogram(dfPreco.preco, bins=int(((dfPreco.preco.max()-dfPreco.preco.min()) / 5) / 4))

dfHist = pd.DataFrame({'bins': bins[1:], 'frq':frq})

sma = dfHist.frq.rolling(window=5).mean()

cruz = indicadores.cruzamentosDoValorEntreMediaMovel(dfHist.frq.values, sma)

for c in cruz:
   print(c)

plt.plot(dfHist.bins, dfHist.frq)
plt.plot(dfHist.bins, sma, label='sma', color='red')
plt.show()
