'''
Created on 22 de mar de 2017

@author: andrioli
'''
from src.eventEmitter import EventEmitter

ee = EventEmitter()

@ee.on('SERIAL.READ_DATA')
def qualquerCoisa(data):
    print(data)
