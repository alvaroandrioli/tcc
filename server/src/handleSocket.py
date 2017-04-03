'''
Created on 22 de mar de 2017

@author: andrioli
'''
from threading import Thread
from time import sleep
import logging

from src.serialData import readSerial

logger = logging.getLogger('handleSocketDataInit')

def handleSocketDataInit(socketio):
        
    @socketio.on('SERIAL.BEGIN')
    def readSerialBegin():
        logger.info('SOCKET EVENT SERIAL.BEGIN received')
        Thread(target=readSerial).start()
        
    @socketio.on('SERIAL.TEST')
    def readTestSerial(msg):
        logger.info('SOCKET SERIAL.TEST received')
        socketio.emit('SERIAL.TEST2', msg)
        
#     sleep(2)
#     readSerialBegin()