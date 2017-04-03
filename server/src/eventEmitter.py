import logging

logger = logging.getLogger('EventEmitter')

class EventEmitter(object):
    __instance = None
    eventDict = {}

    def __new__(cls):
        if EventEmitter.__instance is None:
            EventEmitter.__instance = object.__new__(cls)

        return EventEmitter.__instance

    def on(self, eventName, func = None):
        logger.debug('listener add on event: {}'.format(eventName))

        def _on(func):
            if (not self.eventDict.has_key(eventName)):
                logger.debug('event not registred')
                self.eventDict[eventName] = list()


            self.eventDict[eventName].append(func)
            logger.debug('registered')

            return func

        if func is not None:
            return _on(func)
        else:
            return _on

    def emit(self, eventName, data):
        logger.debug('event emitted - '.format(eventName))

        if (not self.eventDict.has_key(eventName)):
            return

        for function in self.eventDict[eventName]:
            function(data)
