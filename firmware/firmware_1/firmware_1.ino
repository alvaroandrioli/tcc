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

  sensorQueue = xQueueCreate(5, sizeof(int));
  serialQueue = xQueueCreate(5, sizeof(char));
  
  generateNumberTimer = xTimerCreate("generateNumberTimer", pdMS_TO_TICKS(30), pdTRUE, 0, generateNumber);

  if (generateNumberTimer != NULL) {
    generateNumberBase = xTimerStart(generateNumberTimer, 0);

    xTaskCreate(printNumber, "printNumber", 100, NULL, 1, NULL);
    xTaskCreate(toggleLed, "toggleLed", 100, NULL, 1, NULL);

    if (generateNumberBase == pdPASS) {
      vTaskStartScheduler();
    }
  }
}

void generateNumber(void *p) {
    int num = random(10,20);
    xQueueSendToFront(sensorQueue, &num, 1); 
}

void printNumber(void *p) {
  int rNum;
  BaseType_t qStatus;
 
  while (true) {
    qStatus = xQueueReceive(sensorQueue, &rNum, 1);
    if (qStatus == pdPASS) {
      Serial.println(rNum);
    }
  }
}

void toggleLed(void *p) {
  char rData;
  BaseType_t qStatus;
  
  while (true) {
    qStatus = xQueueReceive(serialQueue, &rData, 1);
    if (qStatus == pdPASS) {
      switch (rData) {
        case 'l':
          digitalWrite(LED, 1);
        break;
        case 'd':
          digitalWrite(LED, 0);
        break;
      }
    }
  }
}

void serialEvent() {
  char readData;
  if (Serial.available()) {
    readData = Serial.read();
    xQueueSendToFront(serialQueue, &readData, 1);
  }
}

void loop() {
  
}
