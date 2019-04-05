var robo = {
	fechamento: 0,
	abertura: 0,
	max: 0,
	min: 0,
	valorAtual: 0,
	tick: 30,
	ultimaMax: 0,
	ultimaMin: 0,
	totalLoss: -40,
	totalGain: 80,
	qtdOperacao: 1,
	otoComprar: function(valor, qtd) {		
		
	},
	otoVender: function(valor, qtd) {
		
	},	
	
	processar: function(){
		robo.valorAtual = parseFloat($('#mCSB_1_container > ul > li.asset-WINJ19.active.positive > a > div:nth-child(1) > span:nth-child(2) > i.asset-price').text().replace('.', '').replace(',', '.'));
		if (robo.valorAtual != robo.fechamento){
			if (robo.valorAtual > robo.max){
				// Teve nova maxima
				robo.max = robo.valorAtual
			}
			if (robo.valorAtual < robo.min){
				// Teve nova minima
				robo.min = robo.valorAtual
			}
						
			if (robo.valorAtual - robo.min >= robo.tick){
				// Fechamento em alta					
				if (robo.operacoesAbertas.length == 0 && robo.abertura - robo.min >= (robo.tick / 2)  && robo.ativo){
					// Pavio >= 50% do tick
					// Provavelmente teve forte correçao na tendencia de baixa(Scalpers realizando)
					// Entao entra vendido para ganhar na proxima perna de baixa
					robo.otoVender(robo.valorAtual, robo.qtdOperacao);
				}
				robo.max = robo.valorAtual;
				robo.min = robo.valorAtual;
				robo.abertura = robo.valorAtual;
			}
			if (robo.max - robo.valorAtual >= robo.tick){
				// Fechamento em baixa
				if (robo.operacoesAbertas.length == 0 && robo.max - robo.abertura >= (robo.tick / 2) && robo.ativo){
					// Pavio >= 50% do tick
					// Provavelmente teve forte correçao na tendencia de alta(Scalpers realizando)
					// Entao entra comprado para ganhar na proxima perna de alta
					robo.comprarComGain(robo.valorAtual, robo.qtdOperacao)
				}
				robo.min = robo.valorAtual;
				//robo.ticks.push({minima: robo.min, abertura: robo.abertura, fechamento: robo.valorAtual, maxima: robo.max});
				chart.atualizar({minima: robo.min, abertura: robo.abertura, fechamento: robo.valorAtual, maxima: robo.max});
				robo.max = robo.valorAtual;
				robo.abertura = robo.valorAtual;
				
			}
			robo.gerenciarStops(robo.valorAtual);
			robo.fechamento = robo.valorAtual;
		}		
	}
}

$.get(robo.url, function( data ) {
	robo.fechamento = parseInt(data.Value[0].Ps.P);
	robo.abertura = parseInt(data.Value[0].Ps.P);
	robo.max = parseInt(data.Value[0].Ps.P);
	robo.min = parseInt(data.Value[0].Ps.P);
	robo.ultimaMin = parseInt(data.Value[0].Ps.P);
	robo.ultimaMax = parseInt(data.Value[0].Ps.P);
})
