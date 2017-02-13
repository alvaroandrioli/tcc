#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function
import time
from flask import Flask
import serial.tools.list_ports as list_ports
import serial

# app = Flask(__name__)
#
# @app.route("/")
# def hello():
#     return "Hello World! This is powered by Python backend."
#
# if __name__ == "__main__":
#     print('oh hello')
#     #time.sleep(5)
#     app.run(host='127.0.0.1', port=5000)

ports = list(list_ports.comports())

arduinoPort = None

for port in ports:
    if (port.manufacturer.lower().find('arduino') > -1):
        print('Arduino connected in')
        print(port.name)
        arduinoPort = port
        break

serialPort = serial.Serial()
serialPort.baudrate = 9600
serialPort.port = arduinoPort.name
serialPort.open()
serialPort.is_open
