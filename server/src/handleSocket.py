'''
Created on 22 de mar de 2017

@author: andrioli
'''

def handleSocketDataInit(socketio):

    @socketio.on('TEST_EVENT')
    def handleTEST_EVENT(arq):
        print('handleTEST_EVENT')
        print(arq)