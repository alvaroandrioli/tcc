#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask
from flask_socketio import SocketIO, send
import sys

from src.serialData import SerialRead
from src.handleSocket import handleSocketDataInit

app = Flask(__name__)

socketio = SocketIO(app)
    

if __name__ == '__main__':
    try:
        handleSocketDataInit(socketio)
#         serialRead = SerialRead()
#         
#         serialRead.run()
        
        socketio.run(app, port=3000)
    except Exception as exc:
        sys.exit()
        print(exc)
