import serial.tools.list_ports as list_ports
import serial
import logging
from time import sleep
from threading import Lock

from eventEmitter import EventEmitter
from stateConstants import StateConstants

logger = logging.getLogger('handleSocketDataInit')

serialPort = None
serialMutex = Lock()

ee = EventEmitter()

serialPort = None

def getArduinoPort():
    arduinoPort = None;
    ports = list(list_ports.comports())

    for port in ports:
        if (port.manufacturer.lower().find("arduino") > -1):
            arduinoPort = port;
            break;

    if (not arduinoPort):
        raise Exception("Arduino Port not found")

    logger.info("arduinoPort - {}".format(arduinoPort))
    return arduinoPort

def openSerial():
    global serialPort
    
    arduinoPort = getArduinoPort()
    serialPort = serial.Serial()
    
    serialPort.port = arduinoPort.device
    serialPort.baudrate = 115200
    serialPort.timeout = None
    
    serialPort.open()

def readSerial():
    global serialPort
    global serialMutex
    sc = StateConstants()
    
    openSerial()
    sleep(3) #tempo para a porta serial ligar
    logger.debug(serialPort.read_all())
    
    while (True):
        #safeBlock
        if (serialPort.in_waiting):
            
            serialMutex.acquire()
            
            readData = serialPort.readline()
            ee.emit("SERIAL.READ_DATA", readData)
            
            if not sc.getConstant('SERIAL.OPEN'):
                break
            
            serialMutex.release()
 
    logger.info("SERIAL STOPED")
    serialPort.close()
    
@ee.on("SERIAL.WRITE_DATA")
def printSerial(data):
    global serialPort
    global serialMutex
    
    serialMutex.acquire()
    logger.debug("printSerial - {}".format(data))
    serialPort.write(str(data))
    serialMutex.release()
        