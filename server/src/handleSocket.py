"""
Created on 22 de mar de 2017

@author: andrioli
"""
from threading import Thread
import logging

from src.serialData import readSerial
from src.eventEmitter import EventEmitter
from src.stateConstants import StateConstants
from src.control import HandleController

logger = logging.getLogger("handleSocketDataInit")
hController = HandleController()

def handleSocketDataInit(socketio):
    ee = EventEmitter()
       
    @socketio.on("SERIAL.BEGIN")
    def readSerialBegin():
        sc = StateConstants()
        sc.setConstant('SERIAL.OPEN', True)
        logger.info("SOCKET EVENT SERIAL.BEGIN received")
        Thread(target=readSerial).start()
        
    @socketio.on("SERIAL.END")
    def readSerialStop():
        sc = StateConstants()
        sc.setConstant("SERIAL.OPEN", False)
        ee.emit("SERIAL.WRITE_DATA", 'e');
    
    @socketio.on("SERIAL.REFRESH.SEND")
    def serialRefreshSend():
        sc = StateConstants()
        
        socketio.emit("SERIAL.REFRESH.RECEIVE", sc.getConstant("SERIAL.CONNECTED"))
    
    @socketio.on("CONTROL.SET.PITCH")
    def setPitchController(params):
        vparams = params.split(',')
        identification = vparams[0]
        
        hController.setPitchController(identification)
        hController.setPitchParams(vparams[1:])
    
    @socketio.on("CONTROL.SET.YAM")
    def setYamController(params):
        vparams = params.split(',')
        identification = vparams[0]
        
        hController.setYamController(identification)
        hController.setYamParams(vparams[1:])
    
        