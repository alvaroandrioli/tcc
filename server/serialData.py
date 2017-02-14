import serial.tools.list_ports as list_ports
from threading import Thread
import serial

class SerialController(Thread):
    def __init__(self):
        Thread.__init__(self)
        try:
            arduinoPort = self.__getArduinoPort()

            self.serialPort = serial.Serial()
            self.serialPort.port = arduinoPort.device
            self.serialPort.baudrate = 9600

        except Exception as inst:
            raise inst

    def __getArduinoPort(self):
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

    def run(self):
        self.serialPort.open()

        while (True):

            print(self.serialPort.readline())
