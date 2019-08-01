from datetime import date

meses = (
    'F', # Jan
    'G', # Fev
    'H', # Mar
    'J', # Abr
    'K', # Mai
    'M', # Jun
    'N', # Jul
    'Q', # Ago
    'U', # Set
    'V', # Out
    'X', # Nov
    'Z'  # Dez
    )
# meses = ('F', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'U', 'V', 'X', 'Z')
# Indice vence quarta feira mais proxima do dia 15 dos meses pares
# Dolar vence no 1º dia util do mes

def gerarLetraVencimento(hoje):
    if  (hoje.month % 2 > 0):
        winfut = 'WIN' + meses[hoje.month] + str(hoje.year)[2:4]
    elif (hoje.weekday() >= 2 and (hoje.day + 5-hoje.weekday() >= 15)):
        winfut = 'WIN' + meses[hoje.month+1] + str(hoje.year)[2:4]
    else:
        winfut = 'WIN' + meses[hoje.month-1] + str(hoje.year)[2:4]
    print(str(hoje.day) + '/' + str(hoje.month) + ' : ' + winfut)

gerarLetraVencimento(date(2019,4,9))
gerarLetraVencimento(date(2019,4,10))
gerarLetraVencimento(date(2019,4,11))
gerarLetraVencimento(date(2019,4,12))
gerarLetraVencimento(date(2019,4,15))
gerarLetraVencimento(date(2019,4,16))
gerarLetraVencimento(date(2019,4,17))

gerarLetraVencimento(date(2019,5,10))
gerarLetraVencimento(date(2019,5,13))
gerarLetraVencimento(date(2019,5,14))
gerarLetraVencimento(date(2019,5,15))

gerarLetraVencimento(date(2019,6,10))
gerarLetraVencimento(date(2019,6,11))
gerarLetraVencimento(date(2019,6,12))
gerarLetraVencimento(date(2019,6,13))
gerarLetraVencimento(date(2019,6,14))

