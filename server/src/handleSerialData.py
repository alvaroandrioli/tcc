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
    pitchFeedback = list()
    travelFeedback = list()
    ee = EventEmitter()
    
    @ee.on("SERIAL.READ_DATA")
    def serialReadData(data):
        logger.debug("serialReadData received data - {}".format(data))
        if (len(data) >= 7):
            pitchSp, pitchS, travelSp, travelS = data.split(",")
            pitchSp = int(pitchSp)
            travelSp = int(travelSp)
            pitchS = int(pitchS)
            travelS = int(travelS)
            
            pitchE = pitchSp - pitchS;
            travelE = travelSp - travelS;
            logger.debug("SOCKET EVENT - SERIAL.EMIT_DATA - emit {}".format(data))
            
            if (len(pitchFeedback) <= 5 and len(travelFeedback) <= 5):
                pitchFeedback.append(pitchE)
                travelFeedback.append(travelE)
            else:
                pitchFeedback.pop(0)
                pitchFeedback.append(pitchE)
               
                travelFeedback.pop(0)
                travelFeedback.append(travelE)
                
           
            pitchC = normalize(hController.executePitch(pitchFeedback))
            travelC = normalize(hController.executeTravel(travelFeedback))
            
            controlBuffer = '{},{}\n'.format(pitchC, travelC)
            
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
        