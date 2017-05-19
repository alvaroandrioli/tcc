#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask
from flask_socketio import SocketIO
import sys
import logging

from src.handleSocket import handleSocketDataInit
from src.handleSerialData import handleSerialDataInit

logging.basicConfig(level=logging.INFO,
                    format="[%(asctime)s] %(name)s [%(levelname)s] - %(message)s")

logger = logging.getLogger('Main') 

app = Flask(__name__)

socketio = SocketIO(app)    

if __name__ == '__main__':
    try:
        handleSocketDataInit(socketio)
        handleSerialDataInit(socketio)
        
        socketio.run(app, port=3000)
    except Exception as exc:
        sys.exit()
        logger.error(exc)
