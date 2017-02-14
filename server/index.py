#!/usr/bin/env python
# -*- coding: utf-8 -*-

from serialData import SerialController
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World! This is powered by Python backend."

if __name__ == "__main__":
    try:
        serialController = SerialController()

        serialController.start()

        app.run(host='127.0.0.1', port=5000)
    except Exception as exc:
        print(exc)
