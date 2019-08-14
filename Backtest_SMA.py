import sys
import pandas as pd
import matplotlib.pyplot as plt
from operacao import Operacao
from gerenciamento import Gerenciamento
import indicadores

df = pd.read_csv(sys.argv[1], names=['time', 'buyer', 'seller', 'price', 'qtd', 'tot_qtd', 'tot_buss'], index_col='time')

df.index = pd.to_datetime(df.index)

smaRap = df.price.rolling(window=int(sys.argv[2])).mean()

smaLen = df.price.rolling(window=int(sys.argv[3])).mean()

stop = int(sys.argv[4])

gain = int(sys.argv[5])

gerenciamento = Gerenciamento()

gerenciamento.operacoes = []

inicio = list(smaLen.values).index(next(x for x in smaLen.values if x == x))

while inicio < df.price.count():
    #if len(gerenciamento.operacoesAbertas()) == 0:
    if smaRap.values[inicio-1] < smaLen.values[inicio] and smaRap.values[inicio] > smaLen.values[inicio]:
        # Compra
        gerenciamento.zerarTodas(df.price.values[inicio], df.index[inicio])
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Cslt', preco=df.price.values[inicio], distancia=stop))
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Cslt', preco=df.price.values[inicio], distancia=stop, gain=df.price.values[inicio] + gain))
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Cslf', preco=df.price.values[inicio], distancia=stop, gain=df.price.values[inicio] + gain))
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Cslf', preco=df.price.values[inicio], distancia=stop))
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Cslti', preco=df.price.values[inicio], distancia=stop))
    elif smaRap.values[inicio-1] > smaLen.values[inicio] and smaRap.values[inicio] < smaLen.values[inicio]:
        # Venda
        gerenciamento.zerarTodas(df.price.values[inicio], df.index[inicio])
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Vslt', preco=df.price.values[inicio], distancia=stop))
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Vslt', preco=df.price.values[inicio], distancia=stop, gain=df.price.values[inicio] - gain))
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Vslf', preco=df.price.values[inicio], distancia=stop, gain=df.price.values[inicio] - gain))
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Vslf', preco=df.price.values[inicio], distancia=stop))
        gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[inicio], cv='Vslti', preco=df.price.values[inicio], distancia=stop))

    #else:
    gerenciamento.novoPreco(preco=df.price.values[inicio], dataHora=df.index[inicio])
    inicio += 1

soma = 0
for item in gerenciamento.operacoes:
    resultado = (item.saida - item.entrada) if item.cv[0] == 'C' else (item.entrada - item.saida)
    soma = soma + resultado
    print(item.cv, item.data_hora_entrada, item.entrada, item.saida, item.data_hora_saida, resultado, soma)

df.price.plot.line()
smaRap.plot.line(label='Rapida', color='red')
smaLen.plot.line(label='Lenta', color='orange')
plt.show()