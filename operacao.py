class Operacao:   
    entrada = 0
    cv = ''
    sl = 0    
    gain = 0
    distancia = 0
    saida = 0
    data_hora_entrada = 0
    data_hora_saida = 0
    # slt: stop loss tralling
    # slti: stop loss tralling input
    # slf: stop loss fix
    # bs: buy/sell
    def __init__(self, data_hora_entrada, cv, preco, distancia=0, gain=0):
        self.entrada = preco
        self.cv = cv
        self.gain = gain
        self.distancia = distancia
        self.data_hora_entrada = data_hora_entrada
        if cv[0] == 'C':
            self.sl = preco - distancia
        else:
            self.sl = preco + distancia
    
    def adjustStop(self, preco):
        if self.cv[0] == 'C':
            if self.cv[1:] == 'slt' and preco - self.distancia > self.sl:
                self.sl = preco - self.distancia
            if self.cv[1:] == 'slti' and preco >= self.entrada + self.distancia:
                self.sl = self.entrada
        else:
            if self.cv[1:] == 'slt' and preco + self.distancia < self.sl:
                self.sl = preco + self.distancia
            if self.cv[1:] == 'slti' and preco <= self.entrada - self.distancia:
                self.sl = self.entrada