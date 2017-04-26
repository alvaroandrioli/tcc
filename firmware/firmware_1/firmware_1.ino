#include <Arduino_FreeRTOS.h>
#include <queue.h>
#include <timers.h>

#define LED 13

QueueHandle_t sensorQueue, serialQueue;
TimerHandle_t generateNumberTimer;
BaseType_t generateNumberBase;

void setup() {
  Serial.begin(115200);

  pinMode(LED, OUTPUT);

  digitalWrite(LED, 0);
  
  randomSeed(analogRead(A1));

  sensorQueue = xQueueCreate(5, sizeof(char *));
//  serialQueue = xQueueCreate(5, sizeof(char));
 
  generateNumberTimer = xTimerCreate("generateNumberTimer", pdMS_TO_TICKS(30), pdTRUE, 0, generateNumber);
 

  if (generateNumberTimer == NULL) {
    Serial.println("DEU PAU");
  } else {
    generateNumberBase = xTimerStart(generateNumberTimer, 0);

    xTaskCreate(printNumber, "printNumber", 100, NULL, 1, NULL);
  }
//
//  if (generateNumberTimer != NULL) {
//    generateNumberBase = xTimerStart(generateNumberTimer, 0);
//
//    xTaskCreate(printNumber, "printNumber", 100, NULL, 1, NULL);
//    xTaskCreate(toggleLed, "toggleLed", 100, NULL, 1, NULL);
//
//    if (generateNumberBase == pdPASS) {
//      vTaskStartScheduler();
//    }
//  }
}

void generateNumber(void *p) {
  char *res = (char *) malloc(sizeof(nome));
    
  sprintf(res, "%d,%d", random(0,1023),
                              random(0,1023));
  
  xQueueSendToFront(sensorQueue, &res, 100); 
}

void printNumber(void *p) {
  char *res;
  BaseType_t qStatus;
 
  while (1) {
    qStatus = xQueueReceive(sensorQueue, &res, 100);
    if (qStatus == pdPASS) {
      Serial.println(res);
      free(res);
    }
   
  }
}
//
//void toggleLed(void *p) {
//  char rData;
//  BaseType_t qStatus;
//  
//  while (true) {
//    qStatus = xQueueReceive(serialQueue, &rData, 1);
//    if (qStatus == pdPASS) {
//      switch (rData) {
//        case 'l':
//          digitalWrite(LED, 1);
//        break;
//        case 'd':
//          digitalWrite(LED, 0);
//        break;
//      }
//    }
//  }
//}
//
//void serialEvent() {
//  char readData;
//  if (Serial.available()) {
//    readData = Serial.read();
//    xQueueSendToFront(serialQueue, &readData, 1);
//  }
//}

void loop() {
  
}
