"""
Created on 22 de mar de 2017

@author: andrioli
"""
import logging
from src.eventEmitter import EventEmitter

logger = logging.getLogger("handleSerialDataInit")

def handleSerialDataInit(socketio):
    
    ee = EventEmitter()
    
    @ee.on("SERIAL.READ_DATA")
    def serialReadData(data):
        logger.debug("serialReadData received data - {}".format(data))
        if (len(data) >= 7):
            arfagemSp, guinadaSp, arfagemS, guinadaS = data.split(",")
            arfagemSp = int(arfagemSp)
            guinadaSp = int(guinadaSp)
            arfagemS = int(arfagemS)
            guinadaS = int(guinadaS)
            
            arfagemE = arfagemSp - arfagemS;
            guinadaE = guinadaSp - guinadaS;
            
            #data = ",".join([str(arfagemE), str(guinadaE)])
            
            logger.debug("SOCKET EVENT - SERIAL.EMIT_DATA - emit {}".format(data))
            
            #ee.emit("SERIAL.WRITE_DATA", data)
            socketio.emit("SERIAL.EMIT_DATA", data)
        else:
            logger.warning("data with len < 7 {}".format(data))
        