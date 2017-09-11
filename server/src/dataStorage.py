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
    __csvPath = "/resource/data_log_";
    __file = None
    
    def __new__(cls):
        if DataStorage.__instance is None:
            DataStorage.__instance = object.__new__(cls)
    
    def createNew(self):
        if (self.__file == None):
            csvPath = self.__csvPath + datetime.datetime.fromtimestamp(time.time()).strftime('%Y_%m_%d_%H_%M_%S') + '.csv'
           
            self.__file = file(csvPath, 'w')
            self.__file.write('error, control\n')
        else:
            raise FileError('arquivo já aberto')
    
    def write(self, error, control):
        if (self.__file == None):
            raise FileNotFoundError('arquivo de escrita não criado')
        else:
            self.__file.write(str(error) + ', ' + str(control) + '/n')
            
    def close(self):
        if (self.__file == None):
            raise FileError('o arquivo não está aberto')
        else:
            self.__file.close()
        