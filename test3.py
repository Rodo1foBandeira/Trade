from datetime import datetime

def now_minute_second():
	datetime_now = datetime.now()
	return float(datetime_now.strftime('%M') + '.' + datetime_now.strftime('%S'))
	
print(str(now_minute_second()))