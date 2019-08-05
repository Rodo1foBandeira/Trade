import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from operacao import Operacao
from gerenciamento import Gerenciamento
import indicadores

df = pd.read_csv('~/Downloads/2019-05-27_WIN.csv', names=['time', 'buyer', 'seller', 'price', 'qtd', 'tot_qtd', 'tot_buss'], index_col='time')

sma = df.price.rolling(window=30000).mean()

distancia = 100

gerenciamento = Gerenciamento()

gerenciamento.operacoes = []

i = list(sma.values).index(next(x for x in sma.values if x == x))

while i < df.price.count():
    if len(gerenciamento.operacoesAbertas()) == 0:
        if df.price.values[i-1] < sma.values[i] and df.price.values[i] > sma.values[i]:
            # Compra
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[i], cv='Cslt', preco=df.price.values[i], distancia=distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[i], cv='Cslt', preco=df.price.values[i], distancia=distancia, gain=df.price.values[i] + distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[i], cv='Cslf', preco=df.price.values[i], distancia=distancia, gain=df.price.values[i] + distancia))
        elif df.price.values[i-1] > sma.values[i] and df.price.values[i] < sma.values[i]:
            # Venda
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[i], cv='Vslt', preco=df.price.values[i], distancia=distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[i], cv='Vslt', preco=df.price.values[i], distancia=distancia, gain=df.price.values[i] - distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=df.index[i], cv='Vslf', preco=df.price.values[i], distancia=distancia, gain=df.price.values[i] - distancia))
    else:
        gerenciamento.novoPreco(preco=df.price.values[i], dataHora=df.index[i])
    i = i + 1

soma = 0
for item in gerenciamento.operacoes:
    resultado = (item.saida - item.entrada) if item.cv[0] == 'C' else (item.entrada - item.saida)
    soma = soma + resultado
    print(item.cv, item.data_hora_entrada, item.entrada, item.saida, item.data_hora_saida, resultado, soma)