import time, urllib.request, json

url = "https://mdgateway04.easynvest.com.br/iwg/snapshot/?t=webgateway&c=5448062&q=WINM19"
req = urllib.request.Request(url)

while(1):
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            price = float(data['Value'][0]['Ps']['P'])
            print('Preco: ' + str(price))
            print('Qtd total: ' + data['Value'][0]['Ps']['TT'])
            print('Negocios: ' + data['Value'][0]['Ps']['TC'])
            print('Data/Tempo: ' + data['Value'][0]['UT'])
    except urllib.error.URLError as e:
        print(e.reason)