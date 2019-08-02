class Operacao:   
    price = 0
    bs = 0
    slt = 0
    slti = 0
    slf = 0
    gain = 0
    distance = 0
    realizada = 0
    data_hora_entrada = 0
    data_hora_saida = 0
    # slt: stop loss tralling
    # slti: stop loss tralling input
    # slf: stop loss fix
    # bs: buy/sell
    def __init__(self, data_hora_entrada, bs, price, distance=0, slt=0, slti=0, slf=0, gain=0):
        self.price = price
        self.bs = bs
        self.slt = slt
        self.slti = slti
        self.slf = slf
        self.gain = gain
        self.distance = distance
        self.data_hora_entrada = data_hora_entrada
    
    def adjustStop(self, price):
        if self.bs == 'B':
            if self.slt != 0 and price - self.distance > self.slt:
                self.slt = price - self.distance
            elif self.slti != 0 and self.price + self.distance >= price:
                self.slti = self.price
        else:
            if self.slt != 0 and price + self.distance < self.slt:
                self.slt = price + self.distance
            elif self.slti != 0 and self.price - self.distance <= price:
                self.slti = self.price