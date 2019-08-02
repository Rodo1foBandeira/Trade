class Gerenciamento:

    operacoes = []

    def operacoesAbertas(self):
        return list(filter(lambda x: x.realizada == 0, self.operacoes))

    def novoPreco(self, preco, dataHora):
        for operacao in self.operacoesAbertas():
            if operacao.bs == 'B':
                if preco <= operacao.slt or preco <= operacao.slti or preco <= operacao.slf or (operacao.gain != 0 and preco >= operacao.gain):
                    operacao.realizada = preco
                    operacao.data_hora_saida = dataHora
                else:
                    operacao.adjustStop(preco)

            if operacao.bs == 'S':
                if (operacao.slt != 0 and preco >= operacao.slt) or (operacao.slti != 0 and preco >= operacao.slti) or (operacao.slf != 0 and preco <= operacao.slf) or (operacao.gain != 0 and preco <= operacao.gain):
                    operacao.realizada = preco
                    operacao.data_hora_saida = dataHora
                else:
                    operacao.adjustStop(preco)