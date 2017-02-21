import serial.tools.list_ports as list_ports
from eventEmitter import EventEmitter
import serial

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

    print('arduinoPort - ')
    print(arduinoPort)
    return arduinoPort

def readSerial():
    arduinoPort = getArduinoPort()

    serialPort = serial.Serial()
    serialPort.port = arduinoPort.device
    serialPort.baudrate = 9600

    serialPort.open()

    while (True):
        readData = serialPort.readline()
        ee.emit("SERIAL.READ_DATA", readData)
