import logging

logger = logging.getLogger('StateConstants')

class StateConstants(object):
    __instance = None
    eventConstants = {}

    def __new__(cls):
        if StateConstants.__instance is None:
            StateConstants.__instance = object.__new__(cls)

        return StateConstants.__instance
    
    def setConstant(self, const, value):
        self.eventConstants[str(const)] = value
        
    def getConstant(self, const):
        return self.eventConstants[const]