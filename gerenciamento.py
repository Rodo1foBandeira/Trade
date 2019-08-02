class Gerenciamento:

    operacoes = []

    def operacoesAbertas(self):
        return list(filter(lambda x: x.saida == 0, self.operacoes))

    def zerarTodas(self, preco, dataHora):
        for item in self.operacoesAbertas():
            item.saida = preco
            item.data_hora_saida = dataHora

    def novoPreco(self, preco, dataHora):
        for operacao in self.operacoesAbertas():
            if operacao.cv[0] == 'C':
                if preco <= operacao.sl or (operacao.gain != 0 and preco >= operacao.gain):
                    operacao.saida = preco
                    operacao.data_hora_saida = dataHora
                else:
                    operacao.adjustStop(preco)
            else:
                if preco >= operacao.sl or (operacao.gain != 0 and preco <= operacao.gain):
                    operacao.saida = preco
                    operacao.data_hora_saida = dataHora
                else:
                    operacao.adjustStop(preco)