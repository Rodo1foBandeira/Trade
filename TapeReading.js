var chart = new CanvasJS.Chart("chartContainer",
	{
		animationEnabled: true,
		zoomEnabled: true,
		title: {
			//text: "Basic Range Column Chart"
		},
		axisY: {
			includeZero: false,
            interval: 1,
			//title: "Temperature (C)"
		},
		axisX: {
			interval: 1
			},
		data: [
			/*{
				type: "candlestick",
				color: "#ad9AD",
				dataPoints: []
			},*/
            {
				//type: "spline",
				type: "line",
				color: "#369E00",
				dataPoints: []
            }
		]
	});
	chart.render();
	
var book = {
	count: 0,
	url: 'https://mdgateway04.easynvest.com.br/iwg/snapshot/?t=webgateway&c=5448062&q=WINJ19',
	atualizar: function(){		
		$.get(book.url, function( data ) {
			var retorno = data;
			var mmss = new Date().toTimeString().substr(6, 2);			
			var valor = parseInt(retorno.Value[0].Ps.P);
			var bid = retorno.Value[0].BBP.Bd[0].Q;
			var ask = retorno.Value[0].BBP.Ak[0].Q;
			//book.valor += 5; // Math.floor((Math.random() * 1000) + 1);
			chart.data[0].dataPoints.push({ x: book.count, label: mmss, y: valor });
			/*var idx = chart.data[1].dataPoints[chart.data[1].dataPoints.length - 1].x;
			
			var total = bid + ask;
			var bidP = bid / total * 100;
			var askP = ask / total * 100;
			
			bid = ((20 / 100) * bidP);
			ask = ((20 / 100) * askP);
			
			var candle = {
				x: book.count,
				y: [
					valor, // Open									
					valor - bid, // Low
					valor + ask, // High					
					bidP > 45 && bidP < 55 ? valor : bid < ask ? valor + ask : valor - bid // Close
					]
			};
			
			/*var candleAsk = {
				x: book.count,
				y: [
					valor, // Open					
					askP > bidP ? ask : valor, // Close
					valor, // High
					valor // Low
					]
			};*/
			
			/*chart.data[0].dataPoints.push(candle);
			
			chart.data[0].dataPoints[chart.data[0].dataPoints.length - 1].x = book.count;
			//chart.data[0].dataPoints[chart.data[0].dataPoints.length - 2].x = book.count;
			*/
			chart.render();
			
			book.count++;
			
			if(chart.data[0].dataPoints.length > 120){
				chart.data[0].dataPoints.splice(0, 1);
				//chart.data[0].dataPoints.splice(0, 1);
			}
		});			
	}
}