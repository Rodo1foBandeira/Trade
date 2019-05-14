import urllib.request, json

with urllib.request.urlopen("https://mdgateway04.easynvest.com.br/iwg/snapshot/?t=webgateway&c=5448062&q=WINM19") as url:
	data = json.loads(url.read().decode())
	print('Preco: ' + str(type(data['Value'][0]['Ps']['P'])))
	print('Qtd total: ' + data['Value'][0]['Ps']['TT'])
	print('Negocios: ' + data['Value'][0]['Ps']['TC'])