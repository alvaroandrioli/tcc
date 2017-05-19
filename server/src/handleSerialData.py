"""
Created on 22 de mar de 2017

@author: andrioli
"""
import logging
from src.eventEmitter import EventEmitter
from src.control import HandleController

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
            
            logger.debug("SOCKET EVENT - SERIAL.EMIT_DATA - emit {}".format(data))
            
            arfagemC = int((180/1023.) * HandleController.executePitch(arfagemE))
            guinadaC = int((180/1023.) * HandleController.executeYam(guinadaE))  
            
            controlBuffer = '{},{}\n'.format(arfagemC, guinadaC)
            
            ee.emit("SERIAL.WRITE_DATA", controlBuffer)
            socketio.emit("SERIAL.EMIT_DATA", data)
        else:
            logger.warning("data with len < 7 {}".format(data))
    
    @ee.on("SERIAL.REFRESH.VALIDATE")
    def sendValidateWorkbench(value):
        socketio.emit("SERIAL.REFRESH.RECEIVE", value)
        
        