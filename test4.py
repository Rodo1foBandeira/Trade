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
# Indice: vence quarta feira mais proxima do dia 15 dos meses pares
# Dolar: Primeiro dia útil do mês de vencimento Todos os meses do ano
dt = date.today()
dt.isocalendar()[0] #Ano
dt.isocalendar()[1] #Mes
dt.isocalendar()[2] #Dia