$('#choose-strategy').val(4); // Seta OTO
$('#choose-strategy').change();

var robo = {
	fechamento: 0,
	abertura: 0,
	max: 0,
	min: 0,
	valorAtual: 0,
	tick: 35,
	ultimaMax: 0,
	ultimaMin: 0,

	totalLoss: -40,
	totalGain: 80,
	qtdOperacao: 1,

	abaOtoTipoOrdem: '#choose-strategy',	

	abaOtoCompra: '.container_boleta.daytrade .bt_buy a',
	abaOtoCompraQtd: '.form-oto.daytrade-compra-oto #input-quantity',

	abaOtoVenda: '.container_boleta.daytrade .bt_sell a',
	abaOtoVendaQtd: '.form-oto.daytrade-venda-oto #input-quantity',

	abaOtoEfetuarOrdem: '.assinatura_cta.oto .buy-sell-label button',
	
	seletorValorAtual: '.asset-WINJ19 .asset-price',

	otoComprar: function(valor) {		
		$(robo.abaOtoCompra).click(); // Clica na aba de compra
		$(robo.abaTipoOrdem).val(4); // Seta OTO		
		$(robo.abaTipoOrdem).change();
		$(robo.abaOtoCompraQtd).val(robo.qtdOperacao);
		$(robo.abaOtoEfetuarOrdem).click(); // Efetua compra
		console.log('Compra: ' + valor);
	},
	otoVender: function(valor) {
		$(robo.abaOtoVender).click(); // Clica na aba de venda
		$(robo.abaTipoOrdem).val(4); // Seta OTO		
		$(robo.abaTipoOrdem).change();
		$(robo.abaOtoVendaQtd).val(robo.qtdOperacao);
		$(robo.abaOtoEfetuarOrdem).click(); // Efetua venda
		console.log('Venda: ' + valor);
	},	
	
	abaPosicao: $('body > div.container.daytrade > div.container_views.active > div.views_header > ul > li.active > a'),
	abaPosicaoQtd: '',
	abaPosicaoValor: '',

	naoPosicionado: function(){		
		$(robo.abaPosicao).click();
		var naoPosicionad = true;
		if ($(robo.abaPosicaoQtd).length > 0)
			naoPosicionad = parseInt($(robo.abaPosicaoQtd).text()) == 0;
		return naoPosicionad; 
	},

	valorPosicao: function(){
		$(robo.abaPosicao).click();
		var valor = 0.0;
		if ($(robo.abaPosicaoQtd).length > 0)
			valor = parseFloat($(robo.abaPosicaoValor).text().replace('.', '').replace(',', '.'));
		return valor;
	},

	processar: function(){
		// Não esta posicionado, nao ultrapassou loss e nao ultrapassou gain
		robo.valorAtual = parseFloat($(robo.seletorValorAtual).text().replace('.', '').replace(',', '.'));
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
				if (robo.naoPosicionado() && robo.valorPosicao() >= robo.totalLoss && robo.valorPosicao() <= robo.totalGain && (robo.abertura - robo.min >= (robo.tick / 2))){
					// Pavio >= 50% do tick
					// Provavelmente teve forte correçao na tendencia de baixa(Scalpers realizando)
					// Entao entra vendido para ganhar na proxima perna de baixa
					robo.otoVender(robo.valorAtual);
				}
				robo.max = robo.valorAtual;
				robo.min = robo.valorAtual;
				robo.abertura = robo.valorAtual;
			}
			if (robo.max - robo.valorAtual >= robo.tick){
				// Fechamento em baixa
				if (robo.naoPosicionado() && robo.valorPosicao() >= robo.totalLoss && robo.valorPosicao() <= robo.totalGain && (robo.max - robo.abertura >= (robo.tick / 2)){
					// Pavio >= 50% do tick
					// Provavelmente teve forte correçao na tendencia de alta(Scalpers realizando)
					// Entao entra comprado para ganhar na proxima perna de alta
					robo.otoComprar(robo.valorAtual)
				}
				robo.min = robo.valorAtual;
				robo.max = robo.valorAtual;
				robo.abertura = robo.valorAtual;
				
			}
			robo.fechamento = robo.valorAtual;
		}	
	}
}

robo.fechamento = parseFloat($(robo.seletorValorAtual).text().replace('.', '').replace(',', '.'));
robo.abertura = parseFloat($(robo.seletorValorAtual).text().replace('.', '').replace(',', '.'));
robo.max = parseFloat($(robo.seletorValorAtual).text().replace('.', '').replace(',', '.'));
robo.ultimaMin = parseFloat($(robo.seletorValorAtual).text().replace('.', '').replace(',', '.'));
robo.ultimaMax = parseFloat($(robo.seletorValorAtual).text().replace('.', '').replace(',', '.'));
robo.min = parseFloat($(robo.seletorValorAtual).text().replace('.', '').replace(',', '.'));