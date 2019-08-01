var chart = new CanvasJS.Chart("chartContainer",
{
	animationEnabled: true,
	zoomEnabled: true,
	title: {
		//text: "Basic Range Column Chart"
	},
	axisY: {
		includeZero: false,
		interval: 30,
		//title: "Temperature (C)"
	},
	axisX: {
		interval: 1
		},
	data: [
		{
			type: "candlestick",
			dataPoints: []
		}
	]
});
chart.render();

chart.count = 0;



chart.atualizarUltimo = function(candle){
	// candle.y[o, h, l, c]
	if (chart.data[0].dataPoints.length > 0){
		chart.data[0].dataPoints[chart.data[0].dataPoints.length - 1].y = [candle.abertura, candle.maxima, candle.minima, candle.fechamento];
		chart.render();
	}	
}

chart.atualizar = function(candle){					
	// candle.y[o, h, l, c]
	var candle = {
		x: chart.count,
		y: [candle.abertura, candle.maxima, candle.minima, candle.fechamento]
	};	
		
		
		chart.data[0].dataPoints.push(candle);
		
		
		chart.render();
		
		chart.count++;
		
		/*if(chart.data[0].dataPoints.length > 120){
			chart.data[0].dataPoints.splice(0, 1);
		}*/
	}