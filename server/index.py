#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask
from serialData import readSerial
from flask_socketio import SocketIO, send
from threading import Thread

from eventEmitter import EventEmitter

app = Flask(__name__)
ee = EventEmitter()
socketio = SocketIO(app)

@ee.on('SERIAL.READ_DATA')
def printSerialData(data):
    print('É aqui mesmo')
    print(data)


if __name__ == "__main__":
    try:
        Thread(target = readSerial).start()

        socketio.run(app)
    except Exception as exc:
        Thread.interrupt_main()
        print(exc)
