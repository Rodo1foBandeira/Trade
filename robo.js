

var robo = {
	url: 'https://mdgateway04.easynvest.com.br/iwg/snapshot/?t=webgateway&c=5448062&q=WINJ19',
	loss: 35,
	gain: 35,
	fechamento: 0,
	abertura: 0,
	max: 0,
	min: 0,
	valorAtual: 0,
	ticks: 15,
	operacoes:[],
	operacaoesAbertas: [],
	ticks: [],
	comprar: function(valor, qtd) {		
		this.operacaoesAbertas = this.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
		}) // Filtra posiçoes que esta vendido
		if (this.operacaoesAbertas.length > 0){
			// Esta vendido, reverte posição
			this.operacaoesAbertas.forEach(function(o, i){
				o.finalizado = valor;
				this.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'C' })
			})
		}else{			
			this.operacaoesAbertas = this.operacoes.filter(function(o, i){
				return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
			})// Filtra posiçoes que esta comprado
			if (this.operacaoesAbertas.length == 0){
				// Nao tem compra, entao compra
				this.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'C' })
			}
		}
	},
	comprarComGain: function(valor, qtd) {
		this.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'CG' })
	},
	
	vender: function(valor, qtd) {
		this.operacaoesAbertas = this.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
		}) // Filtra posiçoes que esta comprado
		if (this.operacaoesAbertas.length > 0){
			// Esta comprado, reverte posição
			this.operacaoesAbertas.forEach(function(o, i){
				o.finalizado = valor;
				this.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'V' })
			})
		}else{			
			this.operacaoesAbertas = this.operacoes.filter(function(o, i){
				return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
			})// Filtra posiçoes que esta vendido
			if (this.operacaoesAbertas.length == 0){
				// Nao tem compra, entao compra
				this.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'V' })
			}
		}
	},
	venderComGain: function(valor, qtd) {
		this.operacoes.push({valorOrdem: valor, qtd: qtd, tipo: 'VG' })
	},
	
	gerenciarStops: function(valorAtual){
		this.operacaoesAbertas = this.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'C';
		}) // Filtra posiçoes que esta comprado
		this.operacaoesAbertas.forEach(function(o, i){
			// Estrategia de reversão
			// Verifica somente loss
			if (o.valorOrdem - valorAtual >= this.loss){
				// loss
				o.finalizado = valorAtual;
			}
		})
		
		this.operacaoesAbertas = this.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'CG';
		}) // Filtra posiçoes que esta comprado		
		this.operacaoesAbertas.forEach(function(o, i){
			// Verifica loss e gain fixos
			if (o.valorOrdem - valorAtual >= this.loss){
				// loss
				o.finalizado = valorAtual;
			} else if (valorAtual - o.valorOrdem >= this.gain){
				// gain
				o.finalizado = valorAtual;
			}
		})
		
		this.operacaoesAbertas = this.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'V';
		}) // Filtra posiçoes que esta vendido
		this.operacaoesAbertas.forEach(function(o, i){
			// Estrategia de reversão
			// Verifica somente loss
			if (valorAtual - o.valorOrdem >= this.loss){
				// loss
				o.finalizado = valorAtual;
			}
		})
		
		this.operacaoesAbertas = this.operacoes.filter(function(o, i){
			return (o.finalizado == undefined || o.finalizado == null) && o.tipo == 'VG';
		}) // Filtra posiçoes que esta vendido
		this.operacaoesAbertas.forEach(function(o, i){
			// Verifica loss e gain fixos
			if (valorAtual - o.valorOrdem >= this.loss){
				// loss
				o.finalizado = valorAtual;
			} else if (o.valorOrdem - valorAtual  >= this.gain){
				// gain
				o.finalizado = valorAtual;
			}
		})
	}
	
	processar: function(){
		$.get(book.url, function( data ) {
			this.valorAtual = parseInt(data.Value[0].Ps.P);
			if (this.valorAtual > this.fechamento){
				// Teve nova maxima
				this.max = this.valorAtual
			}
			if (this.valorAtual < this.fechamento){
				// Teve nova minima
				this.minAtual = this.valorAtual
			}
			if (this.valorAtual - this.min == this.ticks){
				// Fechamento em alta 
				if (this.abertura - this.min >= (this.ticks / 2)){
					// Pavio >= 50% do tick
					// Compra
					this.comprar(this.valorAtual, 1);
					this.comprarComGain(this.valorAtual, 1)
				}
				this.ticks.push({min: this.min, abertura: this.abertura, fechamento: this.valorAtual, maxima: this.valorAtual});
				this.abertura = this.valorAtual
			}
			if (this.max - this.valorAtual == this.ticks){
				// Fechamento em baixa
				if (this.max - this.abertura >= (this.ticks / 2)){
					// Pavio >= 50% do tick
					// Venda
					this.vender(this.valorAtual, 1);
					this.venderComGain(this.valorAtual, 1)
				}
				this.ticks.push({min: this.valorAtual, abertura: this.abertura, fechamento: this.valorAtual, maxima: this.max});
				this.abertura = this.valorAtual;
			}
			this.gerenciarStops(this.valorAtual);
		})
	}
}
