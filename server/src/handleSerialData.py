"""
Created on 22 de mar de 2017

@author: andrioli
"""
import logging
from src.eventEmitter import EventEmitter
from src.control import HandleController

logger = logging.getLogger("handleSerialDataInit")

def handleSerialDataInit(socketio):
    hController = HandleController()
    
    ee = EventEmitter()
    
    @ee.on("SERIAL.READ_DATA")
    def serialReadData(data):
        logger.debug("serialReadData received data - {}".format(data))
        if (len(data) >= 7):
            arfagemSp, arfagemS, guinadaSp, guinadaS = data.split(",")
            arfagemSp = int(arfagemSp)
            guinadaSp = int(guinadaSp)
            arfagemS = int(arfagemS)
            guinadaS = int(guinadaS)
            
            arfagemE = arfagemSp - arfagemS;
            guinadaE = guinadaSp - guinadaS;
            
            logger.debug("SOCKET EVENT - SERIAL.EMIT_DATA - emit {}".format(data))
            
            arfagemC = normalize(hController.executePitch(arfagemE))
            guinadaC = normalize(hController.executeYam(guinadaE))
            
            controlBuffer = '{},{}\n'.format(arfagemC, guinadaC)
            
            ee.emit("SERIAL.WRITE_DATA", controlBuffer)
            socketio.emit("SERIAL.EMIT_DATA", data)
        else:
            logger.warning("data with len < 7 {}".format(data))
    
    @ee.on("SERIAL.REFRESH.VALIDATE")
    def sendValidateWorkbench(value):
        socketio.emit("SERIAL.REFRESH.RECEIVE", value)
    
    def normalize(value):
        value = int(value)
        if value > 1023:
            value = 1023
        elif value < 0:
            value = 0
        
        return value
        