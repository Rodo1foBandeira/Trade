var robo = {
	ativo: true,
	url: 'https://mdgateway04.easynvest.com.br/iwg/snapshot/?t=webgateway&c=5448062&q=WINJ19',
	loss: 65,
	gain: 65,
	fechamento: 0,
	abertura: 0,
	max: 0,
	min: 0,
	valorAtual: 0,
	tick: 30,
	operacoes:[],
	operacaoesAbertas: [],
	ticks: [],
	ultimaMax: 0,
	ultimaMin: 0,
	comprar: function(valor, qtd) {		
		robo.operacaoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
		}) // Filtra posiçoes que esta vendido
		if (robo.operacaoesAbertas.length > 0){
			// Esta vendido, reverte posição
			robo.operacaoesAbertas.forEach(function(o, i){
				o.finalizado = valor;
				o.dataFinalizacao = new Date();
				robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'C', data: o.dataFinalizacao })
			})
		}else{			
			robo.operacaoesAbertas = robo.operacoes.filter(function(o, i){
				return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
			})// Filtra posiçoes que esta comprado
			if (robo.operacaoesAbertas.length == 0){
				// Nao tem compra, entao compra
				robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'C', data: new Date() })
			}
		}
	},
	comprarComGain: function(valor, qtd) {
		robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'CG',  data: new Date() })
	},
	
	vender: function(valor, qtd) {
		robo.operacaoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
		}) // Filtra posiçoes que esta comprado
		if (robo.operacaoesAbertas.length > 0){
			// Esta comprado, reverte posição
			robo.operacaoesAbertas.forEach(function(o, i){
				o.finalizado = valor;
				o.dataFinalizacao = new Date();
				robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'V' })
			})
		}else{			
			robo.operacaoesAbertas = robo.operacoes.filter(function(o, i){
				return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
			})// Filtra posiçoes que esta vendido
			if (robo.operacaoesAbertas.length == 0){
				// Nao tem compra, entao compra
				robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'V',  data: new Date() })
			}
		}
	},
	venderComGain: function(valor, qtd) {
		robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'VG',  data: new Date() })
	},
	
	gerenciarStops: function(valorAtual){
		if (valorAtual > robo.ultimaMax)
			robo.ultimaMax = valorAtual;
			
		if (valorAtual < robo.ultimaMin)
			robo.ultimaMin = valorAtual;
			
		robo.operacaoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
		}) // Filtra posiçoes que esta comprado
		robo.operacaoesAbertas.forEach(function(o, i){
			// Estrategia de reversão
			// Verifica somente loss
			if (o.valorOrdem - valorAtual >= robo.loss){
				// loss
				o.finalizado = valorAtual;
				o.dataFinalizacao = new Date();
				
			} /*else if (robo.ultimaMax - valorAtual >= robo.loss){
				// loss de tendencia
				o.finalizado = valorAtual;
				o.dataFinalizacao = new Date();
			}*/
		})
		
		robo.operacaoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'CG';
		}) // Filtra posiçoes que esta comprado		
		robo.operacaoesAbertas.forEach(function(o, i){
			// Verifica loss e gain fixos
			if (o.valorOrdem - valorAtual >= robo.loss){
				// loss
				o.finalizado = valorAtual;
				o.dataFinalizacao = new Date();
			} else if (valorAtual - o.valorOrdem >= robo.gain){
				// gain
				o.finalizado = valorAtual;
				o.dataFinalizacao = new Date();
			}
		})
		
		robo.operacaoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
		}) // Filtra posiçoes que esta vendido
		robo.operacaoesAbertas.forEach(function(o, i){
			// Estrategia de reversão
			// Verifica somente loss
			if (valorAtual - o.valorOrdem >= robo.loss){
				// loss
				o.dataFinalizacao = new Date();
				o.finalizado = valorAtual;
			}/* else if (valorAtual - robo.ultimaMin >= robo.loss){
				// Loss de tendencia
				o.dataFinalizacao = new Date();
				o.finalizado = valorAtual;
			}*/
		})
		
		robo.operacaoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'VG';
		}) // Filtra posiçoes que esta vendido
		robo.operacaoesAbertas.forEach(function(o, i){
			// Verifica loss e gain fixos
			if (valorAtual - o.valorOrdem >= robo.loss){
				// loss
				o.dataFinalizacao = new Date();
				o.finalizado = valorAtual;
			} else if (o.valorOrdem - valorAtual  >= robo.gain){
				// gain
				o.dataFinalizacao = new Date();
				o.finalizado = valorAtual;
			}
		})
	},
	
	processar: function(){
		$.get(robo.url, function( data ) {
			robo.valorAtual = parseInt(data.Value[0].Ps.P);
			if (robo.valorAtual != robo.fechamento){
				if (robo.valorAtual > robo.max){
					// Teve nova maxima
					robo.max = robo.valorAtual
				}
				if (robo.valorAtual < robo.min){
					// Teve nova minima
					robo.min = robo.valorAtual
				}		

				chart.atualizarUltimo({minima: robo.min, abertura: robo.abertura, fechamento: robo.valorAtual, maxima: robo.max});
				
				if (robo.valorAtual - robo.min >= robo.tick){
					// Fechamento em alta 
					if (robo.abertura - robo.min >= (robo.tick / 2)){
						// Pavio >= 50% do tick
						// Compra
						robo.vender(robo.valorAtual, 1);
						robo.venderComGain(robo.valorAtual, 1)
					}
					robo.max = robo.valorAtual;
					//robo.ticks.push({minima: robo.min, abertura: robo.abertura, fechamento: robo.valorAtual, maxima: robo.max});
					chart.atualizar({minima: robo.min, abertura: robo.abertura, fechamento: robo.valorAtual, maxima: robo.max});
					robo.min = robo.valorAtual;
					robo.abertura = robo.valorAtual;
				}
				if (robo.max - robo.valorAtual >= robo.tick){
					// Fechamento em baixa
					if (robo.max - robo.abertura >= (robo.tick / 2)){
						// Pavio >= 50% do tick
						// Venda
						robo.comprar(robo.valorAtual, 1);
						robo.comprarComGain(robo.valorAtual, 1)
						
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
			if (robo.ativo)
				robo.processar();
		})
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
