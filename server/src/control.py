from abc import ABCMeta, abstractmethod
import logging

logger = logging.getLogger("HandleController")

class HandleController(object):
    __instance = None
    __rollControl = None
    __controllerFunctions = [];
    
    def __new__(cls):
        if HandleController.__instance is None:
            HandleController.__instance = object.__new__(cls)
            
        return HandleController.__instance

    def setRollController(self, identification):
        for control in self.__controllerFunctions:
            if (control.testController(identification)):
                logger.info("setRollController - {}".format(identification))
                self.__rollControl = control
                break
        
    def setRollParams(self, params):
        logger.info("setRollParams: {}".format(params))
        self.__rollControl.setParams(params)
    
    
    def executeRoll(self, feedback):
        res = self.__rollControl.execute(feedback[:])
        logger.info("executeRoll: error={} controlSignal={}".format(feedback.pop(), res))
        return res;
   
    def addControllerFunction(self, controllerFunction):
        logger.info("CONTROL FUNCTION REGISTRED - {}".format(controllerFunction))
        self.__controllerFunctions.append(controllerFunction)

# interface
class ControllerInterface(object):
    __metaclass__ = ABCMeta
    
    @abstractmethod
    def execute(self, errorList): pass
    
    @abstractmethod
    def setParams(self, params): pass
    
    @abstractmethod
    def testController(self, param): pass
    
    @abstractmethod
    def __str__(self): pass

# implementation
class PropotionalController(ControllerInterface):
    def __init__(self):
        super(PropotionalController, self).__init__()
        self.ident = 'propotional'
        
    def setParams(self, gain):
        self.gain = float(gain.pop())
    
    def execute(self, feedback):
        return self.gain * feedback.pop()
    
    def testController(self, identification):
        return identification == self.ident
    
    def __str__(self):
        return self.ident


# class CustomController(ControllerInterface):
#    def __init__(self):    
#        super(PropotionalController, self).__init__()
#        self.ident = 'custom'
#        self.function = None
#        
#    def setParams(self, stringCode):
#        self.code = string(stringCode)
#        self.function = compile(self.code, 'frontControlFunction', 'exec')
#        
#    def execute(self, feedback):
#        eval(self.function)
#        
#        return fControl(feedback)
#    
#    def testController(self, identification):
#        return identification == self.ident
#    
#    def __str__(self):
#        return self.ident

hController = HandleController()
hController.addControllerFunction(PropotionalController())
    
