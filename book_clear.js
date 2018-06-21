var book = {
	textToInt: function (val){
		var vAux = val;		
		if (vAux.indexOf('k') > 0 || vAux.indexOf('K') > 0){
			vAux.replace(',', '.').replace('k', '');
			vAux = parseInt(vAux) * 1000;			
		}else{
			vAux = parseFloat(vAux.replace('.', '').replace(',', '.'));
		}
		return vAux;
	},
	bookInstante: {compra: [], venda: []},
	bookMediaInstante: {},
	carregarBookInstante: function(){
		var compra = [];
		var	venda = [];
		$('#bjbss3 tr').each(function (i, e){
			var qtdC = robo.textToInt($($(e).find('td a')[0]).text());
			var vlrC = robo.textToInt($($(e).find('td a')[1]).text());
			compra.push({qtd: qtdC, valor: vlrC});
			
			var qtdV = robo.textToInt($($(e).find('td a')[3]).text());
			var vlrV = robo.textToInt($($(e).find('td a')[2]).text());
			venda.push({qtd: qtdV, valor: vlrV});
		});		
		this.bookInstante.compra = compra;
		this.bookInstante.venda = venda;
		
		this.calcularBookMediaInstante();
	},
	calcularBookMediaInstante: function(){
		var somaC = 0;
		var somaQtdC = 0;
		for(var i = 0; i < robo.bookInstante.compra.length; i++){
			somaC += (robo.bookInstante.compra[i].qtd * robo.bookInstante.compra[i].valor);
			somaQtdC += robo.bookInstante.compra[i].qtd;
		};
		this.bookMediaInstante.compra = somaC / somaQtdC;
		
		var somaV = 0;
		var somaQtdV = 0;
		for(var i = 0; i < robo.bookInstante.venda.length; i++){
			somaV += (robo.bookInstante.venda[i].qtd * robo.bookInstante.venda[i].valor);
			somaQtdV += robo.bookInstante.venda[i].qtd;
		};
		this.bookMediaInstante.venda = somaV / somaQtdV;
	}	
}
