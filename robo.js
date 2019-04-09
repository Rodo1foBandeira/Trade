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
	tick: 45,
	operacoes:[],
	operacoesAbertas: [],
	ticks: [],
	ultimaMax: 0,
	ultimaMin: 0,
	flagOperacaoFechada: false,
	totalLoss: -200,
	totalGain: 1000,
	soma: 0,
	comprar: function(valor, qtd) {		
		robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
		}) // Filtra posiçoes que esta vendido
		if (robo.operacoesAbertas.length > 0){
			// Esta vendido, reverte posição
			robo.operacoesAbertas.forEach(function(o, i){
				o.finalizado = valor;
				o.dataFinalizacao = new Date();
				robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'C', data: o.dataFinalizacao })
			})
		}else{			
			robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
				return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
			})// Filtra posiçoes que esta comprado
			if (robo.operacoesAbertas.length == 0){
				// Nao tem compra, entao compra
				robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'C', data: new Date() })
			}
		}
	},
	comprarComGain: function(valor, qtd) {
		robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'CG',  data: new Date() });
		console.log('Comprado: ' + valor + ' x ' + qtd);
	},
	
	vender: function(valor, qtd) {
		robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
		}) // Filtra posiçoes que esta comprado
		if (robo.operacoesAbertas.length > 0){
			// Esta comprado, reverte posição
			robo.operacoesAbertas.forEach(function(o, i){
				o.finalizado = valor;
				o.dataFinalizacao = new Date();
				robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'V' })
			})
		}else{			
			robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
				return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
			})// Filtra posiçoes que esta vendido
			if (robo.operacoesAbertas.length == 0){
				// Nao tem compra, entao compra
				robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'V',  data: new Date() })
			}
		}
	},
	venderComGain: function(valor, qtd) {
		robo.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'VG',  data: new Date() });
		console.log('Vendido: ' + valor + ' x ' + qtd);
	},
	
	gerenciarStops: function(valorAtual){
		robo.flagOperacaoFechada = false;
		if (valorAtual > robo.ultimaMax)
			robo.ultimaMax = valorAtual;
			
		if (valorAtual < robo.ultimaMin)
			robo.ultimaMin = valorAtual;
			
		robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
		}) // Filtra posiçoes que esta comprado
		robo.operacoesAbertas.forEach(function(o, i){
			// Estrategia de reversão
			// Verifica somente loss
			if (o.valorOrdem - valorAtual >= robo.loss){
				// loss
				console.log('Loss: ' + (o.valorOrdem - valorAtual));
				o.finalizado = valorAtual;
				o.dataFinalizacao = new Date();
				robo.flagOperacaoFechada = true;
				
			} /*else if (robo.ultimaMax - valorAtual >= robo.loss){
				// loss de tendencia
				o.finalizado = valorAtual;
				o.dataFinalizacao = new Date();
				robo.flagOperacaoFechada = true;
				console.log('Loss seguiu tendencia: ' + (o.valorOrdem - valorAtual));
			}*/
		})
		
		robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'CG';
		}) // Filtra posiçoes que esta comprado		
		robo.operacoesAbertas.forEach(function(o, i){
			// Verifica loss e gain fixos
			if (o.valorOrdem - valorAtual >= robo.loss){
				// loss
				console.log('Loss: ' + (o.valorOrdem - valorAtual));
				o.finalizado = valorAtual;
				o.dataFinalizacao = new Date();
				robo.flagOperacaoFechada = true;
			} else if (valorAtual - o.valorOrdem >= robo.gain){
				// gain
				console.log('Gain: ' + (valorAtual - o.valorOrdem));
				o.finalizado = valorAtual;
				o.dataFinalizacao = new Date();
				robo.flagOperacaoFechada = true;
			}
		})
		
		robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
		}) // Filtra posiçoes que esta vendido
		robo.operacoesAbertas.forEach(function(o, i){
			// Estrategia de reversão
			// Verifica somente loss
			if (valorAtual - o.valorOrdem >= robo.loss){
				// loss
				console.log('Loss: ' + (valorAtual - o.valorOrdem));
				o.dataFinalizacao = new Date();
				o.finalizado = valorAtual;
				robo.flagOperacaoFechada = true;
			}/* else if (valorAtual - robo.ultimaMin >= robo.loss){
				// Loss de tendencia
				console.log('Loss seguiu tendencia: ' + (valorAtual - robo.ultimaMin));
				o.dataFinalizacao = new Date();
				o.finalizado = valorAtual;				
				robo.flagOperacaoFechada = true;
			}*/
		})
		
		robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'VG';
		}) // Filtra posiçoes que esta vendido
		robo.operacoesAbertas.forEach(function(o, i){
			// Verifica loss e gain fixos
			if (valorAtual - o.valorOrdem >= robo.loss){
				// loss
				console.log('Loss: ' + (valorAtual - o.valorOrdem));
				o.dataFinalizacao = new Date();
				o.finalizado = valorAtual;
				robo.flagOperacaoFechada = true;
			} else if (o.valorOrdem - valorAtual  >= robo.gain){
				// gain
				console.log('Gain: ' + (o.valorOrdem - valorAtual));
				o.dataFinalizacao = new Date();
				o.finalizado = valorAtual;
				robo.flagOperacaoFechada = true;
			}
		})
		
		if (robo.flagOperacaoFechada){
			robo.soma = 0;
			robo.operacoes.filter(function(o, i){ return o.finalizado != undefined && o.finalizado != null && o.finalizado > 0}).forEach(function(o, i){	
				if (o.tipo == 'CG'){
					robo.soma += o.finalizado - o.valorOrdem;
				}
				if (o.tipo == 'VG'){
					robo.soma += o.valorOrdem - o.finalizado;
				}
				
			});
			console.log('Saldo: ' + robo.soma);
			robo.ativo = robo.soma >= robo.totalLoss && robo.soma <= robo.totalGain;
		}
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
				
				robo.operacoesAbertas = robo.operacoes.filter(function(o, i){
						return (o.finalizado == undefined || o.finalizado == null);
					}) // Filtra posiçoes
				
				if (robo.valorAtual - robo.min >= robo.tick){
					// Fechamento em alta					
					if (robo.operacoesAbertas.length == 0 && robo.abertura - robo.min >= (robo.tick / 2)  && robo.ativo){
						// Pavio >= 50% do tick
						// Compra
						//robo.vender(robo.valorAtual, 1);
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
					if (robo.operacoesAbertas.length == 0 && robo.max - robo.abertura >= (robo.tick / 2) && robo.ativo){
						// Pavio >= 50% do tick
						// Venda
						//robo.comprar(robo.valorAtual, 1);
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
			
			setTimeout('robo.processar()', 100);
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
