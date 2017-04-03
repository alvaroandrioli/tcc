import serial
from time import sleep

port = serial.Serial('/dev/ttyACM0', 115200)

sleep(1)
print(port.read_all())
print('initial clean complete')

while (1):
    res = port.readline()
    print('res -> ' + res)
