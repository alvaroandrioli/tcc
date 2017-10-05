'''
Created on 5 de set de 2017

@author: andrioli
'''
import datetime
import time
from numpy.f2py.auxfuncs import throw_error
from ptyprocess.ptyprocess import FileNotFoundError
from click.exceptions import FileError

class DataStorage(object):
    __instance = None
    __csvPath = "resource/data.log/data_log_";
    __file = None
    
    def __new__(cls):
        if DataStorage.__instance is None:
            DataStorage.__instance = object.__new__(cls)
            
        return DataStorage.__instance
    
    def createNew(self):
        if (self.__file == None):
            csvPath = self.__csvPath + datetime.datetime.fromtimestamp(time.time()).strftime('%Y_%m_%d_%H_%M_%S') + '.csv'
           
            self.__file = file(csvPath, 'w')
            self.__file.write('sinal,sensor\n')
        else:
            raise FileError('arquivo ja aberto')
    
    def write(self, sinal, sensor):
        if (self.__file == None):
            raise FileNotFoundError('arquivo de escrita nao criado')
        else:
            self.__file.write(str(sinal) + ',' + str(sensor) + '\n')
            
    def close(self):
        if (self.__file == None):
            raise FileError('o arquivo nao esta aberto')
        else:
            self.__file.close()
            self.__file = None
        