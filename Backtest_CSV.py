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

pontos = indicadores.pontos(dfHist, cruz, dfHist.frq.mean())

pontos.append(0)
pontos.append(200000)

pontos.sort()

print('Pontos com maiores volumes:')
print(pontos)

plt.plot(dfHist.bins, dfHist.frq)
plt.plot(dfHist.bins, sma, label='sma', color='red')
plt.show()


df2 = pd.read_csv(sys.argv[2], names=['time', 'buyer', 'seller', 'price', 'qtd', 'tot_qtd', 'tot_buss'], index_col='time')

distancia = 100
is_iterou = False
gerenciamento = Gerenciamento()
gerenciamento.operacoes = []
for index, row in df2.iterrows():
    if is_iterou and len(gerenciamento.operacoesAbertas()) == 0:
        proximo_ponto_abaixo = list(filter(lambda x: x < valorAnterior, pontos))[-1]
        proximo_ponto_acima = list(filter(lambda x: x > valorAnterior, pontos))[0]        
        if (valorAnterior > proximo_ponto_abaixo) and (row.price <= proximo_ponto_abaixo):
            # compra: se o valor anterior é > que o proximo ponto abaixo e o valor atual é <= ao ponto abaixo
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Cslt', preco=row.price, distancia=distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Cslt', preco=row.price, distancia=distancia, gain=row.price + distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Cslt', preco=row.price, distancia=distancia, gain=proximo_ponto_acima))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Cslti', preco=row.price, distancia=distancia, gain=proximo_ponto_acima))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Cslf', preco=row.price, distancia=distancia, gain=row.price + distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Cslf', preco=row.price, distancia=distancia, gain=proximo_ponto_acima))
        elif (valorAnterior < proximo_ponto_acima) and (row.price >= proximo_ponto_acima):
            # venda: se o valor anterior é < que o proximo ponto acima e o valor atual é >= ao ponto acima
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Vslt', preco=row.price, distancia=distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Vslt', preco=row.price, distancia=distancia, gain=row.price - distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Vslt', preco=row.price, distancia=distancia, gain=proximo_ponto_abaixo))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Vslti', preco=row.price, distancia=distancia, gain=proximo_ponto_abaixo))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Vslf', preco=row.price, distancia=distancia, gain=row.price - distancia))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, cv='Vslf', preco=row.price, distancia=distancia, gain=proximo_ponto_abaixo))
    else:
        is_iterou = True
    valorAnterior = row.price
    gerenciamento.novoPreco(preco=row.price, dataHora=index)


print('Operaçoes:')
soma = 0
for item in gerenciamento.operacoes:
    resultado = (item.saida - item.entrada) if item.cv[0] == 'C' else (item.entrada - item.saida)
    soma = soma + resultado
    print(item.cv, item.data_hora_entrada, item.entrada, item.saida, item.data_hora_saida, resultado, soma)

df2.price.plot.line()
plt.show()
