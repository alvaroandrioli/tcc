"""
Created on 22 de mar de 2017

@author: andrioli
"""
import logging
from src.eventEmitter import EventEmitter
from src.control import HandleController
from src.dataStorage import DataStorage

logger = logging.getLogger("handleSerialDataInit")

def handleSerialDataInit(socketio):
    hController = HandleController()
    rollFeedback = list()
    ee = EventEmitter()
    ds = DataStorage()
    
    @ee.on("SERIAL.READ_DATA")
    def serialReadData(data):
        logger.debug("serialReadData received data - {}".format(data))
        if (len(data) >= 3):
            rollSp, rollS = data.split(",")
            
            rollSp = int(rollSp)
            rollS = int(rollS)
            
            rollE = rollSp - rollS;
            logger.debug("SOCKET EVENT - SERIAL.EMIT_DATA - emit {}".format(data))
            
            if (len(rollFeedback) <= 5):
                rollFeedback.append(rollE)
            else:
                rollFeedback.pop(0)
                rollFeedback.append(rollE)
            
            rollC = normalize(hController.executeRoll(rollFeedback[:]))
            
            ds.write(rollS, rollSp)
            
            controlBuffer = '{}\n'.format(rollC)
            
            ee.emit("SERIAL.WRITE_DATA", "{}".format(controlBuffer))
            socketio.emit("SERIAL.EMIT_DATA", "{},{}".format(rollS, rollSp))
            socketio.sleep(0)
        else:
            logger.warning("data with len < 7 {}".format(data))
    
    @ee.on("SERIAL.REFRESH.VALIDATE")
    def sendValidateWorkbench(value):
        socketio.emit("SERIAL.REFRESH.RECEIVE", value)
        socketio.sleep(0)
    
    def normalize(value):
        value = int(value)
        if value > 1023:
            value = 1023
        elif value < -1023:
            value = -1023
        
        return value
        