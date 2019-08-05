def gerarPrecosPorVolume(df, colPreco, colQtd):
   precos = []
   for index, row in df.iterrows():
      precos += [row[colPreco]] * int(row[colQtd])
   return precos

def isNaN(num):
    return num != num

def cruzamentosDoValorEntreMediaMovel(valores, valoresMediaMovel):
   posicoes = []
   i = list(valoresMediaMovel).index(next(x for x in valoresMediaMovel if x == x))
   while i < len(valores):
      if (len(posicoes) == 0 or posicoes[-1]['direcao'] == '-') and valores[i-1] < valoresMediaMovel[i] and valores[i] > valoresMediaMovel[i]:
         # Valor cruzou a media pra cima
         posicoes.append({'index': i, 'direcao': '+'})
      elif (len(posicoes) == 0 or posicoes[-1]['direcao'] == '+') and valores[i-1] > valoresMediaMovel[i] and valores[i] < valoresMediaMovel[i]:
         # Valor cruzou a media pra baixo
         posicoes.append({'index': i, 'direcao': '-'})
      i += 1
   return posicoes

def pontos(dfHist, cruzamentosValorMediaMovel, frequenciaMinima):
   pontos = []
   i = 0
   while i < len(cruzamentosValorMediaMovel):
      if cruzamentosValorMediaMovel[i]['direcao'] == '+':
         cruzouPraCima = cruzamentosValorMediaMovel[i]['index']
         cruzouPraBaixo = cruzamentosValorMediaMovel[i+1]['index']
         bins = dfHist[cruzouPraCima:cruzouPraBaixo][lambda y: y.frq > int(frequenciaMinima)][lambda x: x.frq == dfHist[cruzouPraCima:cruzouPraBaixo].frq.max()].bins.values
         if len(bins) > 0:
            pontos.append(bins[0])
      i += 1
   return pontos
