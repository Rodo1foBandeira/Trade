import sys
import pandas as pd
import mysql.connector as sql
import datetime
from operacao import Operacao
from gerenciamento import Gerenciamento

# [104000, 104500, 104700]
points = list(map(lambda x: int(x), sys.argv[3:]))

db_connection = sql.connect(host='35.153.177.16', database='market_data', user='root', password='!Q@W3e4r')

df = pd.read_sql('SELECT datetime_buss, price FROM mining_trade where active = "' + sys.argv[1] + '" and date(datetime_buss) = date("' + sys.argv[2] + '")', con=db_connection, index_col='datetime_buss')

distancia = 100
is_iterou = False
gerenciamento = Gerenciamento()
valorAnterior = df.price[0]
for index, row in df.iterrows():
    if is_iterou and len(gerenciamento.operacoesAbertas()) == 0:
        proximo_ponto_abaixo = list(filter(lambda x: x < valorAnterior, points))[-1]
        proximo_ponto_acima = list(filter(lambda x: x > valorAnterior, points))[0]
        
        if (valorAnterior > proximo_ponto_abaixo) and (row.price <= proximo_ponto_abaixo):
            # compra: se o valor anterior é > que o proximo ponto abaixo e o valor atual é <= ao ponto abaixo
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='B', price=row.price, distance=100, slt=row.price - 100))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='B', price=row.price, distance=100, slt=row.price - 100, gain=row.price + 100))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='B', price=row.price, distance=100, slt=row.price - 100, gain=proximo_ponto_acima))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='B', price=row.price, distance=100, slti=row.price - 100, gain=row.price + 100))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='B', price=row.price, distance=100, slti=row.price - 100, gain=proximo_ponto_acima))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='B', price=row.price, distance=100, slf=row.price - 100, gain=row.price + 100))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='B', price=row.price, distance=100, slf=row.price - 100, gain=proximo_ponto_acima))
        elif (valorAnterior < proximo_ponto_acima) and (row.price >= proximo_ponto_acima):
            # venda: se o valor anterior é < que o proximo ponto acima e o valor atual é >= ao ponto acima
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='S', price=row.price, distance=100, slt=row.price + 100))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='S', price=row.price, distance=100, slt=row.price + 100, gain=row.price - 100))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='S', price=row.price, distance=100, slt=row.price + 100, gain=proximo_ponto_abaixo))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='S', price=row.price, distance=100, slti=row.price + 100, gain=row.price - 100))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='S', price=row.price, distance=100, slti=row.price + 100, gain=proximo_ponto_abaixo))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='S', price=row.price, distance=100, slf=row.price + 100, gain=row.price - 100))
            gerenciamento.operacoes.append(Operacao(data_hora_entrada=index, bs='S', price=row.price, distance=100, slf=row.price + 100, gain=proximo_ponto_abaixo))
    else:
        is_iterou = True

    valorAnterior = row.price
    gerenciamento.novoPreco(preco=row.price, dataHora=index)

soma = 0
for item in gerenciamento.operacoes:
    resultado = (item.realizada - item.price) if item.bs == 'B' else (item.price - item.realizada)
    soma = soma + resultado
    print(item.bs, item.data_hora_entrada, item.price, item.realizada, item.data_hora_saida, resultado)
    
print(soma)