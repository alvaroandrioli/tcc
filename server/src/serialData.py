import serial.tools.list_ports as list_ports
import serial
import logging
from time import sleep
from threading import Lock
from threading import Timer

from eventEmitter import EventEmitter
from stateConstants import StateConstants

logger = logging.getLogger('handleSocketDataInit')

serialPort = None
serialMutex = None

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
    
    serialMutex = Lock()
    sc = StateConstants()
    
    openSerial()
    sleep(3) #tempo para a porta serial ligar
    logger.debug(serialPort.read_all())
    
    while (True):
        #safeBlock
        if (serialPort.in_waiting):
            
            serialMutex.acquire()
            readData = serialPort.readline()
            serialMutex.release()
            
            ee.emit("SERIAL.READ_DATA", readData)
            
            if not sc.getConstant('SERIAL.OPEN'):
                break
            
            
    
    logger.info("SERIAL STOPED")
    serialMutex = None
    serialPort.close()

def checkWorkbench():
    sc = StateConstants()
    Timer(3, checkWorkbench).start()
    serialPort = None
    
    ports = list(list_ports.comports())

    for port in ports:
        if (port.manufacturer.lower().find("arduino") > -1):
            serialPort = port;
            break;
        
    sc.setConstant("SERIAL.CONNECTED", bool(serialPort))
    ee.emit("SERIAL.REFRESH.VALIDATE", bool(serialPort))


@ee.on("SERIAL.WRITE_DATA")
def printSerial(data):
    global serialPort
    global serialMutex
    
    serialMutex.acquire()
    logger.info("printSerial - {}".format(data))
    serialPort.write(str(data))
    serialMutex.release()

checkWorkbench()
        