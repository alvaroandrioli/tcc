import serial.tools.list_ports as list_ports
import serial

class SerialController(object):
    def __init__(self):
        try:
            arduinoPort = __getArduinoPort()

            self.serial_port = serial.Serial()
            self.port = arduinoPort.name
            self.baud = 9600

        except serial.serialutil.SerialException:
            self.serial_port = None

    def __getArduinoPort(self):
        arduinoPort = None;
        ports = list(list_ports.comports())

        for port in ports:
            if (port.manufacturer.lower().find('arduino') > -1)
                arduinoPort = port;
                break;

        print('arduinoPort - ')
        print(arduinoPort)
        return arduinoPort
