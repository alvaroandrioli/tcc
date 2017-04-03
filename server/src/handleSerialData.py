'''
Created on 22 de mar de 2017

@author: andrioli
'''
import logging

from src.eventEmitter import EventEmitter

logger = logging.getLogger('handleSerialDataInit')

def handleSerialDataInit(socketio):
    
    ee = EventEmitter()
    
    @ee.on('SERIAL.READ_DATA')
    def serialReadData(data):
        logger.debug('serialReadData received data - {}'.format(data))
        if (len(data) >= 2):
            a,b = data.split(',')
            a = float(a)
            b = float(b)
            c = a - b;
            data = ','.join([str(a), str(b), str(c)])
            logger.debug('SOCKET EVENT - SERIAL.EMIT_DATA - emit {}'.format(data))
            socketio.emit('SERIAL.EMIT_DATA', data)
        else:
            logger.warning('data with len < 2 {}'.format(data))
    
