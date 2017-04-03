import serial.tools.list_ports as list_ports
import serial
import logging
from time import sleep

from eventEmitter import EventEmitter

logger = logging.getLogger('handleSocketDataInit')

ee = EventEmitter()

def getArduinoPort():
    arduinoPort = None;
    ports = list(list_ports.comports())

    for port in ports:
        if (port.manufacturer.lower().find('arduino') > -1):
            arduinoPort = port;
            break;

    if (not arduinoPort):
        raise Exception("Arduino Port not found")

    logger.info('arduinoPort - {}'.format(arduinoPort))
    return arduinoPort

def readSerial():
    arduinoPort = getArduinoPort()

    serialPort = serial.Serial()
    serialPort.port = arduinoPort.device
    serialPort.baudrate = 115200
    serialPort.timeout = None

    serialPort.open()
    sleep(4) #tempo para a porta serial ligar
    logger.debug(serialPort.read_all())
    
    while (True):
        readData = serialPort.readline()
        ee.emit("SERIAL.READ_DATA", readData)
        