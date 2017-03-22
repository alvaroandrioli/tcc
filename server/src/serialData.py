import serial.tools.list_ports as list_ports
from src.eventEmitter import EventEmitter
import serial
import time
from threading import Thread 

ee = EventEmitter()
class SerialRead(Thread):
    def __init__(self):
        self.arduinoPort = self.getArduinoPort()
    
        self.serialPort = serial.Serial()
        self.serialPort.port = self.arduinoPort.device
        self.serialPort.baudrate = 9600
        
    def getArduinoPort(self):
        arduinoPort = None;
        ports = list(list_ports.comports())
    
        for port in ports:
            if (port.manufacturer.lower().find('arduino') > -1):
                arduinoPort = port;
                break;
    
        if (not arduinoPort):
            raise Exception('Arduino Port not found')
    
        print('arduinoPort - ')
        print(arduinoPort)
        return arduinoPort

    def run(self):
        self.serialPort.open()
    
        while (True):
            time.sleep(1)
            readData = self.serialPort.readline()
            ee.emit('SERIAL.READ_DATA', readData)
