import urllib.request, json, pytz
from datetime import datetime, timedelta

def toDate(dtStr):
    return datetime(int(dtStr[0:4]), int(dtStr[5:7]), int(dtStr[8:10]), int(dtStr[11:13]), int(dtStr[14:16]), int(dtStr[17:19]), int(dtStr[20:24]), tzinfo=pytz.UTC)

with urllib.request.urlopen("https://mdgateway04.easynvest.com.br/iwg/snapshot/?t=webgateway&c=5448062&q=WINM19") as url:
	data = json.loads(url.read().decode())
	print('Preco: ' + str(type(data['Value'][0]['Ps']['P'])))
	print('Qtd total: ' + data['Value'][0]['Ps']['TT'])
	print('Negocios: ' + data['Value'][0]['Ps']['TC'])

	response = data['Value'][0]
	for item in response['Ts']:
		item['DT'] = toDate(item['DT'])
		item['Br'] = int(item['Br'])
		item['Sr'] = int(item['Sr'])
		item['Q'] = int(item['Q'])
		item['P'] = float(item['P'])

	response['Ts'][0]['DT'] = response['Ts'][0]['DT'] + timedelta(days=1)		
	tst = sorted(response['Ts'], key=lambda x: x['DT'])

	for item in tst:
		print(str(item['DT']))
