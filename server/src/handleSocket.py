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
from time import sleep
from src.dataStorage import DataStorage

logger = logging.getLogger("handleSocketDataInit")


def handleSocketDataInit(socketio):
    hController = HandleController()
    ee = EventEmitter()
    ds = DataStorage()
    
    @socketio.on("SERIAL.BEGIN")
    def readSerialBegin():
        sc = StateConstants()
        sc.setConstant('SERIAL.OPEN', True)
        logger.info("SOCKET EVENT SERIAL.BEGIN received")
        ds.createNew();
        Thread(target=readSerial).start()        
        sleep(2)
        socketio.emit("SERIAL.BEGIN.RES")
        
    @socketio.on("SERIAL.END")
    def readSerialStop():
        sc = StateConstants()
        sc.setConstant("SERIAL.OPEN", False)
        ds.close()
        ee.emit("SERIAL.WRITE_DATA", 'e');
    
    @socketio.on("SERIAL.REFRESH.SEND")
    def serialRefreshSend():
        sc = StateConstants()
        
        socketio.emit("SERIAL.REFRESH.RECEIVE", sc.getConstant("SERIAL.CONNECTED"))
    
    @socketio.on("CONTROL.SET.ROLL")
    def setPitchController(params):
        vparams = params.split(',')
        identification = vparams[0]
        
        try:
            hController.setRollController(identification)
            hController.setRollParams(vparams[1:])
            socketio.emit("CONTROL.SET.ROLL.RES", '1')
        except:
            socketio.emit("CONTROL.SET.ROLL.RES", '0')

            
    
        