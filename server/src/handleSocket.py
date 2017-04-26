"""
Created on 22 de mar de 2017

@author: andrioli
"""
from threading import Thread
from time import sleep
import logging

from src.serialData import readSerial
from src.eventEmitter import EventEmitter
from src.stateConstants import StateConstants

ee = EventEmitter()
logger = logging.getLogger("handleSocketDataInit")

def handleSocketDataInit(socketio):
        
    @socketio.on("SERIAL.BEGIN")
    def readSerialBegin():
        sc = StateConstants()
        sc.setConstant('SERIAL.OPEN', True)
        logger.info("SOCKET EVENT SERIAL.BEGIN received")
        Thread(target=readSerial).start()
        
    @socketio.on("SERIAL.END")
    def readSerialStop():
        sc = StateConstants()
        sc.setConstant('SERIAL.OPEN', False)
#     sleep(2)
#     readSerialBegin()