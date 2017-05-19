import logging
from abc import ABCMeta, abstractmethod

logger = logging.getLogger("HandleController")

class HandleController(object):
    __pitchControl = None
    __yamControl = None
    __controllerFunctions = [];
    
    def setPitchController(self, identification):
        for control in self.__controllerFunctions:
            if (control.testController(identification)):
                logger.info("setPitchController - {}".format(identification))
                self.__pitchControl = control
                break
        
    def setYamController(self, identification):
        for control in self.__controllerFunctions:
            if (control.testController(identification)):
                logger.info("setYamController - {}".format(identification))
                self.__yamControl = control
                break
        
    def setPitchParams(self, params):
        logger.info("setPitchParams: {}".format(params))
        self.__pitchControl.setParams(params)
    
    def setYamParams(self, params):
        logger.info("setYamParams: {}".format(params))
        self.__yamControl.setParams(params)
    
    def executePitch(self, error):
        res = self.__pitchControl.execute(error)
        logger.debug("executePitch: error-{} controlSignal={}".format(error, res))
        return self.__pitchControl.execute(error);
   
    def executeYam(self, error):
        res = self.__yamControl.execute(error)
        logger.debug("executeYam: error-{} controlSignal={}".format(error, res))
        return res
    
    def addControllerFunction(self, controllerFunction):
        logger.info("CONTROL FUNCTION REGISTRED - {}".format(controllerFunction))
        self.__controllerFunctions.append(controllerFunction)

#interface
class ControllerInterface(object):
    __metaclass__ = ABCMeta
    
    @abstractmethod
    def execute(self, error): pass
    
    @abstractmethod
    def setParams(self, params): pass
    
    @abstractmethod
    def testController(self, param): pass
    
    @abstractmethod
    def __str__(self): pass


class PropotionalController(ControllerInterface):
    def __init__(self):
        
        super(PropotionalController, self).__init__()
        self.ident = 'propotional'
        
    def setParams(self, gain):
        self.gain = float(gain.pop())
    
    def execute(self, error):
        return self.gain * error
    
    def testController(self, identification):
        return identification == self.ident
    
    def __str__(self):
        return self.ident

hController = HandleController()
hController.addControllerFunction(PropotionalController())
    